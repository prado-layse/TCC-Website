const { where } = require('sequelize');
const { sequelize, Usuario, Clube } = require('../../config/db');
const bcrypt = require('bcryptjs');
const session = require('express-session');

class userService {
    static async criarAdmin(nome, perfil, email, senha) {
        const existingAdmin = await Usuario.findOne({where: {email, perfil: 'user-admin'}});
        if(existingAdmin){
            throw new Error('Usuário admin já existe.');
        }

        const hashSenha = await bcrypt.hash(senha, 10);
        return await Usuario.create({nome: nome, perfil: perfil, email: email, senha: hashSenha});

    }

    static async login({ email, senha }) {
        const usuario = await Usuario.findOne({ where: { email } });
    
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            throw new Error('Email ou senha incorretos.');
        }
    
        return {
            codUsuario: usuario.codUsuario,
            perfil: usuario.perfil,
            email: usuario.email,
            isAdmin: usuario.perfil === 'user-admin'
        };
    }
    

    static async adicionarUsuario(nome, email, senha, confirmarSenha){
         if (!nome || !email || !senha || !confirmarSenha) {
             throw new Error('Todos os campos são obrigatórios.');
        }

        if (senha !== confirmarSenha){
            throw new Error('As senhas não são iguais.');
        }

        const emailIgual = await Usuario.findOne({ where: { email: email } });
        if (emailIgual) {
            throw new Error('Cadastro negado. Este e-mail já foi cadastrado.');
        }

        const t = await sequelize.transaction();
        try {
            const hashSenha = await bcrypt.hash(senha, 10);
            const novoUsuario = await Usuario.create({
                nome,
                perfil: 'user-consulta',
                email,
                senha: hashSenha
            }, { transaction: t });
            await t.commit();
            //res.status(201).json({ message: 'Usuario cadastrado com sucesso'});
        } catch (error) {
            await t.rollback();
            throw new Error('Erro ao cadastrar usuário');
        }
    }

    static async listarUsuarios(){
        const usuarios = await Usuario.findAll();
        return usuarios.map(u => u.toJSON());
    }
}

module.exports = userService;