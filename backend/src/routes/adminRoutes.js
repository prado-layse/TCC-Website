// backend/src/routes/adminRoutes.js
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth('user-admin')); // Apenas usuários admin podem acessar essas rotas

// Defina suas rotas admin aqui
router.get('/dashboard', (req, res) => {
    res.send('Bem-vindo ao painel do admin!');
});

module.exports = router;
