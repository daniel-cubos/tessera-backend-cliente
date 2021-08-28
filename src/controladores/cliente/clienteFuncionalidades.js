const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../../bancodedados/conexao');
const schema = require('../../validacao/clienteSchema');

const fazerLogin = async (req, res) => {
	const { email, senha } = req.body;

	try {
		await schema.loginCliente.validate(req.body);

		const cliente = await knex('cliente').where({ email }).first();
		const endereco = await knex('endereco').where({ cliente_id: cliente.id }).first();

		if (!cliente)
			return res.status(404).json('Usuario não encontrado');

		const validarSenha = await bcrypt.compare(senha, cliente.senha);

		if (!validarSenha)
			return res.status(404).json('Email e senha não conferem');

		const token = jwt.sign({ id: cliente.id }, process.env.SENHA_JWT, { expiresIn: '8h' });

		return res.status(200).json({ token, endereco });
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
		const produtos = await knex('produto').where({ restaurante_id, ativo });
		const restaurante = await knex('restaurante').where({ id: restaurante_id }).first();

		if (produtos.length === 0)
			return res.json('Desculpe, estamos sem produtos ativos');

		return res.status(200).json({ produtos, restaurante });
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
}

const detalharProdutoRestaurante = async (req, res) => {
	try {
		const { idRestaurante, idProduto } = req.params;

		const produtos = await knex('restaurante')
			.where({ restaurante_id: idRestaurante, ativo: true })
			.join('produto', 'restaurante.id', 'produto.restaurante_id')

		if (produtos.length === 0)
			return res.json('Desculpe, estamos em produtos ativos');

		const produtoDetalhado = produtos.find(item => item.id == idProduto)

		if (!produtoDetalhado)
			return res.json('Produto procurado não existe ou não está ativo');

		let info = {
			nome: produtoDetalhado.nome,
			preco: produtoDetalhado.preco,
			descricao: produtoDetalhado.descricao,
			permiteObservacoes: produtoDetalhado.permite_observacoes,
			imagem: produtoDetalhado.img_produto,
			valorMinimo: produtoDetalhado.valor_minimo_pedido,
			tempoEntrega: produtoDetalhado.tempo_entrega_minutos,
		}

		return res.status(200).json(info);
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

		const enderecoBD = await knex('endereco').where({ cliente_id });

		if (enderecoBD.length !== 0)
			return res.status(400).json('Cliente já possui um endereço cadastrado');

		const novoEndereco = {
			cliente_id,
			cep,
			endereco,
			complemento
		}

		const enderecoCadastrado = await knex('endereco').insert(novoEndereco).returning('*');

		if (enderecoCadastrado.length === 0)
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
		const endereco = await knex('endereco').where({ cliente_id }).first()

		if (!endereco)
			return res.status(404).json('Endereço não cadastrado, favor cadastrar o endereço');

		const cardapioRestaurante = await knex('produto').where({ restaurante_id: dadosPedido.idRestaurante, ativo: true })

		if (cardapioRestaurante.length === 0)
			return res.json("Requisição inválida, não existem produtos disponiveis pra compra neste restaurante");

		const verificarCarrinho = carrinho.every(item => {
			const verificaItem = cardapioRestaurante.find(prato => prato.id == item.idProduto);
			return verificaItem;
		});

		if (!verificarCarrinho)
			return res.json('Carrinho possui itens que não existem neste cardápio');

		const novoPedido = {
			cliente_id,
			restaurante_id: dadosPedido.idRestaurante,
			subtotal: dadosPedido.subtotal,
			taxa_entrega: dadosPedido.taxaEntrega,
			total_pedido: dadosPedido.totalPedido,
			enviado_entrega: dadosPedido.enviadoEntrega,
		}

		const pedidoCadastrado = await knex('pedido').insert(novoPedido).returning('*');

		if (pedidoCadastrado.length === 0)
			return res.status(400).json('Não foi possível realizar o cadastro do pedido.');

		const { id: pedido_id } = pedidoCadastrado[0];

		const produtosNoCarrinho = [];
		carrinho.map(item => produtosNoCarrinho.push({ pedido_id, produto_id: item.idProduto, quantidade_itens: item.quantidade }));

		const carrinhoCadastrado = await knex('itens_pedido').insert(produtosNoCarrinho).returning('*');

		if (carrinhoCadastrado.length === 0)
			return res.status(400).json('Não foi possível realizar o cadastro os itens do carrinho.');

		return res.json("Pedido Finalizado com sucesso!")
	}
	catch (error) {
		return res.status(400).json(error.message);
	}
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