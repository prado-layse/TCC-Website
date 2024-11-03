import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false); // Estado para indicar carregamento
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');

        // Validação básica dos campos
        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos.');
            setCarregando(false);
            return;
        }

        try {
            console.log('Enviando dados:', { email, senha }); // Log para debug

            const response = await axios.post('http://localhost:5000/api/usuarios/login', { email, senha });
            const { token, perfil } = response.data;

            localStorage.setItem('token', token); // Armazena o token no localStorage

            if (perfil === 'user-admin') {
                navigate('/federacoes'); // Redireciona se o perfil for admin
            } else {
                setErro('Apenas admins podem acessar esta área.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error); // Log para verificar erros
            
            // Extraindo a mensagem de erro
            if (error.response && error.response.data) {
                setErro(error.response.data.message || 'Credenciais inválidas. Tente novamente.');
            } else {
                setErro('Erro de conexão. Tente novamente mais tarde.');
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email" // Alterado para type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required // Campo obrigatório
                /><br /><br />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required // Campo obrigatório
                /><br /><br />
                <button type="submit" disabled={carregando}>
                    {carregando ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
        </div>
    );
};

export default Login;
