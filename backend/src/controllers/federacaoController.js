const Federacao = require('../models/Federacao');

// Listar Federações
exports.listarFederacoes = (req, res) => {
    Federacao.findAll()
        .then(federacoes => {
            res.render('listar-federacoes', { federacoes }); // Renderiza a tela com a lista de federações
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
                return res.status(404).json({
                    error: true,
                    message: "Essa Federação não existe!"
                });
            }
        })
        .catch(erro => {
            console.error(erro);
            return res.status(500).json({
                error: true,
                message: "Erro ao consultar a Federação."
            });
        });
};

// Adicionar Nova Federação
exports.adicionarFederacao = (req, res) => {
    Federacao.create(req.body)
        .then(novaFederacao => {
            res.status(201).json(novaFederacao);
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).json({ error: "Erro ao adicionar federação", message: erro.message });
        });
};

// Renderizar Tela de Cadastro
exports.renderizarCadastro = (req, res) => {
    res.render('cadastro-federacao'); // Renderiza a tela de cadastro de federações
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
            res.redirect('/federacoes'); // Redireciona após a atualização
        } else {
            res.status(404).send("Federação não encontrada");
        }
    })
    .catch(erro => {
        console.error(erro);
        res.status(500).send("Erro ao atualizar a federação");
    });
};
