const { Endereco, Contato, Clube, Atleta, ResponsavelAtleta, sequelize } = require('../models');

// Listar Atletas
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

exports.adicionarAtletas = async (req, res) => {
    console.log('Corpo da requisição:', req.body);

    const { 
        nome, sobrenome, nascimento, sexo, nacionalidade, rg, 
        cpf, passaporte, validadePassaporte, situacao, 
        telefone, email, facebook, instagram, site, 
        cep, endereco, cidade, estado, pais,
        responsavelNome, responsavelSobrenome, responsavelRg, 
        responsavelCpf, responsavelTelefone, responsavelEmail 
    } = req.body;

    const codClube = req.session.usuario.codClube ? req.session.usuario.codClube : null;
    const t = await sequelize.transaction();

    try {
        if (!codClube) {
            return res.status(403).json({ message: 'Clube não encontrado na sessão. Faça login novamente.' });
        }

        // Verificar idade do atleta
        const dataNascimento = new Date(nascimento);
        const idade = new Date().getFullYear() - dataNascimento.getFullYear();
        const m = new Date().getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && new Date().getDate() < dataNascimento.getDate())) {
            idade--;
        }

        // Cadastrar o atleta
        const novoAtleta = await Atleta.create({
            codClube,
            nome,
            sobrenome,
            nascimento,
            sexo,
            nacionalidade,
            rg,
            cpf,
            passaporte,
            validadePassaporte,
            situacao
        }, { transaction: t });

        // Cadastrar endereço do atleta
        await Endereco.create({
            codAtleta: novoAtleta.codAtleta,
            cep,
            endereco,
            cidade,
            estado,
            pais
        }, { transaction: t });

        // Cadastrar contato do atleta ou do responsável
        if (idade >= 18) {
            // Se maior de idade, cadastra o contato do atleta
            await Contato.create({
                codAtleta: novoAtleta.codAtleta,
                telefone,
                email,
                facebook,
                instagram,
                site
            }, { transaction: t });
        } else {
            // Se menor de idade, cadastra o responsável e o contato do responsável
            const novoResponsavel = await ResponsavelAtleta.create({
                nome: responsavelNome,
                sobrenome: responsavelSobrenome,
                rg: responsavelRg,
                cpf: responsavelCpf
            }, { transaction: t });

            await Contato.create({
                codResponsavel: novoResponsavel.codResponsavel,
                telefone: responsavelTelefone,
                email: responsavelEmail
            }, { transaction: t });

            // Atualizar o atleta com o codResponsavel
            await Atleta.update({ codResponsavel: novoResponsavel.codResponsavel }, {
                where: { codAtleta: novoAtleta.codAtleta },
                transaction: t
            });
        }

        await t.commit();
        res.status(201).json({ message: 'Atleta cadastrado com sucesso!' });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar o atleta.' });
    }
};

