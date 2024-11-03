// backend/src/models/Endereco.js
module.exports = (sequelize, DataTypes) => {
    const Endereco = sequelize.define('Endereco', {
        codEndereco: {
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
        },
        codClube: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        endereco: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cidade: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pais: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'endereco',
        timestamps: false,
    });

    //Endereco.associate = (models) => {
    //    Endereco.belongsTo(models.Federacao, { foreignKey: 'codFederacao' });
    //    Endereco.belongsTo(models.Clube, { foreignKey: 'codClube'});
   // };

    return Endereco;
};
