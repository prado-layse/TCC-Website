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
        cep: {
            type: DataTypes.CHAR(8),
            allowNull: false,
        },
        endereco: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        cidade: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'),
            allowNull: false,
        },
        pais: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        tableName: 'endereco',
        timestamps: false,
    });

    Endereco.associate = (models) => {
        Endereco.belongsTo(models.Federacao, { foreignKey: 'codFederacao', as: 'federacao' });
        Endereco.belongsTo(models.Atleta, { foreignKey: 'codAtleta', as: 'atleta' });
        Endereco.belongsTo(models.Clube, { foreignKey: 'codClube', as: 'clube' });
    };

    return Endereco;
};