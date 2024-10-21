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
        telefone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        facebook: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        instagram: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        site: {
            type: DataTypes.STRING,
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
