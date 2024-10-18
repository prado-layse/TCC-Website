const Sequelize = require("sequelize");

//Conectando com o banco
const sequelize = new Sequelize(
    'hoqueibrasil', 
    'admin', 
    '123456',
    {
        host: 'localhost',
        dialect: 'mysql'
    });

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};