import React, { useState } from 'react';

const UserForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Usuário criado com sucesso!');
            setUsername('');
            setPassword('');
        } else {
            alert('Erro ao criar usuário.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nome de Usuário:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Senha:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Criar Usuário</button>
        </form>
    );
};

export default UserForm;
