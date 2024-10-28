//backend/src/models/Atleta.js
module.exports = (sequelize, DataTypes) => {
    const Contrato = sequelize.define('Contrato', {
        codContrato: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        codAtleta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'atleta',
                key: 'codAtleta',
            },
        },
        clubeOrigem: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        clubeDestino: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        inicio: {
            type: DataTypes.DATE(8),
            allowNull: false,
        },
        fim: {
            type: DataTypes.DATE(8),
            allowNull: false,
        },
        condicao: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        situacao: {
            type: DataTypes.ENUM('Ativo','Finalizado', 'Cancelado'),
            defaultValue: 'Ativo',
        },
        tipo: {
            type: DataTypes.ENUM('Emprestimo', 'Transferencia'),
            allowNull: false,
        },
        criacao: {
            type: DataTypes.DATE(8),
            defaultValue: DataTypes.NOW
        },
        atualizacao: {
            type: DataTypes.DATE(8),
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'contrato',
        timestamps: false,
    });

    Contrato.associate = (models) => {
        Contrato.belongsTo(models.Atleta, { foreignKey: 'codAtleta', as: 'Atletas'});
    };

    return Contrato;
};