const { Federacao, Endereco, Contato, Usuario, Clube, Atleta, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

// Renderizar o Dashboard do Clube
/*
exports.rdDashboardClube = async (req, res) => {
    const codUsuario = req.session.usuario.codUsuario;

    if (!codUsuario) {
        console.log("Acesso negado: Usuário não encontrado na sessão.");
        return res.status(403).send("Acesso negado: Usuário não encontrado na sessão.");
    }

    try {
        const clube = await Clube.findOne({ where: { codUsuario } });

        if (!clube) {
            console.log("Clube não encontrado para o usuário:", codUsuario);
            return res.status(404).send("Clube não encontrado para o usuário.");
        }

        const atletas = await Atleta.findAll({ where: { codClube: clube.codClube } });

        res.render('clube-dashboard', { clube, atletas });
    } catch (error) {
        console.error('Erro ao buscar dados do clube e atletas:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};*/

// Listar Clubes
exports.listarClubes = async (req, res) => {
    try {
        const clubes = await Clube.findAll({
            include: [
                { model: Endereco, as: 'enderecos' },
                { model: Contato, as: 'contatos' }
            ]
        });

        const clubesLimpas = JSON.parse(JSON.stringify(clubes));
        res.render('listar-clubes', { clubes: clubesLimpas });
    } catch (error) {
        console.error("Erro ao listar clubes:", error);
        res.status(500).send("Erro ao listar clubes");
    }
};

// Função específica para obter federações no modal do cadastro de clubes
exports.obterFederacoesParaClube = async (req, res) => {
    try {
        const federacoes = await Federacao.findAll({
            attributes: ['codFederacao', 'razaoSocial'],
            order: [['razaoSocial', 'ASC']]
        });
        
        res.status(200).json(federacoes);
    } catch (error) {
        console.error("Erro ao obter federações:", error);
        res.status(500).json({ error: "Erro ao obter federações." });
    }
};

// Adicionar Novo Clube
exports.adicionarClube = async (req, res) => {
    console.log('Corpo da requisição:', req.body);
    
    const { 
        codFederacao, razaoSocial, nomeFantasia, sigla, 
        cnpj, presidente, cep, endereco, cidade, estado, pais,
        telefone, email, facebook, instagram, site, senha 
    } = req.body;

    const adminId = req.session.userId; 
    
    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos do clube são obrigatórios." });
    } 
    
    const t = await sequelize.transaction();

    try {
        const usuarioAdmin = await Usuario.findOne({ where: { codUsuario: adminId } });
        if (usuarioAdmin.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas admin pode cadastrar clubes." });
        }

        const hashSenha = await bcrypt.hash(senha, 10);
        const usuarioClube = await Usuario.create({
            idPerfil: 2,
            email,
            senha: hashSenha
        }, { transaction: t });

        const novoClube = await Clube.create({ 
            codFederacao, 
            razaoSocial, 
            nomeFantasia, 
            sigla, 
            cnpj, 
            presidente,
            codUsuario: usuarioClube.codUsuario,
            situacao: "ativo" 
        }, { transaction: t });

        await Endereco.create({ 
            codClube: novoClube.codClube,
            cep,
            endereco,
            cidade,
            estado,
            pais
        }, { transaction: t });
        
        await Contato.create({  
            codClube: novoClube.codClube,
            telefone,
            email,
            facebook,
            instagram,
            site 
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Clube cadastrado com sucesso!' });

    } catch (erro) {
        await t.rollback();
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar clube", message: erro.message });
    }
};

// Renderizar Tela de Cadastro
exports.rdCadastroClube = (req, res) => {
    res.render('cadastro-clube');
};

// Acessar a Tela do Clube
/*
exports.loginClube = async (req, res) => {
    try {
        const usuario = req.session.usuario;

        if (!usuario || usuario.idPerfil !== 2) {
            return res.status(403).json({ message: 'Acesso negado. Perfil não autorizado.' });
        }

        const clube = await Clube.findOne({ where: { codUsuario: usuario.codUsuario } });

        if (!clube) {
            return res.status(404).json({ message: 'Clube não encontrado.' });
        }

        // Redireciona para a dashboard do clube
        res.redirect(`/api/clubes/${clube.sigla}`);
    } catch (error) {
        console.error('Erro ao acessar a tela do clube:', error);
        res.status(500).json({ message: 'Erro ao acessar a tela do clube.' });
    }
};
*/
