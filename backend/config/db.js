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
const AtletaModel = require('../src/models/Atleta');
const ResponsavelModel = require('../src/models/ResponsavelAtleta');
const ContratoModel = require('../src/models/Contrato');

// Definindo os modelos
const Usuario = UsuarioModel(sequelize, Sequelize.DataTypes);
const Perfil = PerfilModel(sequelize, Sequelize.DataTypes);
const Federacao = FederacaoModel(sequelize, Sequelize.DataTypes);
const Endereco = EnderecoModel(sequelize, Sequelize.DataTypes);
const Contato = ContatoModel(sequelize, Sequelize.DataTypes);
const Clube = ClubeModel(sequelize, Sequelize.DataTypes);
const Atleta = AtletaModel(sequelize, Sequelize.DataTypes);
const ResponsavelAtleta = ResponsavelModel(sequelize, Sequelize.DataTypes);
const Contrato = ContratoModel(sequelize, Sequelize.DataTypes);

// Associando os modelos após a inicialização completa
Federacao.hasMany(Endereco, { foreignKey: 'codFederacao', as: 'Enderecos' });
Federacao.hasMany(Contato, { foreignKey: 'codFederacao', as: 'Contatos' });
Federacao.hasMany(Clube, { foreignKey: 'codFederacao', as: 'Clubes'});

Endereco.belongsTo(Federacao, { foreignKey: 'codFederacao' });
Endereco.belongsTo(Clube, { foreignKey: 'codClube' });

Contato.belongsTo(Federacao, { foreignKey: 'codFederacao' });
Contato.belongsTo(Clube, { foreignKey: 'codClube' });

Clube.belongsTo(Federacao, { foreignKey: 'codFederacao'});
Clube.hasMany(Endereco, { foreignKey: 'codClube', as: 'Enderecos' });
Clube.hasMany(Contato, { foreignKey: 'codClube', as: 'Contatos' });

Atleta.belongsTo(Clube, { foreignKey: 'codClube'});
Atleta.belongsTo(ResponsavelAtleta, { foreignKey: 'codResponsavel'});
Atleta.hasMany(Endereco, { foreignKey: 'codClube', as: 'Enderecos' });
Atleta.hasMany(Contato, { foreignKey: 'codClube', as: 'Contatos' });

Contrato.belongsTo(Atleta, { foreignKey: 'codAtleta'});

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
