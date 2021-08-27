const express = require('express');
const filtroLogin = require('./filtros/filtroLogin');

const crudCliente = require('./controladores/cliente/clienteCrud');
const funcionalidadeCliente = require('./controladores/cliente/clienteFuncionalidades');

const router = express();

router.post('/login', funcionalidadeCliente.fazerLogin);
router.post('/cliente', crudCliente.cadastrarCliente);
router.put('/cliente', filtroLogin, crudCliente.editarCliente);
router.get('/restaurante', filtroLogin, funcionalidadeCliente.listarRestaurantes);
router.get('/detalhespedido', filtroLogin, funcionalidadeCliente.detalhesDoPedido);
router.get('/restaurante/:id', filtroLogin, funcionalidadeCliente.mostrarCardapio);
router.get('/restaurante/:idRestaurante/:idProduto', filtroLogin, funcionalidadeCliente.detalharProdutoRestaurante);
router.post('/fecharpedido', filtroLogin, funcionalidadeCliente.fecharPedido);
router.post('/adicionarendereco', filtroLogin, funcionalidadeCliente.adcionarEndereco);

module.exports = router;