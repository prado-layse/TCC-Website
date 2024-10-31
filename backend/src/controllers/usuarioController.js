// src/controllers/usuarioController.js
const { sequelize, Usuario, Clube } = require('../../config/db');
const bcrypt = require('bcryptjs');

// Acessar a Tela do Clube
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Salvar os dados do usuário na sessão
        req.session.userId = usuario.codUsuario; // Salvar userId na sessão
        req.session.usuario = {
            codUsuario: usuario.codUsuario,
            idPerfil: usuario.idPerfil,
            email: usuario.email,
        };

        req.session.save(async (err) => {
            if (err) {
                console.error('Erro ao salvar a sessão:', err);
                return res.status(500).json({ message: 'Erro ao iniciar sessão.' });
            }

            // Redirecionar baseado no perfil
            if (usuario.idPerfil === 1) {
                // Redirecionar para o dashboard do admin
                return res.redirect('/api/admin/dashboard');
            } else if (usuario.idPerfil === 2) {
                // Busca o clube associado ao usuário
                const clube = await Clube.findOne({ where: { codUsuario: usuario.codUsuario } });

                if (clube) {
                    // Redirecionar para o dashboard do clube
                    return res.redirect('/api/admin/dashboard');
                } else {
                    return res.status(404).json({ message: 'Clube não encontrado.' });
                }
            } else if (usuario.idPerfil === 3) {
                try{
                    return res.redirect('/api/admin/dashboard');
                } catch (error) {
                    console.error('Erro no redirecionamento.', error);
                    return res.status(404).json({ message: 'Erro no redirecionamento.' });
                }
            }

            // Se nenhum dos casos acima, retorne uma mensagem de sucesso
            res.status(200).json({ message: 'Login bem-sucedido!' });
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Adicionar Novo Usuario
exports.adicionarUsuario = async (req, res) => {
    console.log('Corpo da requisição:', req.body);
    
    const { email, senha } = req.body;
    
    if (!email || !senha ) {
        return res.status(400).json({ error: "Todos os campos do clube são obrigatórios." });
    } 
    
    const emailIgual = await Usuario.findOne({ where: { email: email } });
    if (emailIgual) {
        return res.status(403).json({ error: "Cadastro negado. Este e-mail já foi cadastrado." });
    }

    const t = await sequelize.transaction();

    try {
        // 1. Cria o usuário
        const hashSenha = await bcrypt.hash(senha, 10);
        const NovoUsuario = await Usuario.create({
            idPerfil: 3,  // Perfil de clube
            email,
            senha: hashSenha
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Usuario cadastrado com sucesso!' });
        res.redirect('/api/admin/dashboard');

    } catch (erro) {
        await t.rollback();
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar usuario", message: erro.message });
    }
};

// Renderizar Tela de Cadastro
exports.rdCadastroUsuario = (req, res) => {
    res.render('cadastro-usuario');
};

// Renderizar Lista de Usuarios
exports.rdListaUsuarios = async (req, res) => {

    try{
        const usuarios = await Usuario.findAll(); //puxa do banco todos os usuarios da tabela usuario
        const usuariosData = usuarios.map( u => u.toJSON()); //pega esses dados e transforma num json pra burlar uma medida de segurança do handlebars que breca a ação de listar dados que ele considera sensível

        res.render('listar-usuarios', { usuarios: usuariosData }); //renderiza o handlebars e passa os usuários junto
    }
    catch(error){
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }

    
};