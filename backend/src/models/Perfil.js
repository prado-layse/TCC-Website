// backend/src/models/Perfil.js
module.exports = (sequelize, DataTypes) => {
    const Perfil = sequelize.define('perfil', {
        idPerfil: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.ENUM('user-admin', 'user-clube', 'user-consulta'),
            allowNull: false,
        },
    }, {
        tableName: 'perfil',
        timestamps: false,
    });

    // Definindo a associação com o modelo Usuario
    Perfil.associate = (models) => {
        Perfil.hasMany(models.Usuario, {
            foreignKey: 'idPerfil', // Chave estrangeira
            sourceKey: 'idPerfil', // Chave primária na tabela perfil
            as: 'usuarios', // Alias para a associação
        });
    };

    return Perfil;
};
