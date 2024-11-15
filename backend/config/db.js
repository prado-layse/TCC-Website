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
const FederacaoModel = require('../src/models/Federacao');
const EnderecoModel = require('../src/models/Endereco');
const ContatoModel = require('../src/models/Contato');
const ClubeModel = require('../src/models/Clube');
const AtletaModel = require('../src/models/Atleta');
const ResponsavelModel = require('../src/models/ResponsavelAtleta');
const ContratoModel = require('../src/models/Contrato');
const SolicitacaoModel = require('../src/models/Solicitacao');

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
const Solicitacao = SolicitacaoModel(sequelize, Sequelize.DataTypes);

// Associando os modelos
Perfil.hasMany(Usuario, { foreignKey: 'idPerfil', as: 'usuarios' });
Usuario.hasMany(Clube, { foreignKey: 'codUsuario', as: 'clubes' });
Usuario.belongsTo(Perfil, { foreignKey: 'idPerfil' });

Federacao.hasMany(Endereco, { foreignKey: 'codFederacao', as: 'enderecos' });
Federacao.hasMany(Contato, { foreignKey: 'codFederacao', as: 'contatos' });
Federacao.hasMany(Clube, { foreignKey: 'codFederacao', as: 'clubes' });

Endereco.belongsTo(Federacao, { foreignKey: 'codFederacao' });
Endereco.belongsTo(Clube, { foreignKey: 'codClube' });

Contato.belongsTo(Federacao, { foreignKey: 'codFederacao' });
Contato.belongsTo(Clube, { foreignKey: 'codClube' });

Clube.belongsTo(Federacao, { foreignKey: 'codFederacao' });
Clube.belongsTo(Usuario, { foreignKey: 'codUsuario', as: 'usuario' });
Clube.hasMany(Endereco, { foreignKey: 'codClube', as: 'enderecos' });
Clube.hasMany(Contato, { foreignKey: 'codClube', as: 'contatos' });

Atleta.belongsTo(Clube, { foreignKey: 'codClube' });
Atleta.belongsTo(ResponsavelAtleta, { foreignKey: 'codResponsavel' });
Atleta.hasMany(Endereco, { foreignKey: 'codClube', as: 'enderecos' });
Atleta.hasMany(Contato, { foreignKey: 'codClube', as: 'contatos' });

Contrato.belongsTo(Atleta, { foreignKey: 'codAtleta' });

Solicitacao.belongsTo(Clube, { foreignKey: 'codClube'});
Solicitacao.belongsTo(Atleta, { foreignKey: 'codAtleta'});
Solicitacao.belongsTo(ResponsavelAtleta, { foreignKey: 'codResponsavel'});
Solicitacao.belongsTo(Contato, { foreignKey: 'codContato'});
Solicitacao.belongsTo(Endereco, {foreignKey: 'codEndereco'});
Solicitacao.belongsTo(Contrato, {foreignKey: 'codContrato'});

// Se preferir, pode comentar ou remover a sincronização do banco de dados
/*
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco de dados sincronizado.');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar banco de dados:', error);
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
    Clube,
    Atleta,
    ResponsavelAtleta,
    Contrato,
    Solicitacao
};
