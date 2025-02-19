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
const FederacaoModel = require('../src/models/Federacao');
const EnderecoModel = require('../src/models/Endereco');
const ContatoModel = require('../src/models/Contato');
const ClubeModel = require('../src/models/Clube');
const AtletaModel = require('../src/models/Atleta');
const ResponsavelModel = require('../src/models/ResponsavelAtleta');

// Definindo os modelos
const Usuario = UsuarioModel(sequelize, Sequelize.DataTypes);
const Federacao = FederacaoModel(sequelize, Sequelize.DataTypes);
const Endereco = EnderecoModel(sequelize, Sequelize.DataTypes);
const Contato = ContatoModel(sequelize, Sequelize.DataTypes);
const Clube = ClubeModel(sequelize, Sequelize.DataTypes);
const Atleta = AtletaModel(sequelize, Sequelize.DataTypes);
const ResponsavelAtleta = ResponsavelModel(sequelize, Sequelize.DataTypes);

// Associando os modelos
Usuario.hasMany(Clube, { foreignKey: 'codUsuario', as: 'clubes' });

Federacao.hasMany(Endereco, { foreignKey: 'codFederacao', as: 'enderecos' });
Federacao.hasMany(Contato, { foreignKey: 'codFederacao', as: 'contatos' });
Federacao.hasMany(Clube, { foreignKey: 'codFederacao', as: 'clubes' });

Endereco.belongsTo(Federacao, { foreignKey: 'codFederacao', as: 'federacao' });
Endereco.belongsTo(Atleta, { foreignKey: 'codAtleta', as: 'atleta' });
Endereco.belongsTo(Clube, { foreignKey: 'codClube', as: 'clube' });

Contato.belongsTo(Federacao, { foreignKey: 'codFederacao', as: 'federacao' });
Contato.belongsTo(Atleta, { foreignKey: 'codAtleta', as: 'atleta' });
Contato.belongsTo(Clube, { foreignKey: 'codClube', as: 'clube' });
Contato.belongsTo(ResponsavelAtleta, { foreignKey: 'codResponsavel', as: 'responsavel' });

Clube.belongsTo(Federacao, { foreignKey: 'codFederacao', as: 'federacao' });
Clube.belongsTo(Usuario, { foreignKey: 'codUsuario', as: 'usuario' });
Clube.hasMany(Endereco, { foreignKey: 'codClube', as: 'enderecos' });
Clube.hasMany(Contato, { foreignKey: 'codClube', as: 'contatos' });

Atleta.belongsTo(Clube, { foreignKey: 'codClube', as: 'clube' });
Atleta.belongsTo(ResponsavelAtleta, { foreignKey: 'codResponsavel', as: 'responsavel' });
Atleta.hasMany(Endereco, { foreignKey: 'codAtleta', as: 'enderecos' });
Atleta.hasMany(Contato, { foreignKey: 'codAtleta', as: 'contatos' });

module.exports = {
    Sequelize,
    sequelize,
    Usuario,
    Federacao,
    Endereco,
    Contato,
    Clube,
    Atleta,
    ResponsavelAtleta,
};