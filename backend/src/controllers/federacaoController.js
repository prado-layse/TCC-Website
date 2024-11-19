//src/controllers/federacaoController.js
const { Federacao, Endereco, Contato, Usuario, sequelize } = require('../models');

// Listar Federações
exports.listarFederacoes = async (req, res) => {
    try {
        const federacoes = await Federacao.findAll({
            include: [
                { model: Endereco, as: 'Enderecos' }, // Altere aqui para 'enderecos'
                { model: Contato, as: 'Contatos' }    // Altere aqui para 'contatos'
            ]
        });

        const federacoesLimpas = JSON.parse(JSON.stringify(federacoes)); // Evita problemas com propriedades do Sequelize

        res.render('listar-federacoes', { federacoes: federacoesLimpas });
    } catch (error) {
        console.error("Erro ao listar federações:", error);
        res.status(500).send("Erro ao listar federações");
    }
};

// Adicionar Nova Federação
exports.adicionarFederacao = async (req, res) => {
    console.log('Corpo da requisição:', req.body); // Log da estrutura completa

    // Extraindo dados diretamente da requisição
    //const { federacaoData, enderecoData, contatoData } = req.body;

    const { 
        razaoSocial, nomeFantasia, sigla, cnpj, 
        presidente, cep, endereco, cidade, estado, 
        pais, telefone, email, facebook, instagram,
        site 
    } = req.body;

    // Validação dos dados da federação
    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos da federação são obrigatórios." });
    }

    // Verifica se o usuário está autenticado
    const codUsuario = req.session.userId;
    if (!codUsuario) {
        return res.status(401).json({ error: "Você deve estar logado para cadastrar uma federação." });
    }

    const t = await sequelize.transaction();
    
    try {

        // Verifica se o usuário tem perfil de admin (idPerfil 1)
        const usuario = await Usuario.findOne({ where: { codUsuario } });
        if (usuario.idPerfil !== 1) {
            return res.status(403).json({ error: "Acesso negado. Apenas usuários admin podem cadastrar federações." });
        }
        //1. Cadastrar na tabela federacao
        const novaFederacao = await Federacao.create({ 
            razaoSocial, 
            nomeFantasia, 
            sigla, 
            cnpj, 
            presidente
        }, { transaction: t});

        //2. Cadastrar na tabela endereco
        await Endereco.create({ 
            codFederacao: novaFederacao.codFederacao,
            cep,
            endereco,
            cidade,
            estado,
            pais
        }, { transaction: t });
        await Contato.create({  
            codFederacao: novaFederacao.codFederacao,
            telefone,
            email,
            facebook,
            instagram,
            site 
        }, { transaction: t });

        // confirma a transação
        await t.commit();
        res.status(201).json( { message: 'Federação cadastrada com sucesso!'});
    } catch (erro) {
        await t.rollback();
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar federação", message: erro.message });
    }
};

// Renderizar Tela de Cadastro
exports.renderizarCadastro = (req, res) => {
    res.render('cadastro-federacao');
};

// Consultar Federação
exports.consultarFederacao = (req, res) => {
    Federacao.findOne({ where: { codFederacao: req.params.codFederacao } })
        .then(federacao => {
            if (federacao) {
                return res.status(200).json(federacao);
            } else {
                return res.status(404).json({ error: true, message: "Essa Federação não existe!" });
            }
        })
        .catch(erro => {
            console.error(erro);
            return res.status(500).json({ error: true, message: "Erro ao consultar a Federação." });
        });
};

// Renderizar a página de edição de uma federação
exports.renderizarEdicao = async (req, res) => {
    try {
        const { codFederacao } = req.params;
        const federacao = await Federacao.findOne({
            where: { codFederacao },
            include: [
                { model: Endereco, as: 'Enderecos' },
                { model: Contato, as: 'Contatos' }
            ]
        });

        if (!federacao) {
            return res.status(404).send("Federação não encontrada");
        }

        // Extrair o primeiro endereço e contato, ou usar valores padrão
        const endereco = federacao.Enderecos[0] || {};
        const contato = federacao.Contatos[0] || {};

        res.render('editar-federacao', {
            federacao: federacao.toJSON(),
            endereco,
            contato,
        });
    } catch (erro) {
        console.error("Erro ao carregar página de edição:", erro);
        res.status(500).send("Erro ao renderizar a página de edição");
    }
};

// Atualizar Federação
exports.atualizarFederacao = async (req, res) => {
    const { codFederacao } = req.params;
    const { razaoSocial, nomeFantasia, sigla, presidente, situacao,//Adicao de situacao nas constantes para alteração
        cep, endereco, cidade, estado, pais, telefone, email, 
        facebook, instagram, site } = req.body;

    const t = await sequelize.transaction();

    try {
        // Atualizar dados da federação
        await Federacao.update(
            { razaoSocial, nomeFantasia, sigla, presidente, situacao },//Adicionei a possibilidade de alterar situacao e retirei CNPJ
            { where: { codFederacao }, transaction: t }
        );

        // Atualizar dados de endereço
        await Endereco.update(
            { cep, endereco, cidade, estado, pais },
            { where: { codFederacao }, transaction: t }
        );

        // Atualizar dados de contato
        await Contato.update(
            { telefone, email, facebook, instagram, site },
            { where: { codFederacao }, transaction: t }
        );

        // Confirma a transação
        await t.commit();

        res.redirect('/api/federacoes');
    } catch (erro) {
        await t.rollback();
        console.error("Erro ao atualizar a federação:", erro);
        res.status(500).send("Erro ao atualizar a federação");
    }
};


