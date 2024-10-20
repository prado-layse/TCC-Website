const Usuario = require('../models/Usuario'); // Importando o modelo Usuario
const Perfil = require('../models/Perfil'); // Importando o modelo Perfil
const bcrypt = require('bcryptjs');

// Função de Cadastro de Administrador
exports.cadastrarAdmin = async (req, res) => {
    const { email, senha, idPerfil } = req.body; // Agora recebemos 'idPerfil'

    try {
        // Verifique se o email já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });

        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        // Verifique se o perfil existe
        const perfilExistente = await Perfil.findByPk(idPerfil); // Usando o idPerfil para buscar o perfil
        if (!perfilExistente) {
            return res.status(400).json({ message: 'Perfil inválido.' });
        }

        // Criptografando a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Insira o novo usuário
        const novoUsuario = await Usuario.create({
            email,
            senha: senhaHash,
            idPerfil: perfilExistente.idPerfil // Usando idPerfil ao invés de perfil
        });

        res.status(201).json({ message: 'Administrador cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar administrador:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Função de Login
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({
            where: { email },
            include: [{ model: Perfil, attributes: ['nome'] }] // Incluindo o perfil para pegar o nome
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // Geração do token (removido por enquanto)
        // const token = jwt.sign({ id: usuario.codUsuario, perfil: usuario.perfil }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.json({ token, perfil: usuario.perfil });

        res.json({ message: 'Login bem-sucedido', perfil: usuario.perfil.nome }); // Ajuste para retornar o nome do perfil
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};
