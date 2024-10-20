const express = require('express');
const moment = require('moment');
const path = require('path');
const cors = require('cors');
const { engine } = require('express-handlebars');
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') }); // Carrega variáveis de ambiente do .env

// Importando rotas
const federacaoRoutes = require('./src/routes/federacaoRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes'); // Certifique-se de que esta importação está correta
const authMiddleware = require('./src/middleware/authMiddleware'); // Importa o middleware de autenticação

const site = express();

// Configuração do motor de visualização Handlebars
site.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => moment(date).format('DD/MM/YYYY'), // Formata a data
    },
}));
site.set('view engine', 'handlebars');
site.set('views', path.join(__dirname, 'src', 'views')); // Define o caminho para as views

// Middlewares
site.use(cors()); // Habilita o CORS para permitir requisições de diferentes origens
site.use(express.json()); // Para analisar JSON no corpo da requisição
site.use(express.urlencoded({ extended: false })); // Para analisar dados URL-encoded

// Rotas
site.use('/api/federacoes', authMiddleware, federacaoRoutes); // Rotas para federações (protegidas pelo middleware)
site.use('/api/usuarios', usuarioRoutes); // Rotas para usuários

// Rotas para renderização de views (sem middleware de autenticação)
site.get('/federacoes/cadastro', (req, res) => {
    res.render('cadastro-federacao'); // Renderiza a página de cadastro de federações
});

// Inicie o servidor
const PORT = process.env.PORT || 3000;
site.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}/`);
});
