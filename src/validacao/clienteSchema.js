const yup = require('./config');

const cadastrarCliente = yup.object().shape({
	nome: yup
		.string()
		.max(100)
		.required(),

	email: yup
		.string()
		.email()
		.max(100)
		.required(),

	senha: yup
		.string()
		.required()
		.min(6),

	telefone: yup
		.string()
		.required()
		.min(8),

});

const editarCliente = yup.object().shape({
	nome: yup
		.string()
		.max(100),

	email: yup
		.string()
		.email()
		.max(100),

	senha: yup
		.string()
		.min(6)
});

const loginCliente = yup.object().shape({
	email: yup
		.string()
		.email()
		.required()
		.max(100),

	senha: yup
		.string()
		.required()
		.min(6)
});

const verificarCEP = yup.object().shape({
	cep: yup
		.string()
		.min(8)
		.max(8)
		.required(),

	endereco: yup
		.string()
		.strict()
		.required(),

	complemento: yup
		.string()
		.required()
});

const verificarCarrinho = yup.object().shape({
	idProduto: yup
		.number()
		.required()
		.positive()
		.min(1),

	quantidade: yup
		.number()
		.positive()
		.required(),
});

const verificarPedido = yup.object().shape({
	idRestaurante: yup
		.number()
		.required()
		.positive(),

	subtotal: yup
		.number()
		.positive()
		.required(),

	taxaEntrega: yup
		.number()
		.required(),

	totalPedido: yup
		.number()
		.positive()
		.required(),
});

module.exports =
{
	cadastrarCliente,
	editarCliente,
	loginCliente,
	verificarCEP,
	verificarCarrinho,
	verificarPedido
};