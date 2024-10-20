const db = require('../../config/db');

const Usuario = db.sequelize.define('usuario', {
    codUsuario: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: { // Adicionando a coluna 'email'
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: db.Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    idPerfil: {
        type: db.Sequelize.ENUM('user-admin', 'user-clube', 'user-consulta'),
        allowNull: false,
    },
}, {
    tableName: 'usuario',
    timestamps: false,
});

module.exports = Usuario;
