module.exports = (sequelize, DataTypes) => {
    const Atleta = sequelize.define('Atleta', {
        codAtleta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        codClube: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        situacao: {
            type: DataTypes.ENUM('Ativo', 'Inativo', 'Pendente', 'Suspenso', 'Emprestado'),
            defaultValue: 'Ativo',
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sobrenome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        nascimento: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        sexo: {
            type: DataTypes.ENUM('F', 'M'),
            allowNull: false,
        },
        nacionalidade: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        rg: {
            type: DataTypes.CHAR(9),
            allowNull: true,
            unique: true,
        },
        cpf: {
            type: DataTypes.CHAR(11),
            allowNull: true,
            unique: true,
        },
        passaporte: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true,
        },
        validadePassaporte: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'atleta',
        timestamps: false,
    });

    Atleta.associate = (models) => {
        Atleta.belongsTo(models.Clube, { foreignKey: 'codClube', as: 'clube' });
        Atleta.belongsTo(models.ResponsavelAtleta, { foreignKey: 'codResponsavel', as: 'responsavel' });
        Atleta.hasMany(models.Endereco, { foreignKey: 'codAtleta', as: 'enderecos' });
        Atleta.hasMany(models.Contato, { foreignKey: 'codAtleta', as: 'contatos' });
    };

    return Atleta;
};