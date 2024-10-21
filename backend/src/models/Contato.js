// backend/src/models/Contato.js
module.exports = (sequelize, DataTypes) => {
    const Contato = sequelize.define('Contato', {
        codContato: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        codFederacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'federacao',
                key: 'codFederacao',
            },
        },
        codUsuario: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        telefone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        facebook: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        instagram: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        outraRede: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: 'contato',
        timestamps: false,
    });

    Contato.associate = (models) => {
        Contato.belongsTo(models.Federacao, { foreignKey: 'codFederacao' });
    };

    return Contato;
};
