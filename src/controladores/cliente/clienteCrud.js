const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../../bancodedados/conexao');
const schema = require('../../validacao/clienteSchema');
const { uploadImagem, atualizarImagem, pegarUrlImagem } = require('../../supabase');

const cadastrarCliente = async (req, res) => {
	const requisicaoCliente = req.body;

	try {
		await schema.cadastrarCliente.validate(req.body);

		const existeUsuario = await knex('cliente').where('email', requisicaoCliente.email).first();

		if (existeUsuario)
			return res.status(400).json('Email já cadastrado');

		const { senha: senhaCliente, imagemCliente, ...dadosCliente } = requisicaoCliente;
		const senhaCriptografada = await bcrypt.hash(senhaCliente, 10);

		const novoCliente = { ...dadosCliente, senha: senhaCriptografada }

		const clienteCadastrado = await knex('cliente').insert(novoCliente).returning('*');

		if (clienteCadastrado.length === 0)
			return res.status(400).json('Não foi possível realizar o cadastro do cliente.');

		if (requisicaoCliente.imagemCliente) {
			const caminhoImagem = 'clientes/' + clienteCadastrado[0].id + '.jpg';
			const uploadImage = uploadImagem(requisicaoCliente.imasgemCliente, caminhoImagem);

			if (uploadImage.length === 0)
				return res.status(400).json(uploadImage);

			const urlImagem = await pegarUrlImagem(caminhoImagem);
			const urlCadastrada = await knex('cliente').where({ id: clienteCadastrado[0].id }).update({ img_cliente: urlImagem });

			if (urlCadastrada.length === 0)
				return res.status(400).json('Não foi possível realizar o cadastro da imagem do cliente.');
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
		let urlImagem;
		let novaSenha;
		const { id } = jwt.verify(authorization, process.env.SENHA_JWT);

		await schema.editarCliente.validate(req.body)

		const clienteBD = await knex('cliente').where({ id });

		if (requisicaoCliente.senha) {
			const validarSenha = await bcrypt.compare(requisicaoCliente.senha, clienteBD[0].senha);

			if (!validarSenha)
				novaSenha = await bcrypt.hash(requisicaoCliente.senha, 10);
		}

		if (requisicaoCliente.imagemCliente) {
			const caminhoImagem = 'clientes/' + id.toString() + '.jpg';
			const uploadImage = atualizarImagem(requisicaoCliente.imagemCliente, caminhoImagem);

			if (uploadImage.length === 0)
				return res.status(400).json(uploadImage);

			urlImagem = await pegarUrlImagem(caminhoImagem);
		}

		const atualizarCliente =
		{
			nome: requisicaoCliente.nome,
			email: requisicaoCliente.email,
			senha: novaSenha,
			img_cliente: urlImagem
		}

		if (Object.keys(atualizarCliente).length === 0)
			return res.status(400).json('É necessário adcionar alguma informação para atualizar');

		const clienteAtualizado = await knex('cliente').where({ id }).update(atualizarCliente);

		if (clienteAtualizado.length === 0)
			return res.status(400).json('Erro na atualização do cliente.');

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