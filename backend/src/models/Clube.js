// backend/src/models/Clube.js
module.exports = (sequelize, DataTypes) => {

    const Contato = sequelize.define('Clube', {
        codClube: {
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
        razaoSocial: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        nomeFantasia: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        sigla: {
            type: DataTypes.CHAR(10),
            allowNull: false,
        },
        cnpj: {
            type: DataTypes.CHAR(14),
            allowNull: false,
            unique: true,
        },
        presidente: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Ativo','Inativo'),
            defaultValue: 'Ativo',
        }
    }, {
        tableName: 'clube',
        timestamps: false,
    });

    Clube.associate = (models) => {
        Clube.belongsTo(models.Federacao, { foreignKey: 'codFederacao' });
    };

    return Clube;
};
