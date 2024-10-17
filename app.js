const express = require("express");

const app = express();

//Conexao BD (Será alterado depois o local)
const mysql = require('mysql');
//Caso você esteja enfrentando dificuldade com o erro: "Erro Conexão: Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client", basta no seu prompt de comando do windows instalar uma a extensão 'mysql2' do node através do comando npm install mysql2 e substituir na linha acima o 'mysql' por 'mysql2'. 
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '123456',
    database: 'hoqueibrasil'
});

//Testando a conexao
conexao.connect(function(err){
    if(err){
        console.error('Erro Conexão: ' + err.stack);
        return;
    } 

    console.log('Conexão com o ID: ' + conexao.threadId);
})

conexao.query('SELECT * FROM federacao', function(err, rows, fields){
    if(!err){
        console.log('Federações: ', rows);
    }else{
        console.log('Erro ao realizar a consults');
    }
})

app.get("/", function(require, response){
    response.sendFile(__dirname + "/src/index.html");
});

app.get("/login", function(require, response){
    response.sendFile(__dirname + "/src/login.html");
    
});

app.get("/cadastroDeAtletas", function(require, response){
    response.sendFile(__dirname + "/src/cadastroDeAtletas.html");
    
});

app.get("/controleDoClube", function(require, response){
    response.sendFile(__dirname + "/src/controleDoClube.html");
    
});

app.listen(4002, () => console.log("Servidor rodando na porta 4002"));