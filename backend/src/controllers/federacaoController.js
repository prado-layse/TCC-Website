//src/controllers/federacaoController.js
const { Federacao, Endereco, Contato, Usuario } = require('../models');

// Listar Federações
exports.listarFederacoes = (req, res) => {
    Federacao.findAll()
        .then(federacoes => {
            res.render('listar-federacoes', { federacoes });
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).json({ error: "Erro ao listar federações", message: erro.message });
        });
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

// Adicionar Nova Federação
exports.adicionarFederacao = async (req, res) => {
    console.log('Corpo da requisição:', req.body); // Log da estrutura completa

    // Extraindo dados diretamente da requisição
    //const { federacaoData, enderecoData, contatoData } = req.body;

    const { razaoSocial, nomeFantasia, sigla, cnpj, presidente } = req.body;
    const { cep, enderecoSede, cidade, estado, pais } = req.body;
    const { telefone, email, facebook, instagram, site } = req.body;

    // Validação dos dados da federação
    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos da federação são obrigatórios." });
    }

    // Verifica se o usuário está autenticado
    const codUsuario = req.session.userId;
    if (!codUsuario) {
        return res.status(401).json({ error: "Você deve estar logado para cadastrar uma federação." });
    }

    try {
        const usuario = await Usuario.findOne({ where: { codUsuario } });

        // Verifica se o usuário tem perfil de admin (idPerfil 1)
        if (usuario.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas usuários admin podem cadastrar federações." });
        }

        // Criação da federação e associações
        const novaFederacao = await Federacao.create({ razaoSocial, nomeFantasia, sigla, cnpj, presidente });
        await Endereco.create({ ...{ cep, enderecoSede, cidade, estado, pais }, codFederacao: novaFederacao.codFederacao });
        await Contato.create({ ...{ telefone, email, facebook, instagram, site }, codFederacao: novaFederacao.codFederacao });

        res.status(201).json(novaFederacao);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar federação", message: erro.message });
    }
};

// Renderizar Tela de Cadastro
exports.renderizarCadastro = (req, res) => {
    res.render('cadastro-federacao');
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
