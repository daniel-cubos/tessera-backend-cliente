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

function tratarBase64(requisicao) {
	const separarInfoBase64 = requisicao.split(';');

	let infoBase64 = separarInfoBase64[1].split('');
	let infoExtensao = separarInfoBase64[0].split('');

	infoExtensao.splice(0, (infoExtensao.findIndex(x => x === '/') + 1));
	infoExtensao = infoExtensao.join('').trim();

	infoBase64.splice(0, (infoBase64.findIndex(x => x === ',') + 1));
	infoBase64 = infoBase64.join('').trim();

	return { infoExtensao, infoBase64 }
}

module.exports = { uploadImagem, atualizarImagem, pegarUrlImagem, tratarBase64 };