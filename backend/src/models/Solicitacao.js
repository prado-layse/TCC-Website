//backend/src/models/Solicitacao.js
module.exports = (sequelize, DataTypes) => {
    const Solicitacao = sequelize.define('Solicitacao', {
        codSolicitacao: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        codClube: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'clube',
                key: 'codClube',
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
        codResponsavel: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'responsavelatleta',
                key: 'codResponsavel',
            },
        },
        codContato: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'contato',
                key: 'codContato',
            },
        },
        codEndereco: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'endereco',
                key: 'codEndereco',
            },
        },
        codContrato: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'contrato',
                key: 'codContrato',
            },
        },
        situacao: {
            type: DataTypes.ENUM('Pendente','Aprovado', 'Rejeitado'),
            defaultValue: 'Pendente',
        },
        dataSolicitacao: {
            type: DataTypes.DATE,
            dafaultValue: DataTypes.NOW
        },
    }, {
        tableName: 'solicitacao',
        timestamps: false,
    });

    return Solicitacao;
};