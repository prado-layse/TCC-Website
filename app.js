const express = require("express");

const app = express();

//Conexao BD (Será alterado depois o local)
const mysql = require('mysql');
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

app.get("/", function(require, response){
    response.sendFile(__dirname + "/src/index.html");
});

app.get("/login", function(require, response){
    response.sendFile(__dirname + "/src/login.html");
    
})

app.listen(4002, () => console.log("Servidor rodando na porta 4002"));