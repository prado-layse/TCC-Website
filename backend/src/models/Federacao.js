module.exports = (sequelize, DataTypes) => {
    const Federacao = sequelize.define('Federacao', {
        codFederacao: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        situacao: {
            type: DataTypes.ENUM('Ativo', 'Inativo'),
            defaultValue: 'Ativo',
        },
    }, {
        tableName: 'federacao',
        timestamps: false,
    });

    Federacao.associate = (models) => {
        Federacao.hasMany(models.Endereco, { foreignKey: 'codFederacao', as: 'enderecos' });
        Federacao.hasMany(models.Contato, { foreignKey: 'codFederacao', as: 'contatos' });
        Federacao.hasMany(models.Clube, { foreignKey: 'codFederacao', as: 'clubes' });
    };

    return Federacao;
};