const { Federacao, Endereco, Contato, Usuario, sequelize } = require('../models');

const federacaoService = {

    // Listar Federações
    listarFederacoes: async () => {
        const federacoes = await Federacao.findAll({
            include: [
                { model: Endereco, as: 'Enderecos' },
                { model: Contato, as: 'Contatos' }
            ]
        });

        return JSON.parse(JSON.stringify(federacoes)); // Evita problemas com propriedades do Sequelize
    },

    // Adicionar Nova Federação
    adicionarFederacao: async (federacaoData, enderecoData, contatoData, codUsuario) => {
        const t = await sequelize.transaction();

        try {
            const usuario = await Usuario.findOne({ where: { codUsuario } });

            if (usuario.idPerfil !== 1) {
                throw new Error("Acesso negado. Apenas usuários admin podem cadastrar federações.");
            }

            // Cadastrar na tabela federacao
            const novaFederacao = await Federacao.create(federacaoData, { transaction: t });

            // Cadastrar na tabela endereco
            await Endereco.create({
                codFederacao: novaFederacao.codFederacao,
                ...enderecoData
            }, { transaction: t });

            // Cadastrar na tabela contato
            await Contato.create({
                codFederacao: novaFederacao.codFederacao,
                ...contatoData
            }, { transaction: t });

            // Confirma a transação
            await t.commit();

            return novaFederacao;
        } catch (erro) {
            await t.rollback();
            throw erro;
        }
    },

    // Consultar Federação
    consultarFederacao: async (codFederacao) => {
        return await Federacao.findOne({ where: { codFederacao } });
    },

    // Atualizar Federação
    atualizarFederacao: async (codFederacao, federacaoData, enderecoData, contatoData) => {
        const t = await sequelize.transaction();

        try {
            // Atualizar dados da federação
            await Federacao.update(federacaoData, { where: { codFederacao }, transaction: t });

            // Atualizar dados de endereço
            await Endereco.update(enderecoData, { where: { codFederacao }, transaction: t });

            // Atualizar dados de contato
            await Contato.update(contatoData, { where: { codFederacao }, transaction: t });

            // Confirma a transação
            await t.commit();
        } catch (erro) {
            await t.rollback();
            throw erro;
        }
    }
};

module.exports = federacaoService;
