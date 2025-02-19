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
                key: 'codAtleta',
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
                model: 'responsavel_atleta',
                key: 'codResponsavel',
            },
        },
        telefone: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        facebook: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        instagram: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        site: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
    }, {
        tableName: 'contato',
        timestamps: false,
    });

    Contato.associate = (models) => {
        Contato.belongsTo(models.Federacao, { foreignKey: 'codFederacao', as: 'federacao' });
        Contato.belongsTo(models.Atleta, { foreignKey: 'codAtleta', as: 'atleta' });
        Contato.belongsTo(models.Clube, { foreignKey: 'codClube', as: 'clube' });
        Contato.belongsTo(models.ResponsavelAtleta, { foreignKey: 'codResponsavel', as: 'responsavel' });
    };

    return Contato;
};