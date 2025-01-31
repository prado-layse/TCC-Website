const federacaoService = require('../services/federacaoService');

// Listar Federações
exports.listarFederacoes = async (req, res) => {
    try {
        const federacoes = await federacaoService.listarFederacoes();
        res.render('listar-federacoes', { federacoes });
    } catch (error) {
        console.error("Erro ao listar federações:", error);
        res.status(500).send("Erro ao listar federações");
    }
};

// Adicionar Nova Federação
exports.adicionarFederacao = async (req, res) => {
    const { razaoSocial, nomeFantasia, sigla, cnpj, presidente, cep, endereco, cidade, estado, pais, telefone, email, facebook, instagram, site } = req.body;

    if (!razaoSocial || !nomeFantasia || !sigla || !cnpj || !presidente) {
        return res.status(400).json({ error: "Todos os campos da federação são obrigatórios." });
    }

    const codUsuario = req.session.userId;
    if (!codUsuario) {
        return res.status(401).json({ error: "Você deve estar logado para cadastrar uma federação." });
    }

    try {
        const federacaoData = { razaoSocial, nomeFantasia, sigla, cnpj, presidente };
        const enderecoData = { cep, endereco, cidade, estado, pais };
        const contatoData = { telefone, email, facebook, instagram, site };

        const novaFederacao = await federacaoService.adicionarFederacao(federacaoData, enderecoData, contatoData, codUsuario);

        res.status(201).json({ message: 'Federação cadastrada com sucesso!', federacao: novaFederacao });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar federação", message: erro.message });
    }
};


// Consultar Federação
exports.consultarFederacao = async (req, res) => {
    try {
        const federacao = await federacaoService.consultarFederacao(req.params.codFederacao);
        if (federacao) {
            return res.status(200).json(federacao);
        } else {
            return res.status(404).json({ error: true, message: "Essa Federação não existe!" });
        }
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ error: true, message: "Erro ao consultar a Federação." });
    }
};


// Renderizar a página de edição de uma federação
exports.renderizarEdicao = async (req, res) => {
    try {
        const federacao = await federacaoService.consultarFederacao(req.params.codFederacao);
        if (!federacao) {
            return res.status(404).send("Federação não encontrada");
        }

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
    const { razaoSocial, nomeFantasia, sigla, presidente, situacao, cep, endereco, cidade, estado, pais, telefone, email, facebook, instagram, site } = req.body;

    try {
        const federacaoData = { razaoSocial, nomeFantasia, sigla, presidente, situacao };
        const enderecoData = { cep, endereco, cidade, estado, pais };
        const contatoData = { telefone, email, facebook, instagram, site };

        await federacaoService.atualizarFederacao(req.params.codFederacao, federacaoData, enderecoData, contatoData);

        res.redirect('/api/federacoes');
    } catch (erro) {
        console.error("Erro ao atualizar a federação:", erro);
        res.status(500).send("Erro ao atualizar a federação");
    }
};
// Renderizar a página de cadastro de federação
exports.renderizarCadastro = (req, res) => {
    res.render('cadastrar-federacao'); // Certifique-se de ter o arquivo `cadastrar-federacao.handlebars` criado em `src/views`
};
