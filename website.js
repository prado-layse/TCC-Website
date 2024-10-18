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
            return moment(date).format('DD/MM/YYYY')
        }
    }
    //Exemplo de como usar o formaDate no arquivo de handlebars
    //Campo: {{#formatDate campo-bd}}{{/formatDate}}<br>
}));
site.set('view engine', 'handlebars');
site.use(bodyParser.urlencoded({ extended: false }));
site.use(bodyParser.json());

// Rotas
site.get('/federacao', function(req, res){
    Federacao.findAll().then(function(federacoes){
        const federacoesData = federacoes.map(f => f.dataValues)
        res.render('pag-federacoes', {federacoes: federacoesData});
    })
})

site.get('/cadastro', function(req, res){
    res.render('cadastro-federacao');
});

site.post('/add-federacao', function(req, res){
    Federacao.create({
        razaoSocial: req.body.razaoSocial,
        nomeFantasia: req.body.nomeFantasia,
        sigla: req.body.sigla,
        cnpj: req.body.cnpj,
        presidente: req.body.presidente
    }).then(function(){
        res.send("Federação cadsastrada com sucesso")
    }).catch(function(erro){
        res.send("Erro: " + erro.message);
    });    
});

// Inicie o servidor
site.listen(8080, () => {
    console.log('Servidor rodando na porta 8080: http://localhost:8080/');
});