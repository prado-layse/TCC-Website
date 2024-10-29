//src/controllers/atletaController.js
const { Endereco, Contato, Clube, Atleta, ResponsavelAtleta, Contrato} = require('../models');

// Listar Atletas
exports.listarAtletas = async (req, res) => {
    try {
        const atletas = await Atleta.findAll({
            include: [
                { model: Endereco, as: 'enderecos' }, // Altere aqui para 'enderecos'
                { model: Contato, as: 'contatos' }    // Altere aqui para 'contatos'
            ]
        });

        const atletasLimpas = JSON.parse(JSON.stringify(atletas)); // Evita problemas com propriedades do Sequelize

        res.render('listar-atletas', { atletas: atletasLimpas });
    } catch (error) {
        console.error("Erro ao listar atletas:", error);
        res.status(500).send("Erro ao listar atletas");
    }
};