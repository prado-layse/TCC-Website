// backend/src/models/Usuario.js
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        codUsuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idPerfil: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        tableName: 'usuario', // Nome da tabela no banco de dados
        timestamps: false, // Caso não tenha timestamps (createdAt, updatedAt)
    });

    // Associações podem ser definidas aqui, se necessário
    Usuario.associate = (models) => {
        // Define a associação com o modelo Perfil, se necessário
        Usuario.belongsTo(models.Perfil, { foreignKey: 'idPerfil' });
    };

    return Usuario;
};
