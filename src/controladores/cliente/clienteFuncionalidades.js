const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../../bancodedados/conexao');
const schema = require('../../validacao/clienteSchema');

const fazerLogin = async (req,res) =>
{
    const { email, senha } = req.body;

    try 
    {
        await schema.loginCliente.validate(req.body);

        const cliente = await knex('clientes').where({ email }).first();
        
        if(!cliente)
            return res.status(404).json('Usuario não encontrado');

        const validarSenha = await bcrypt.compare(senha, cliente.senha);

        if(!validarSenha)
            return res.status(404).json('Email e senha não conferem');
        
        const token = jwt.sign({ id: cliente.id }, process.env.SENHA_JWT, { expiresIn: '8h' });

        return res.status(200).json({ token });
    } 
    catch (error) 
    {
        return res.status(400).json(error.message);
    }
}

const buscarRestaurantes = async (req,res) =>
{

}

const verCardapioRestaurante = async (req,res) =>
{

}

const detalharProdutoRestaurante = async (req,res) =>
{

}

const adcionarEndereco = async (req,res) =>
{
    const {cep, endereco, complemento} = req.body
}

const fecharPedido = async (req,res) =>
{
    
}




module.exports = 
{
    fazerLogin
}