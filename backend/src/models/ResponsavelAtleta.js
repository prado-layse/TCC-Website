//backend/src/models/Atleta.js
module.exports = (sequelize, DataTypes) => {
    const Responsavel = sequelize.define('Responsavel', {
        codResponsavel: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        sobrenome: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        rg: {
            type: DataTypes.CHAR(9),
            allowNull: false,
            unique: true,
        },
        cpf: {
            type: DataTypes.CHAR(11),
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'responsavel_atleta',
        timestamps: false,
    });

    return Responsavel;
};