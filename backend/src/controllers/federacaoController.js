//src/controllers/federacaoController.js
const { Federacao, Endereco, Contato, Usuario, sequelize } = require('../models');

// Listar Federações
exports.listarFederacoes = async (req, res) => {
    try {
        const federacoes = await Federacao.findAll({
            include: [
                { model: Endereco, as: 'Enderecos' }, // Altere aqui para 'enderecos'
                { model: Contato, as: 'Contatos' }    // Altere aqui para 'contatos'
            ]
        });

        const federacoesLimpas = JSON.parse(JSON.stringify(federacoes)); // Evita problemas com propriedades do Sequelize

        res.render('listar-federacoes', { federacoes: federacoesLimpas });
    } catch (error) {
        console.error("Erro ao listar federações:", error);
        res.status(500).send("Erro ao listar federações");
    }
};

// Adicionar Nova Federação
exports.adicionarFederacao = async (req, res) => {
    console.log('Corpo da requisição:', req.body); // Log da estrutura completa

    // Extraindo dados diretamente da requisição
    //const { federacaoData, enderecoData, contatoData } = req.body;

    const { 
        razaoSocial, nomeFantasia, sigla, cnpj, 
        presidente, cep, endereco, cidade, estado, 
        pais, telefone, email, facebook, instagram,
        site 
    } = req.body;

    // Validação dos dados da federação
    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos da federação são obrigatórios." });
    }

    // Verifica se o usuário está autenticado
    const codUsuario = req.session.userId;
    if (!codUsuario) {
        return res.status(401).json({ error: "Você deve estar logado para cadastrar uma federação." });
    }

    const t = await sequelize.transaction();
    
    try {

        // Verifica se o usuário tem perfil de admin (idPerfil 1)
        const usuario = await Usuario.findOne({ where: { codUsuario } });
        if (usuario.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas usuários admin podem cadastrar federações." });
        }
        //1. Cadastrar na tabela federacao
        const novaFederacao = await Federacao.create({ 
            razaoSocial, 
            nomeFantasia, 
            sigla, 
            cnpj, 
            presidente
        }, { transaction: t});

        //2. Cadastrar na tabela endereco
        await Endereco.create({ 
            codFederacao: novaFederacao.codFederacao,
            cep,
            endereco,
            cidade,
            estado,
            pais
        }, { transaction: t });
        await Contato.create({  
            codFederacao: novaFederacao.codFederacao,
            telefone,
            email,
            facebook,
            instagram,
            site 
        }, { transaction: t });

        // confirma a transação
        await t.commit();
        res.status(201).json( { message: 'Federação cadastrada com sucesso!'});
    } catch (erro) {
        await t.rollback();
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar federação", message: erro.message });
    }
};

// Renderizar Tela de Cadastro
exports.renderizarCadastro = (req, res) => {
    res.render('cadastro-federacao');
};

// Consultar Federação
exports.consultarFederacao = (req, res) => {
    Federacao.findOne({ where: { codFederacao: req.params.codFederacao } })
        .then(federacao => {
            if (federacao) {
                return res.status(200).json(federacao);
            } else {
                return res.status(404).json({ error: true, message: "Essa Federação não existe!" });
            }
        })
        .catch(erro => {
            console.error(erro);
            return res.status(500).json({ error: true, message: "Erro ao consultar a Federação." });
        });
};

// Renderizar Tela de Edição
exports.renderizarEdicao = (req, res) => {
    Federacao.findOne({ where: { codFederacao: req.params.codFederacao } })
        .then(federacao => {
            if (federacao) {
                res.render('editar-federacao', { federacao: federacao.dataValues });
            } else {
                res.status(404).send("Federação não encontrada");
            }
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao buscar a federação");
        });
};

// Atualizar Federação
exports.atualizarFederacao = (req, res) => {
    Federacao.update(req.body, {
        where: { codFederacao: req.params.codFederacao }
    })
    .then(([rowsUpdated]) => {
        if (rowsUpdated > 0) {
            res.redirect('/federacoes');
        } else {
            res.status(404).send("Federação não encontrada");
        }
    })
    .catch(erro => {
        console.error(erro);
        res.status(500).send("Erro ao atualizar a federação");
    });
};

exports.alterarStatusFederacao = async (req, res) => {
    const { codFederacao } = req.params;

    try {
        const federacao = await Federacao.findOne({ where: { codFederacao } });

        if (!federacao) {
            return res.status(404).json({ error: true, message: "Federação não encontrada" });
        }

        const novoStatus = federacao.status === 'Ativo' ? 'Inativo' : 'Ativo';
        await federacao.update({ status: novoStatus });

        res.status(200).json({ message: `Federação ${novoStatus.toLowerCase()} com sucesso!`, status: novoStatus });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: true, message: "Erro ao alterar o status da federação" });
    }
};

