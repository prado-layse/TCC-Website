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

    // Acessando dados diretamente com a notação de colchetes
    const federacaoData = {
        razaoSocial: req.body['federacaoData.razaoSocial'],
        nomeFantasia: req.body['federacaoData.nomeFantasia'],
        sigla: req.body['federacaoData.sigla'],
        cnpj: req.body['federacaoData.cnpj'],
        presidente: req.body['federacaoData.presidente']
    };

    const enderecoData = {
        cep: req.body['enderecoData.cep'],
        enderecoSede: req.body['enderecoData.enderecoSede'],
        cidade: req.body['enderecoData.cidade'],
        estado: req.body['enderecoData.estado'],
        pais: req.body['enderecoData.pais']
    };

    const contatoData = {
        telefone: req.body['contatoData.telefone'],
        email: req.body['contatoData.email'],
        facebook: req.body['contatoData.facebook'],
        instagram: req.body['contatoData.instagram']
    };

    // Valida se os dados da federação não estão vazios
    if (!federacaoData.razaoSocial || !federacaoData.nomeFantasia || !federacaoData.sigla || !federacaoData.cnpj || !federacaoData.presidente) {
        return res.status(400).json({ error: "Todos os campos da federação são obrigatórios." });
    }

    // Verifica se o usuário está autenticado e se tem permissão
    const codUsuario = req.session.userId; // Supondo que o ID do usuário esteja na sessão

    if (!codUsuario) {
        return res.status(401).json({ error: "Você deve estar logado para cadastrar uma federação." });
    }

    try {
        const usuario = await Usuario.findOne({ where: { codUsuario } });

        // Verifica se o usuário tem perfil de admin (idPerfil 1)
        if (usuario.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas usuários admin podem cadastrar federações." });
        }

        // Prossegue com a criação da federação, endereço e contato
        const novaFederacao = await Federacao.create(federacaoData);
        await Endereco.create({
            ...enderecoData,
            codFederacao: novaFederacao.codFederacao
        });
        await Contato.create({
            ...contatoData,
            codFederacao: novaFederacao.codFederacao
        });

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
