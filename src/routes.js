const express = require('express');
const filtroLogin = require('./filtros/filtroLogin');

const crudCliente = require('./controladores/cliente/clienteCrud');
const funcionalidadeCliente = require('./controladores/cliente/clienteFuncionalidades');

const router = express();

router.post('/login', funcionalidadeCliente.fazerLogin);
router.post('/cliente', crudCliente.cadastrarCliente);
router.put('/cliente', filtroLogin, crudCliente.editarCliente);

router.get('/restaurante', filtroLogin, funcionalidadeCliente.listarRestaurantes);
router.get('/restaurante/:id', filtroLogin, funcionalidadeCliente.mostrarCardapio);
router.get('/restaurante/:idRestaurante/:idProduto', filtroLogin, funcionalidadeCliente.detalharProdutoRestaurante);
router.post('/pedido/addendereco', filtroLogin, funcionalidadeCliente.adcionarEndereco);
router.post('/pedido/fecharpedido', filtroLogin, funcionalidadeCliente.fecharPedido);

module.exports = router;