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
            allowNull: true,
            references: {
                model: 'federacao',
                key: 'codFederacao',
            },
        },
        codAtleta: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'atleta',
                key: 'codAlteta',
            },
        },
        codClube: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'clube',
                key: 'codClube',
            },
        },
        codResponsavel: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'ResponsavelAtleta',
                key: 'codResponsavel',
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

    //Contato.associate = (models) => {
    //    Contato.belongsTo(models.Federacao, { foreignKey: 'codFederacao' });
    //    Contato.belongsTo(models.Clube, { foreignKey: 'codClube'});
    //};

    return Contato;
};
