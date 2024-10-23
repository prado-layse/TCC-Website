// src/controllers/clubeController.js
const { Federacao, Endereco, Contato, Usuario, Clube} = require('../models');
const bcrypt = require('bcryptjs');

exports.adicionarClube = async (req, res) => {
    console.log('Corpo da requisição:', req.body);
    
    const { codFederacao, razaoSocial, nomeFantasia, sigla, cnpj, presidente } = req.body;
    const { cep, enderecoSede, cidade, estado, pais } = req.body;
    const { telefone, email, facebook, instagram, site } = req.body;

    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos da federação são obrigatórios." });
    } 

    try {
        const usuario = await Usuario.findOne({ where: { codUsuario }});
        
        if (usuario.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas usuários admin podem cadastrar federações." });
        }

        //criar clube
        const novoClube = await Clube.create({ codFederacao, razaoSocial, nomeFantasia, sigla, cnpj, presidente });
        await Endereco.create({ ...{ cep, enderecoSede, cidade, estado, pais }, codClube: novoClube.codClube });
        await Contato.create({ ...{ telefone, email, facebook, instagram, site }, codClube: novoClube.codClube });
        res.status(201).json(novaFederacao);

        //criar perfil de acesso
        const hashSenha = await bcrypt.hash(senha, 10);
        await Usuario.create({
            idPerfil: 2,
            email,
            senha: hashSenha
        });

        res.status(201).json({ message: 'Clube cadastrado com sucesso!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar clube", message: erro.message });
    }
};

// Renderizar Tela de Cadastro
exports.rdCadastroClube = (req, res) => {
    res.render('cadastro-clube');
};
