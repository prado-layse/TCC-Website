// src/routes/clubeRoutes.js
const express = require('express');
const router = express.Router();
const clubeController = require('../controllers/clubeController'); // Verifique este caminho
const verificarAdmin = require('../middleware/verificarAdminMiddleware');

// Rota: Tela de Cadastro de Clube (Apenas Admin)
router.get('/cadastro', verificarAdmin, (req, res) => {
    res.render('cadastro-clube'); // Renderiza a página de cadastro de clube
});

// Rota: Adicionar Novo Clube (Apenas Admin)
router.post('/', verificarAdmin, (req, res) => {
    clubeController.adicionarClube(req, res).catch((err) => {
        console.error('Erro ao adicionar clube:', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    });
});

module.exports = router;
