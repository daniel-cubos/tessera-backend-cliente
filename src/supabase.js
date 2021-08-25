const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function uploadImagem(imagemProduto, caminhoImagem) {
	const buffer = Buffer.from(imagemProduto, 'base64');

	const { error } = await supabase
		.storage
		.from(process.env.SUPABASE_BUCKET)
		.upload(caminhoImagem, buffer, { contentType: 'image/jpg' })

	if (error)
		return error.message;

	return false;
}

async function atualizarImagem(imagemProduto, caminhoImagem) {
	const buffer = Buffer.from(imagemProduto, 'base64');

	const { error: errorDelete } = await supabase
		.storage
		.from(process.env.SUPABASE_BUCKET)
		.remove([caminhoImagem])

	if (errorDelete)
		return errorDelete.message;

	const { error: errorInsert } = await supabase
		.storage
		.from(process.env.SUPABASE_BUCKET)
		.upload(caminhoImagem, buffer, { contentType: 'image/jpg' })

	if (errorInsert)
		return errorInsert.message;

	return false;
}

async function pegarUrlImagem(caminhoImagem) {
	const { publicURL, error } = await supabase
		.storage
		.from(process.env.SUPABASE_BUCKET)
		.getPublicUrl(caminhoImagem)

	if (error)
		return error.message;

	return publicURL;
}
module.exports = { uploadImagem, atualizarImagem, pegarUrlImagem };