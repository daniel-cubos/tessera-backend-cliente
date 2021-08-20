const yup = require('./config');

const cadastrarProduto = yup.object().shape({
    nome: yup
        .string()
        .max(50)
        .required(),
    preco: yup
        .number()
        .required(),
    descricao: yup
        .string()
        .max(100),
    permiteObservacoes: yup
        .boolean()
});

const consultarProduto = yup.object().shape(
{
    id: yup
        .number()
        .min(1),
});

const editarProduto = yup.object().shape(
{
            nome: yup
                .string()
                .max(50),
            preco: yup
                .number(),
            descricao: yup
                .string()
                .max(100),
            permiteObservacoes: yup
                .boolean()
});

const deletarProdutos = yup.object().shape(
{
    id: yup
        .number()
        .min(1)
        .required()
});

module.exports = 
{
    cadastrarProduto,
    consultarProduto,
    editarProduto,
    deletarProdutos
};