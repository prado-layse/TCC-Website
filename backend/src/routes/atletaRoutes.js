const express = require('express');
const router = express.Router();
const atletaController = require('../controllers/atletaController');
const auth = require('../middleware/auth');

// Rota: Cadastrar Atleta
router.get('/cadastrar', auth(2), atletaController.rdCadastroAtleta);
router.post('/adicionar', auth(2), atletaController.adicionarAtletas);

module.exports = router;
