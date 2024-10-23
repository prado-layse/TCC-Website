//backend/config/db.js
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

/*// Sincronizar o banco
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco de dados sincronizado.');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar banco de dados:', error);
    });
*/

// Importando modelos
const UsuarioModel = require('../src/models/Usuario');
const PerfilModel = require('../src/models/Perfil');
const FederacaoModel = require('../src/models/Federacao');
const EnderecoModel = require('../src/models/Endereco');
const ContatoModel = require('../src/models/Contato');
const ClubeModel = require('../src/models/Clube');

// Definindo os modelos
const Usuario = UsuarioModel(sequelize, Sequelize.DataTypes);
const Perfil = PerfilModel(sequelize, Sequelize.DataTypes);
const Federacao = FederacaoModel(sequelize, Sequelize.DataTypes);
const Endereco = EnderecoModel(sequelize, Sequelize.DataTypes);
const Contato = ContatoModel(sequelize, Sequelize.DataTypes);
const Clube = ClubeModel(sequelize, Sequelize.DataTypes);

// Associando os modelos após a inicialização completa
Federacao.hasMany(Endereco, { foreignKey: 'codFederacao', as: 'Enderecos' });
Federacao.hasMany(Contato, { foreignKey: 'codFederacao', as: 'Contatos' });
Endereco.belongsTo(Federacao, { foreignKey: 'codFederacao' });
Contato.belongsTo(Federacao, { foreignKey: 'codFederacao' });


// Associando modelos
/*const models = {
    Usuario,
    Perfil,
    Federacao,
    Endereco,
    Clube
};

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});
*/

module.exports = {
    Sequelize,
    sequelize,
    Usuario,
    Perfil,
    Federacao,
    Endereco,
    Contato,
    Clube
};
