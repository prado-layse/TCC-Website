module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        codUsuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        perfil: {
            type: DataTypes.ENUM('user-admin', 'user-clube', 'user-consulta'),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        tableName: 'usuario',
        timestamps: false,
    });

    Usuario.associate = (models) => {
        Usuario.hasMany(models.Clube, { foreignKey: 'codUsuario', as: 'clubes' });
    };

    return Usuario;
};