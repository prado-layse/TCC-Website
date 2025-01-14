// src/controllers/usuarioController.js
const { sequelize, Usuario, Clube } = require('../../config/db');
const bcrypt = require('bcryptjs');

// Função para criar um usuário admin
exports.criarAdmin = async (req, res) => {
    const { nome, perfil, email, senha } = req.body;
    console.log('Recebendo requisição para criar admin:', req.body);
    
    try {
        // Verifica se o usuário admin já existe
        const existingAdmin = await Usuario.findOne({ where: { email: email, perfil: 'user-admin' } });
        console.log('Verificando se o usuário admin já existe:', existingAdmin);

        if (existingAdmin) {
            console.log('Usuário admin já existe.');
            return res.status(400).json({ message: 'Usuário admin já existe.' });
        }

        const hashSenha = await bcrypt.hash(senha, 10);
        console.log('Senha hash gerada:', hashSenha);

        const usuario = await Usuario.create({
            nome: nome,
            perfil: perfil,
            email: email,
            senha: hashSenha,
        });
        console.log('Usuário admin criado com sucesso:', usuario);

        res.status(201).json({ message: 'Usuário admin criado com sucesso!', usuario });
    } catch (error) {
        console.error('Erro ao criar usuário admin:', error);
        res.status(500).json({ message: 'Erro ao criar usuário admin.' });
    }
};

// Função de login existente
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
            perfil: usuario.perfil,
            email: usuario.email,
            isAdmin: usuario.perfil === 'user-admin'
        };

        req.session.save(async (err) => {
            if (err) {
                console.error('Erro ao salvar a sessão:', err);
                return res.status(500).json({ message: 'Erro ao iniciar sessão.' });
            }

            // Redirecionar baseado no perfil
            if (usuario.perfil === 'user-admin') {
                // Redirecionar para o dashboard do admin
                return res.redirect('/api/admin/cbhp');
            } else if (usuario.perfil === 'user-clube') {
                // Busca o clube associado ao usuário
                const clube = await Clube.findOne({ where: { codUsuario: usuario.codUsuario } });

                if (clube) {
                    // Redirecionar para o dashboard do clube
                    req.session.usuario.codClube = clube.codClube;
                    req.session.usuario.sigla = clube.sigla;
                    return res.redirect(`/api/clubes/dashboard/${clube.sigla}`);
                } else {
                    return res.status(404).json({ message: 'Clube não encontrado.' });
                }
            } else if (usuario.perfil === 'user-consulta') {
                try {
                    return res.redirect('/api/cbhp');
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
            nome,
            perfil: 'user-consulta',  // Perfil de clube
            email,
            senha: hashSenha
        }, { transaction: t });

        await t.commit();
        //res.status(201).json({ message: 'Usuario cadastrado com sucesso!' });
    } catch (erro) {
        await t.rollback();
        console.error(erro);
        res.status(500).json({ error: "Erro ao cadastrar usuario", message: erro.message });
    }

    res.redirect('/api/cbhp');
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

// Renderizar Perfil
exports.rdPerfil = async (req, res) => {
    //req.session.userId = usuario.codUsuario; // Salvar userId na sessão
    //    req.session.usuario = {
    //        codUsuario: usuario.codUsuario,
    //        idPerfil: usuario.idPerfil,
    //        email: usuario.email,
    //    };
    const usuario = req.session.usuario;

    if (!usuario){
        return res.redirect('/api/usuarios/login')
    }
    else{
        res.render('perfil');
    }
    
};