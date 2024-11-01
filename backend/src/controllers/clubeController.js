// src/controllers/clubeController.js
const { Federacao, Endereco, Contato, Usuario, Clube, sequelize} = require('../models');
const bcrypt = require('bcryptjs');

// Listar Clubes
exports.listarClubes = async (req, res) => {
    try {
        const clubes = await Clube.findAll({
            include: [
                { model: Endereco, as: 'enderecos' }, // Altere aqui para 'enderecos'
                { model: Contato, as: 'contatos' }    // Altere aqui para 'contatos'
            ]
        });

        const clubesLimpas = JSON.parse(JSON.stringify(clubes)); // Evita problemas com propriedades do Sequelize

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
            attributes: ['codFederacao', 'razaoSocial'], // Atributos que queremos retornar
            order: [['razaoSocial', 'ASC']] // Ordenar por nome
        });
        
        // Retornar status 200 com as federações encontradas
        res.status(200).json(federacoes);
    } catch (error) {
        // Log do erro no console para monitoramento
        console.error("Erro ao obter federações:", error);
        
        // Retornar status 500 em caso de erro
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

    const adminId = req.session.userId; // ID do usuário admin na sessão
    
    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos do clube são obrigatórios." });
    } 
    
    const t = await sequelize.transaction();

    try {
        // Verifica se o usuário logado é admin
        const usuarioAdmin = await Usuario.findOne({ where: { codUsuario: adminId } });
        if (usuarioAdmin.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas admin pode cadastrar clubes." });
        }

        // 1. Cria o usuário para o clube
        const hashSenha = await bcrypt.hash(senha, 10);
        const usuarioClube = await Usuario.create({
            idPerfil: 2,  // Perfil de clube
            email,
            senha: hashSenha
        }, { transaction: t });

        // 2. Cria o clube com o `codUsuario` recém-criado
        const novoClube = await Clube.create({ 
            codFederacao, 
            razaoSocial, 
            nomeFantasia, 
            sigla, 
            cnpj, 
            presidente,
            codUsuario: usuarioClube.codUsuario,  // Associa corretamente
            situacao: "ativo" 
        }, { transaction: t });

        // 3. Cadastrar endereço
        await Endereco.create({ 
            codClube: novoClube.codClube,
            cep,
            endereco,
            cidade,
            estado,
            pais
        }, { transaction: t });
        
        // 4. Cadastrar contato
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
exports.loginClube = async (req, res) => {
    try {
        // Obtém o usuário da sessão após login
        const usuario = req.session.usuario;

        console.log('Usuário na sessão:', usuario); // Verificar se o usuário está na sessão

        // Verifica se é um usuário com perfil de clube (idPerfil = 2)
        if (!usuario || usuario.idPerfil !== 2) {
            return res.status(403).json({ message: 'Acesso negado. Perfil não autorizado.' });
        }

        // Busca o clube associado ao usuário logado
        const clube = await Clube.findOne({
            where: { codUsuario: usuario.codUsuario }
        });

        console.log('Clube encontrado:', clube); // Verificar se o clube foi encontrado

        // Verifica se o clube foi encontrado
        if (!clube) {
            return res.status(404).json({ message: 'Clube não encontrado.' });
        }

        // Redireciona para a dashboard do clube
        res.redirect(`/api/clubes/dashboard/${clube.sigla}`);
    } catch (error) {
        console.error('Erro ao acessar a tela do clube:', error);
        res.status(500).json({ message: 'Erro ao acessar a tela do clube.' });
    }
};
exports.dashboardClube = async (req, res) => {
    try {
        const { sigla } = req.params;

        // Aqui você pode buscar mais dados do clube se necessário
        const clube = await Clube.findOne({ where: { sigla } });

        if (!clube) {
            return res.status(404).send('Clube não encontrado.');
        }

        // Renderizar a view da dashboard
        res.render('clube-dashboard', { clube });
    } catch (error) {
        console.error('Erro ao carregar a dashboard do clube:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};