const { Endereco, Contato, Clube, Atleta, ResponsavelAtleta, sequelize } = require('../models');

exports.listarAtletas = async (req, res) => {
    try {
        const codUsuario = req.session.usuario.codUsuario; // Pega o usuário da sessão

        // Verifica se o usuário está na sessão
        if (!codUsuario) {
            console.log("Acesso negado: Usuário não encontrado na sessão.");
            return res.status(403).send("Acesso negado: Usuário não encontrado na sessão.");
        }

        // Busca o clube associado ao usuário
        const clube = await Clube.findOne({ where: { codUsuario } });

        if (!clube) {
            console.log("Clube não encontrado para o usuário:", codUsuario);
            return res.status(404).send("Clube não encontrado para o usuário.");
        }

        // Consulta os atletas do clube
        const atletas = await Atleta.findAll({ where: { codClube: clube.codClube } });

        // Prepara os dados dos atletas para o Handlebars
        const atletasDados = atletas.map(atleta => ({
            codAtleta: atleta.codAtleta,
            nome: atleta.nome,
            sobrenome: atleta.sobrenome,
            nascimento: atleta.nascimento,
            sexo: atleta.sexo,
            nacionalidade: atleta.nacionalidade,
            rg: atleta.rg,
            cpf: atleta.cpf,
            passaporte: atleta.passaporte,
            validadePassaporte: atleta.validadePassaporte,
            situacao: atleta.situacao
        }));

        // Renderiza a view do clube passando os dados do clube e dos atletas
        res.render('clube-dashboard', { clube, atletas: atletasDados });
    } catch (error) {
        console.error('Erro ao buscar dados do clube e atletas:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Renderizar Tela de Cadastro de Atleta
exports.rdCadastroAtleta = (req, res) => {
    res.render('cadastro-atleta');
};

// Cadastrar Atleta
exports.adicionarAtletas = async (req, res) => {
    console.log('Corpo da requisição:', req.body);

    const { 
        nome, sobrenome, nascimento, sexo, nacionalidade, rg, 
        cpf, passaporte, validadePassaporte, situacao, 
        telefone, email, facebook, instagram, site, 
        cep, endereco, cidade, estado, pais 
    } = req.body;

    const codClube = req.session.usuario.codClube ? req.session.usuario.codClube : null;
    const t = await sequelize.transaction();

    // Função para normalizar os valores
    const normalizeValues = (data) => {
        const normalizedData = {};
        for (const key in data) {
            // Se o valor for uma string vazia ou undefined, substitua por null
            normalizedData[key] = data[key] && data[key].trim() !== '' ? data[key] : null;
        }
        return normalizedData;
    };

    const normalizedPassaporte = normalizeValues({ passaporte }).passaporte;
    const validade = normalizeValues({ validadePassaporte }).validadePassaporte;

    try {
        if (!codClube) {
            return res.status(403).json({ message: 'Clube não encontrado na sessão. Faça login novamente.' });
        }

        const dataNascimento = new Date(nascimento);
        const idade = new Date().getFullYear() - dataNascimento.getFullYear();
        const m = new Date().getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && new Date().getDate() < dataNascimento.getDate())) {
            idade--;
        }

        if (idade < 18) {
            return res.redirect(`/cadastrar-responsavel?nome=${encodeURIComponent(nome)}&sobrenome=${encodeURIComponent(sobrenome)}&nascimento=${encodeURIComponent(nascimento)}`);
        }

        const novoAtleta = await Atleta.create({
            codClube,
            nome,
            sobrenome,
            nascimento,
            sexo,
            nacionalidade,
            rg,
            cpf,
            passaporte: normalizedPassaporte, // usar passaporte normalizado
            validadePassaporte: validade, // usar validade normalizada
            situacao
        }, { transaction: t });

        await Endereco.create({
            codAtleta: novoAtleta.codAtleta,
            cep: normalizeValues({ cep }).cep,
            endereco: normalizeValues({ endereco }).endereco,
            cidade: normalizeValues({ cidade }).cidade,
            estado: normalizeValues({ estado }).estado,
            pais: normalizeValues({ pais }).pais
        }, { transaction: t });

        await Contato.create({
            codAtleta: novoAtleta.codAtleta,
            telefone: normalizeValues({ telefone }).telefone,
            email: normalizeValues({ email }).email,
            facebook: normalizeValues({ facebook }).facebook,
            instagram: normalizeValues({ instagram }).instagram,
            site: normalizeValues({ site }).site
        }, { transaction: t });

        await t.commit();

        res.status(201).json({ message: 'Atleta cadastrado com sucesso!' });
    } catch (error) {
        await t.rollback();
        console.error('Erro ao cadastrar atleta:', error);
        res.status(500).json({ error: "Erro ao cadastrar atleta" });
    }
};
