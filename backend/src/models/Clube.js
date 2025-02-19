module.exports = (sequelize, DataTypes) => {
    const Clube = sequelize.define('Clube', {
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
        codUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'codUsuario',
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
        situacao: {
            type: DataTypes.ENUM('Ativo', 'Inativo'),
            defaultValue: 'Ativo',
        },
    }, {
        tableName: 'clube',
        timestamps: false,
    });

    Clube.associate = (models) => {
        Clube.belongsTo(models.Federacao, { foreignKey: 'codFederacao', as: 'federacao' });
        Clube.belongsTo(models.Usuario, { foreignKey: 'codUsuario', as: 'usuario' });
        Clube.hasMany(models.Endereco, { foreignKey: 'codClube', as: 'enderecos' });
        Clube.hasMany(models.Contato, { foreignKey: 'codClube', as: 'contatos' });
    };

    return Clube;
};