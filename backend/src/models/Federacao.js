const db = require('../../config/db');
const validarCNPJ = require('../utils/validarCNPJ');

const Federacao = db.sequelize.define('federacao', {
    codFederacao: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },    
    razaoSocial: {
        type: db.Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    nomeFantasia: {
        type: db.Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    sigla: {
        type: db.Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 10]
        }
    },
    cnpj: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{14}$/, // Verifica se tem exatamente 14 dígitos
            isValidCNPJ: (value) => {
                if (!validarCNPJ(value)) {
                    throw new Error('CNPJ deve ter exatamente 14 dígitos');
                }
            }
        }
    },
    presidente: {
        type: db.Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    }
}, {
    tableName: 'federacao',
    timestamps: false
});

// Adiciona a validação personalizada ao Sequelize
db.Sequelize.addHook('beforeValidate', (federacao) => {
    if (federacao.cnpj) {
        federacao.cnpj = federacao.cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    }
});

module.exports = Federacao;
