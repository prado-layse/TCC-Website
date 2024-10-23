// src/routes/clubeRoutes.js
const express = require('express');
const router = express.Router();
const clubeController = require('../controllers/clubeController');
const auth = require('../middleware/auth')

//Middleware de autenticação
router.use(auth(1));
// Rota: Listar Clubes
//router.get('/', clubeController.listarClubes);
// Rota: Cadastrar Clube
router.get('/cadastrar', clubeController.rdCadastroClube);
router.post('/adicionar', clubeController.adicionarClube);

module.exports = router;
