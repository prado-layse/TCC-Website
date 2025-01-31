const userService = require('../services/userService');

// Função para criar um usuário admin
exports.criarAdmin = async (req, res) => {
    try{
        const usuario = await userService.criarAdmin(req.body);
        res.status(201).json({ message: 'Usuário admin criado com sucesso!', usuario });
    } catch(error) {
        console.error('Erro ao criar usuário admin:', error);
        res.status(500).json({ message: 'Erro ao criar usuário admin.' });
        }
    };

// Função de login existente
exports.login = async (req, res) => {
    try {
        console.log('Corpo da requisição:', req.body);
        const { email, senha } = req.body;
        const usuario = await userService.login({ email, senha });

        // Salvando dados na sessão
        req.session.userId = usuario.codUsuario;
        req.session.usuario = usuario;

        req.session.save(async (err) => {
            if (err) {
                console.error('Erro ao salvar a sessão:', err);
                return res.status(500).json({ message: 'Erro ao iniciar sessão' });
            }

            // Redirecionamento baseado no perfil do usuário
            if (usuario.perfil === 'user-admin') {
                return res.redirect('/api/admin/cbhp');
            } else if (usuario.perfil === 'user-clube') {
                const clube = await Clube.findOne({ where: { codUsuario: usuario.codUsuario }});
                if (!clube) {
                    throw { status: 404, message: 'Clube não encontrado.' };
                }

                req.session.usuario.codUsuario = clube.codUsuario;
                req.session.usuario.sigla = clube.sigla;
                return res.redirect(`/api/clubes/dashboard/${clube.sigla}`);
            } else {
                return res.redirect('/api/cbhp');
            }
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(error.status || 500).json({ message: error.message || 'Erro ao fazer login.' });
    }
};
    /*
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
    */

// Adicionar Novo Usuario
exports.adicionarUsuario = async (req, res) => {
    try{
        console.log('Corpo da requisição:', req.body);
        const { nome, email, senha, confirmarSenha } = req.body;
        await userService.adicionarUsuario(nome, email, senha, confirmarSenha);
        res.redirect('/api/cbhp');      
    } catch (error) {
        console.error('Erro ao adicionar usuário', error);
        res.status(error.status || 500).json({ message: error.message || 'Erro ao adicionar usuário.' });
    }
};

// Renderizar Tela de Cadastro
exports.rdCadastroUsuario = (req, res) => {
    res.render('cadastro-usuario');
};

// Renderizar Lista de Usuarios
exports.rdListaUsuarios = async (req, res) => {
    try{
        const usuarios = await userService.listarUsuarios();
        res.render('listar-usuarios', { usuarios })
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
}

// Renderizar Perfil
exports.rdPerfil = async (req, res) => {
    if(!req.session.usuario) {
        return res.redirect('/api/usuarios/login');
    }
    res.render('perfil');
};