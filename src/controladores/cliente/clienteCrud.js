const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../../bancodedados/conexao');
const schema = require('../../validacao/clienteSchema');
const { uploadImagem, atualizarImagem } = require('../../supabase');

const cadastrarCliente = async (req, res) => {
	const cliente = req.body;

	try {
		await schema.cadastrarCliente.validate(req.body);

		const existeUsuario = await knex('clientes').where('email', cliente.email).first();

		if (existeUsuario)
			return res.status(400).json('Email já cadastrado');

		const { senha: senhaCliente, ...dadosCliente } = cliente;
		const senhaCriptografada = await bcrypt.hash(senhaCliente, 10);

		const novoCliente = { ...dadosCliente, senha: senhaCriptografada }

		const clienteCadastrado = await knex('clientes').insert(novoCliente).returning('*');

		if (clienteCadastrado.length === 0)
			return res.status(400).json('Não foi possível realizar o cadastro do cliente.');

		if (cliente.imagemCliente) {
			const caminhoImagem = 'cliente_' + clienteCadastrado[0].id + '/fotoCliente.jpg';
			const uploadImage = uploadImagem(restaurante.imagemRestaurante, caminhoImagem);

			if (uploadImage.length === 0)
				return res.status(400).json(uploadImage)
		}

		return res.status(200).json("Cliente cadastrado com sucesso");
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

const editarCliente = async (req, res) => {
	const { authorization } = req.headers;
	const requisicaoCliente = req.body;

	try {
		const { id: usuario_id } = jwt.verify(authorization, process.env.SENHA_JWT);

		if (Object.keys(req.body).length === 0)
			return res.status(400).json("Deve ser preenchida alguma informação para atualizacao");

		await schema.editarCliente.validate(req.body)

		const clienteBD = await knex('clientes').where({ id: usuario_id });

		let { senha } = clienteBD[0];

		if (requisicaoCliente.senha) {
			const validarSenha = await bcrypt.compare(requisicaoCliente.senha, senha);

			if (!validarSenha)
				senha = await bcrypt.hash(requisicaoCliente.senha, 10);
		}

		const atualizarCliente =
		{
			nome: requisicaoCliente.nome,
			email: requisicaoCliente.email,
			senha
		}

		if (Object.keys(req.body).length !== 0) {
			const clienteAtualizado = await knex('clientes').where({ id: usuario_id }).update(atualizarCliente);

			if (clienteAtualizado.length === 0)
				return res.status(400).json('Erro na atualização do cliente.');
		}

		if (requisicaoCliente.imagemCliente) {
			const caminhoImagem = 'cliente_' + usuario_id + '/fotoCliente.jpg';
			const uploadImage = atualizarImagem(requisicaoCliente.imagemCliente, caminhoImagem);

			if (uploadImage.length === 0)
				return res.status(400).json(uploadImage)
		}

		return res.status(200).json('Atualização concluida com sucesso');
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

module.exports =
{
	cadastrarCliente,
	editarCliente
}