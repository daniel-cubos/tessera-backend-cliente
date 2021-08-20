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
		.min(11),

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
});

module.exports =
{
	cadastrarCliente,
	editarCliente,
	loginCliente
};