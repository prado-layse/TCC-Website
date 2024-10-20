//backend/config/db.js
const Sequelize = require("sequelize");
require('dotenv').config(); // Carregar variáveis de ambiente

// Conectando com o banco
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

// Função para testar a conexão com o banco de dados
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
};

// Chamar a função para testar a conexão
testConnection();

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};
