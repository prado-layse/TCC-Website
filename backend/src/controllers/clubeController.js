// src/controllers/clubeController.js
exports.adicionarClube = async (req, res) => {
    try {
        const { nome, cidade } = req.body;

        // Lógica para adicionar o clube ao banco de dados
        // Exemplo:
        // await Clube.create({ nome, cidade });

        res.status(201).json({ message: 'Clube cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar clube:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};
