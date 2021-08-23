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
		.number()
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
		.required()
		.min(8)
		.max(8),

	rua: yup
		.string()
		.strict()
		.required(),

	bairro: yup
		.string()
		.strict()
		.required(),

	cidade: yup
		.string()
		.strict()
		.required(),

	estado: yup
		.string()
		.min(2)
		.max(2)
		.required(),

	numero: yup
		.string()
		.required(),

	complemento: yup
		.string()
		.notRequired()
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


module.exports =
{
	cadastrarCliente,
	editarCliente,
	loginCliente,
	verificarCEP,
	verificarCarrinho
};