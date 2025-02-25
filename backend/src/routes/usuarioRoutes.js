const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para criar um usuário admin
router.post('/create-admin', usuarioController.criarAdmin);

// Rota para acessar a página de login
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza a página de login
});

// Rota para acessar a página de cadastro de usuário
router.get('/cadastrar', (req, res) => {
    res.render('cadastro-usuario'); // Renderiza a página de login
});

// Rota para listar os usuários
router.get('/listar', usuarioController.rdListaUsuarios);

// Rota para cadastrar um usuário novo
router.post('/adicionar', usuarioController.adicionarUsuario);

// Rota para processar o login
router.post('/login', usuarioController.login);

// Rota para acessar o perfil
router.get('/perfil', usuarioController.rdPerfil);

module.exports = router;
