const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Knex } = require('knex');
const knex = require('../../bancodedados/conexao');
const schema = require('../../validacao/clienteSchema');

const fazerLogin = async (req, res) => {
	const { email, senha } = req.body;

	try {
		await schema.loginCliente.validate(req.body);

		const cliente = await knex('cliente').where({ email }).first();

		if (!cliente)
			return res.status(404).json('Usuario não encontrado');

		const validarSenha = await bcrypt.compare(senha, cliente.senha);

		if (!validarSenha)
			return res.status(404).json('Email e senha não conferem');

		const token = jwt.sign({ id: cliente.id }, process.env.SENHA_JWT, { expiresIn: '8h' });

		return res.status(200).json({ token });
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

const listarRestaurantes = async (req, res) => {
	try {
		const restaurante = await knex('restaurante');

		if (restaurante.length === 0)
			return res.status(404).json("Desculpa, não há restaurantes cadastrados em sua região...");

		return res.status(200).json(restaurante);
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

const mostrarCardapio = async (req, res) => {
	const ativo = true;
	const { id: restaurante_id } = req.params;

	try {
		const produto = await knex('produto').where({ restaurante_id, ativo });

		if (produto.length === 0)
			return res.json('Desculpe, estamos sem produtos ativos');

		return res.status(200).json(produto);
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

const detalharProdutoRestaurante = async (req, res) => {
	try {
		const { idRestaurante, idProduto } = req.params;

		const produto = await knex('produto').where({ id: idProduto, restaurante_id: idRestaurante, ativo: true }).first();
		const restaurante = await knex('restaurante').where({ id: idRestaurante }).first();

		const { restaurante_id, ativo, ...infoProduto } = produto;
		const { usuario_id, ...infoRestaurante } = restaurante;

		if (produto.length === 0)
			return res.json('Desculpe, estamos em produtos ativos');

		return res.status(200).json({ infoProduto, infoRestaurante });
	} catch (error) {
		return res.status(400).json(error.message);
	}
}

const adcionarEndereco = async (req, res) => {
	const { authorization } = req.headers;
	const { cep, endereco, complemento } = req.body;

	try {
		await schema.verificarCEP.validate(req.body);

		const { id: cliente_id } = jwt.verify(authorization, process.env.SENHA_JWT);

		const novoEndereco = {
			cliente_id,
			cep,
			endereco,
			complemento
		}

		const enderecoCadastrado = await knex('endereco').insert(novoEndereco).returning('*');

		if (!enderecoCadastrado)
			return res.status(400).json('Não foi possível realizar o cadastro do endereço.');

		return res.status(200).json("Endereco cadastrado com sucesso");
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

const fecharPedido = async (req, res) => {
	const { authorization } = req.headers;
	const { carrinho, ...dadosPedido } = req.body;

	try {
		for (let item of carrinho)
			await schema.verificarCarrinho.validate(item);
		await schema.verificarPedido.validate(dadosPedido);

		const { id: cliente_id } = jwt.verify(authorization, process.env.SENHA_JWT);

		const novoPedido = {
			cliente_id,
			restaurante_id: dadosPedido.idRestaurante,
			subtotal: dadosPedido.subtotal,
			taxa_entrega: dadosPedido.taxaEntrega,
			total_pedido: dadosPedido.totalPedido,
		}

		const pedidoCadastrado = await knex('pedido').insert(novoPedido).returning('*');

		if (!pedidoCadastrado)
			return res.status(400).json('Não foi possível realizar o cadastro do pedido.');

		const { id: pedido_id } = pedidoCadastrado[0];

		const produtosNoCarrinho = [];

		for (let item of carrinho) {
			let itemPedido = {
				pedido_id,
				produto_id: item.idProduto,
				quantidade_itens: item.quantidade
			}
			produtosNoCarrinho.push(itemPedido);
		}

		const carrinhoCadastrado = await knex('itens_pedido').insert(produtosNoCarrinho).returning('*');

		if (!carrinhoCadastrado)
			return res.status(400).json('Não foi possível realizar o cadastro os itens do carrinho.');

		return res.json("Pedido Finalizado com sucesso!")
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

const listarPedidos = async (req, res) => {

}


module.exports =
{
	fazerLogin,
	listarRestaurantes,
	mostrarCardapio,
	detalharProdutoRestaurante,
	adcionarEndereco,
	fecharPedido
}