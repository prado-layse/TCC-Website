const express = require('express');
const moment = require('moment');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors');
const federacaoRoutes = require('./src/routes/federacaoRoutes');

const site = express();

// Configure o motor de visualização
site.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY');
        }
    }
}));

site.set('view engine', 'handlebars');
site.use(bodyParser.urlencoded({ extended: false }));
site.use(bodyParser.json());
site.use(cors());
site.use('/', federacaoRoutes);  // Roteamento

// Inicie o servidor
site.listen(3000, () => {
    console.log('Servidor rodando na porta 3000: http://localhost:3000/');
});
