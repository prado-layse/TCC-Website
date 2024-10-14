const express = require("express");

const app = express();

app.get("/", function(require, response){
    response.sendFile(__dirname + "/src/index.html");
});

app.get("/login", function(require, response){
    response.sendFile(__dirname + "/src/login.html");
    
})

app.listen(4002, () => console.log("Servidor rodando na porta 4002"));