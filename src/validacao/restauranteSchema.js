const yup = require('./config');

const cadastrarRestaurante = yup.object().shape({
    nome: yup
        .string()
        .max(50)
        .required(),
    
    descricao: yup    
        .string()
        .max(100),

    idCategoria: yup
        .number()
        .required()
        .min(1),

    taxaEntrega: yup
        .number()
        .min(0),

    tempoEntregaEmMinutos: yup
        .number()
        .required(),
    
    valorMinimoPedido: yup
        .number()
        .required()
        .min(0)
});

const editarRestaurante = yup.object().shape({
    nome: yup
        .string()
        .max(50),
    
    descricao: yup    
        .string()
        .max(100),

    idCategoria: yup
        .number()
        .min(1),

    taxaEntrega: yup
        .number()
        .min(0),

    tempoEntregaEmMinutos: yup
        .number(),
    
    valorMinimoPedido: yup
        .number()
        .min(0)
});

module.exports = 
{
    cadastrarRestaurante,
    editarRestaurante
};