const Sequelize = require("sequelize");
require('dotenv').config(); // Carregar variáveis de ambiente

// Conectando com o banco
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};
