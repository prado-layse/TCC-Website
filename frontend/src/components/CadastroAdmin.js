import React, { useState } from 'react';
import axios from 'axios';

const CadastroAdmin = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false); // Estado de carregamento

    const handleCadastro = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
        
        // Validação básica dos campos
        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        setCarregando(true); // Começa o carregamento

        try {
            const response = await axios.post('http://localhost:5000/api/usuarios/cadastro-admin', {
                email, senha
            });
            setSucesso(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setErro(error.response.data.message || 'Erro ao cadastrar. Tente novamente.');
            } else {
                setErro('Erro ao cadastrar. Tente novamente.');
            }
            console.error('Erro ao cadastrar:', error);
        } finally {
            setCarregando(false); // Finaliza o carregamento
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Cadastro de Administrador</h2>
            <form onSubmit={handleCadastro}>
                <input 
                    type="email" 
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
                    {carregando ? 'Cadastrando...' : 'Cadastrar Admin'}
                </button>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    );
};

export default CadastroAdmin;
