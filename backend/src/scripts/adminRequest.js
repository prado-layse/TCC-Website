const axios = require('axios');

async function createAdmin() {
    const url = 'http://localhost:3000/api/usuarios/create-admin';
    const data = {
        nome: 'Administrador',
        perfil: 'user-admin',
        email: 'admin@example.com',
        senha: '123456'
    };

    try {
        console.log('Enviando requisição para criar admin:', data);
        const response = await axios.post(url, data);
        console.log('Resposta do servidor:', response.data);
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error.response ? error.response.data : error.message);
    }
}

createAdmin();