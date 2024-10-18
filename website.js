const express = require("express");
const site = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const federacao = require("./models/Federacao");

// Configure o motor de visualização
site.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
site.set('view engine', 'handlebars');
site.use(bodyParser.urlencoded({ extended: false }));
site.use(bodyParser.json());

// Rotas
site.get('/cadastro', function(req, res){
    res.render('cadastro-federacao');
});

site.post('/add-federacao', function(req, res){
    federacao.create({
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
    console.log('Servidor rodando na porta 8080');
});