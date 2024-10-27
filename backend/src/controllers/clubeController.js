// src/controllers/clubeController.js
const { Federacao, Endereco, Contato, Usuario, Clube, sequelize} = require('../models');
const bcrypt = require('bcryptjs');

// Listar Clubes
exports.listarClubes = async (req, res) => {
    try {
        const clubes = await Clube.findAll({
            include: [
                { model: Endereco, as: 'Enderecos' }, // Altere aqui para 'enderecos'
                { model: Contato, as: 'Contatos' }    // Altere aqui para 'contatos'
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

    const codUsuario = req.session.userId;
    
    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos do clube são obrigatórios." });
    } 
    
    const t = await sequelize.transaction();

    try {
        
        const usuario = await Usuario.findOne({ where: { codUsuario } });
        if (usuario.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas usuários admin podem cadastrar federações." });
        }

        //1. Cadastrar na tabela clube
        const novoClube = await Clube.create({ 
            codFederacao, 
            razaoSocial, 
            nomeFantasia, 
            sigla, 
            cnpj, 
            presidente,
            codUsuario,
            situacao: "ativo" 
        }, { transaction: t });

        //2. Cadastrar na tabela endereco
        await Endereco.create({ 
            codClube: novoClube.codClube,
            cep,
            endereco,
            cidade,
            estado,
            pais
        }, { transaction: t });
        
        //3. Cadastrrar na tabela contato
        await Contato.create({  
            codClube: novoClube.codClube,
            telefone,
            email,
            facebook,
            instagram,
            site 
        }, { transaction: t });

        //4. criar perfil de acesso para o novo clube
        const hashSenha = await bcrypt.hash(senha, 10);
        await Usuario.create({
            idPerfil: 2,
            email,
            senha: hashSenha
        });

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
