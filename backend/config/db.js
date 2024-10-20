// backend/config/db.js
const Sequelize = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

// Importando modelos
const UsuarioModel = require('../src/models/Usuario');
const PerfilModel = require('../src/models/Perfil');

// Definindo os modelos
const Usuario = UsuarioModel(sequelize, Sequelize.DataTypes);
const Perfil = PerfilModel(sequelize, Sequelize.DataTypes);

// Associando modelos (se necessário)
const models = {
    Usuario,
    Perfil,
};

// Chamando as associações, se existirem
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = {
    Sequelize,
    sequelize,
    ...models, // Exportando os modelos
};
