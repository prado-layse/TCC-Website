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
site.get('/federacao', (req, res) => {
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

// ROTA: Tela de Cadastro de Federação
site.get('/cadastro', (req, res) => {
    res.render('cadastro-federacao');
});

// ROTA: Adicionar uma Nova Federação
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

// Inicie o servidor
site.listen(3000, () => {
    console.log('Servidor rodando na porta 3000: http://localhost:3000/');
});

// Rotas
/*site.get('/federacao', function(req, res){
    Federacao.findAll().then(function(federacoes){
        res.render('pag-federacoes', {federacoes});
    })
})*/