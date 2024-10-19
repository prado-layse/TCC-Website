const express = require("express");
const site = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const moment = require("moment");
const Federacao = require("./models/Federacao");

// Configure o motor de visualização
site.engine('handlebars', handlebars.engine({ 
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY');
        }
    }
    //Exemplo de como usar o formaDate no arquivo de handlebars
    //Campo: {{#formatDate campo-bd}}{{/formatDate}}<br>
}));
site.set('view engine', 'handlebars');
site.use(bodyParser.urlencoded({ extended: false }));
site.use(bodyParser.json());

// ROTA: Tela Inicial
site.get('/', (req, res) => {
    res.send("TELA INICIAL");
});

// ROTA: Listar Federações
site.get('/federacoes', (req, res) => {
    console.log('Requisição recebida para listar federações');
    Federacao.findAll()
        .then(federacoes => {
            res.status(200).json(federacoes); // Retorna as federações com status 200
        })
        .catch(erro => {
            console.error(erro); // Log do erro para o console
            res.status(500).json({ error: "Erro ao listar federações", message: erro.message });
        });
});

// ROTA: Consultar Federação
site.get('/consulta-federacao/:codFederacao', (req, res) => {
    Federacao.findOne({ where: { codFederacao: req.params.codFederacao } })
        .then(federacao => {
            if (federacao) {
                return res.json(federacao);
            } else {
                return res.status(404).json({
                    error: true,
                    message: "Essa Federação não Existe!"
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
});

// ROTA: Tela de Cadastro de Federação
site.get('/cadastro', (req, res) => {
    res.render('cadastro-federacao');
});

//Adicionar uma Nova Federação
site.post('/add-federacao', (req, res) => {
    Federacao.create({
        razaoSocial: req.body.razaoSocial,
        nomeFantasia: req.body.nomeFantasia,
        sigla: req.body.sigla,
        cnpj: req.body.cnpj,
        presidente: req.body.presidente
    })
    .then(novaFederacao => {
        res.status(201).json(novaFederacao); // Retorna a nova federação criada com status 201
    })
    .catch(erro => {
        console.error(erro); // Log do erro para o console
        res.status(500).json({ error: "Erro ao adicionar federação", message: erro.message });
    });
});

// ROTA: Tela de Editar Federação
site.get('/editar-federacao/:codFederacao', (req, res) => {
    Federacao.findOne({ where: { codFederacao: req.params.codFederacao } })
        .then(federacao => {
            if (federacao) {
                res.render('editar-federacao', { federacao: federacao.dataValues }); // Passa os dados para a página
            } else {
                res.status(404).send("Federação não encontrada");
            }
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao buscar a federação");
        });
});

// ROTA: Atualizar Federação
site.post('/atualizar-federacao/:codFederacao', (req, res) => {
    Federacao.update({
        razaoSocial: req.body.razaoSocial,
        nomeFantasia: req.body.nomeFantasia,
        sigla: req.body.sigla,
        cnpj: req.body.cnpj,
        presidente: req.body.presidente
    }, {
        where: { codFederacao: req.params.codFederacao }
    })
    .then(() => {
        res.redirect('/federacoes'); // Redireciona para a lista de federações após a atualização
    })
    .catch(erro => {
        console.error(erro);
        res.status(500).send("Erro ao atualizar a federação");
    });
});
// Inicie o servidor
site.listen(3000, () => {
    console.log('Servidor rodando na porta 3000: http://localhost:3000/');
});