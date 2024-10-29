const Sequelize = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
    }
);

const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const Perfil = require('./Perfil')(sequelize, Sequelize.DataTypes);
const Federacao = require('./Federacao')(sequelize, Sequelize.DataTypes);
const Contato = require('./Contato')(sequelize, Sequelize.DataTypes);
const Endereco = require('./Endereco')(sequelize, Sequelize.DataTypes);
const Clube = require('./Clube')(sequelize, Sequelize.DataTypes);
const Atleta = require('./Atleta')(sequelize, Sequelize.DataTypes);
const ResponsavelAtleta = require('./ResponsavelAtleta')(sequelize, Sequelize.DataTypes);
const Contrato = require('./Contrato')(sequelize, Sequelize.DataTypes);



const models = { Usuario, Perfil, Federacao, Contato, Endereco, Clube, Atleta, ResponsavelAtleta, Contrato };

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = {
    sequelize,
    ...models,
};
