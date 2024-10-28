//backend/src/models/Atleta.js
module.exports = (sequelize, DataTypes) => {
    const Responsavel = sequelize.define('Responsavel', {
        codResponsavel: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sobrenome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        rg: {
            type: DataTypes.CHAR(9),
            allowNull: true,
            unique: true,
        },
        cpf: {
            type: DataTypes.CHAR(20),
            allowNull: true,
            unique: true,
        },
    }, {
        tableName: 'responsavelatleta',
        timestamps: false,
    });

    return Responsavel;
};