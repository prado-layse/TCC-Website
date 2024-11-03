// Melhorar a validação depois

const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    // CNPJ deve ter 14 dígitos
    return cnpj.length === 14;
};

module.exports = validarCNPJ;
