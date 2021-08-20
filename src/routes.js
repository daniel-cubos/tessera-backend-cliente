const express = require('express');
const filtroLogin = require('./filtros/filtroLogin');

const crudCliente = require('./controladores/cliente/clienteCrud');
const funcionalidadeCliente = require('./controladores/cliente/clienteFuncionalidades');

const router = express();

router.post('/login', funcionalidadeCliente.fazerLogin);
router.post('/clientes', crudCliente.cadastrarCliente);

router.get('/produtos',filtroLogin, funcionalidadeCliente.buscarRestaurantes);
router.get('/produtos/:id',filtroLogin, funcionalidadeCliente.verCardapioRestaurante);
router.put('/produtos/:id',filtroLogin, funcionalidadeCliente.detalharProdutoRestaurante);
router.post('/produtos',filtroLogin, funcionalidadeCliente.adcionarEndereco);
router.post('/produtos/:id',filtroLogin, funcionalidadeCliente.fecharPedido);

module.exports = router;