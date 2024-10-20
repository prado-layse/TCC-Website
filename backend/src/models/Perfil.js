// models/Perfil.js

const db = require('../../config/db'); // Importando a configuração do banco de dados

const Perfil = db.sequelize.define('perfil', {
    idPerfil: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: db.Sequelize.ENUM('user-admin', 'user-clube', 'user-consulta'),
        allowNull: false,
    },
}, {
    tableName: 'perfil', // Nome da tabela no banco de dados
    timestamps: false,   // Desative se não houver colunas de timestamps (createdAt, updatedAt)
});

module.exports = Perfil;
