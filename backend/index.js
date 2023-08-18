function BD() {
	process.env.ORA_SDTZ = 'UTC-3'; // garante horário de Brasília

	this.getConexao = async function () {
		if (global.conexao)
			return global.conexao;

		const oracledb = require('oracledb');
		const dbConfig = require('./dbconfig');

		try {
			global.conexao = await oracledb.getConnection({
				user: "ADMIN",
				password: "PIpasseurbano12",
				connectString: "projetointegrador_high"
			});
			console.log('Conexão bem sucedida');
		}
		catch (erro) {
			console.log('Não foi possível estabelecer conexão com o BD!');
			process.exit(1);
		}

		return global.conexao;
	}

	this.estrutureSe = async function () {
		try {
			const conexao = await this.getConexao();
			const sqlseq = `
			CREATE SEQUENCE RECARGAS_SEQ
			MINVALUE 1
			START WITH 1
			INCREMENT BY 1
			NOCACHE
 			NOCYCLE`

			await conexao.execute(sqlseq);
		}
		catch (erro) { } // se a já existe, ignora e toca em frente

		try {
			const conexao = await this.getConexao();
			const sql = 'CREATE TABLE BILHETE (CODIGO INTEGER PRIMARY KEY, ' +
				'DATAGERADO DATE NOT NULL)';

			await conexao.execute(sql);
		}
		catch (erro) { } // se a já existe, ignora e toca em frente

		try {
			const conexao = await this.getConexao();
			const sql2 = 'CREATE TABLE RECARGA (CODIGO INTEGER, ' + 'TIPO VARCHAR2(20) NOT NULL, ' +
				'DATAGERADO DATE NOT NULL, ' + 'ID INTEGER NOT NULL PRIMARY KEY, ' + 'IS_USED NUMBER(1))';

			await conexao.execute(sql2);
		}
		catch (erro) { } // se a já existe, ignora e toca em frente

		try {
			const conexao = await this.getConexao();
			const sqlr = 'CREATE TABLE RECARGASINICIADAS (CODIGO INTEGER, ' + ' IDRECARGA INTEGER NOT NULL, ' + 'TIPO VARCHAR2(20) NOT NULL, ' +
				'DATAINICIO DATE NOT NULL, ' + 'DATALIMITE DATE NOT NULL)';

			await conexao.execute(sqlr);
		}
		catch (erro) { } // se a já existe, ignora e toca em frente
	}
}

function Bilhetes(bd) {
	this.bd = bd;

	this.inclua = async function (bilhete) {
		const conexao = await this.bd.getConexao();

		const sql1 = "INSERT INTO BILHETE (CODIGO, DATAGERADO) VALUES (:0,current_date)";
		const dados = [bilhete.codigo];

		console.log(sql1, dados);

		await conexao.execute(sql1, dados);

		const sql2 = 'COMMIT';
		await conexao.execute(sql2);

		const sql = "SELECT CODIGO,TO_CHAR(DATAGERADO, 'YYYY-MM-DD HH24:MI:SS') " +
			"FROM BILHETE WHERE CODIGO=:0";
		const dadosb = [bilhete.codigo];

		ret = await conexao.execute(sql, dadosb);

		console.log(ret.rows);

		return ret.rows;
	}

}

function Recargas(bd) {
	this.bd = bd;

	this.inclua = async function (recarga) {
		const conexao = await this.bd.getConexao();

		const sql3 = "INSERT INTO RECARGA (CODIGO, TIPO, DATAGERADO, ID, IS_USED) VALUES (:0,:1,current_date,RECARGAS_SEQ.NEXTVAL, 0)";
		const dados = [recarga.codigo, recarga.tipo];

		console.log(sql3, dados);

		await conexao.execute(sql3, dados);

		const sql4 = 'COMMIT';
		await conexao.execute(sql4);
	}

}

function RecargasIniciadas(bd) {
	this.bd = bd;

	this.inclua = async function (recargainiciada) {
		const conexao = await this.bd.getConexao();

		const sqlru = "INSERT INTO RECARGASINICIADAS (CODIGO, IDRECARGA, TIPO, DATALIMITE, DATAINICIO) VALUES (:0,:1,:2,:3,current_date)";
		const dados = [recargainiciada.codigo, recargainiciada.idrecarga, recargainiciada.tipo, recargainiciada.datalimite];

		console.log(sqlru, dados);

		await conexao.execute(sqlru, dados);

		const sqlru2 = 'COMMIT';
		await conexao.execute(sqlru2);
	}

}

function VerificaBilhete(bd) {
	this.bd = bd

	this.verifica = async function (codigo) {
		const conexao = await this.bd.getConexao();

		const sqlv = "SELECT CODIGO, to_char(datagerado, 'DD/MM/YYYY HH24:MI:SS') FROM BILHETE WHERE CODIGO=:0";
		const codigoBilhete = [codigo];

		const result = await conexao.execute(sqlv, codigoBilhete);

		const data = result.rows

		return data

	}

}

function VerificaRecarga(bd) {
	this.bd = bd

	this.verifica = async function (codigo) {
		const conexao = await this.bd.getConexao();

		const sqlvr = `
		SELECT
		id,
		codigo,
		tipo,
		datagerado
		FROM
			recarga
		WHERE 
			codigo = :0 AND is_used = 0
		ORDER BY
			datagerado`

		const codigoBilhete = [codigo];

		const result = await conexao.execute(sqlvr, codigoBilhete);

		const data = result.rows

		return data[0]

	}

}

function VerificaBilheteDuplo(bd) {
	this.bd = bd

	this.verifica = async function (codigo) {
		const conexao = await this.bd.getConexao();

		const sqlvr = `
		SELECT
		id,
		codigo,
		tipo,
		datagerado
		FROM
			recarga
		WHERE 
			codigo = :0 AND tipo = 'BILHETE DUPLO' AND is_used = 0
		ORDER BY
			datagerado`

		const codigoBilhete = [codigo];

		const result = await conexao.execute(sqlvr, codigoBilhete);

		const data = result.rows

		return data

	}

}

function VerificaRecargasIniciadas(bd) {
	this.bd = bd

	this.verifica = async function (codigo, dataAtual) {
		const conexao = await this.bd.getConexao();

		const sqlvri = `
		SELECT
		codigo,
		tipo,
		datainicio,
		datalimite
		FROM
			recargasiniciadas
		WHERE 
			codigo = :0 AND datalimite > :1
		ORDER BY
			datalimite`

		const dadosBilhete = [codigo, dataAtual];

		const result = await conexao.execute(sqlvri, dadosBilhete);

		const data = result.rows

		return data[0]

	}

}

function VerificaTodasRecargasIniciadas(bd) {
	this.bd = bd

	this.verifica = async function (codigo) {
		const conexao = await this.bd.getConexao();

		const sqlvrit = `
		SELECT
		to_char(datainicio, 'DD/MM/YYYY HH24:MI:SS') AS data_inicio,
		idrecarga
		FROM
			recargasiniciadas
		WHERE 
			codigo = :0
		ORDER BY
			datainicio`

		const dadosBilhete = [codigo];

		const result = await conexao.execute(sqlvrit, dadosBilhete);

		const data = result.rows

		return data

	}

}

function ExcluirRecarga(bd) {
	this.bd = bd

	this.excluir = async function (id) {
		const conexao = await this.bd.getConexao();

		const sqlexc = "UPDATE RECARGA SET IS_USED = 1 WHERE ID=:0";
		const idBilhete = [id];

		await conexao.execute(sqlexc, idBilhete);

		const sqlexc2 = 'COMMIT';
		await conexao.execute(sqlexc2);

	}

}

function ExibeRelatorio(bd) {
	this.bd = bd

	this.verifica = async function (codigo) {
		const conexao = await this.bd.getConexao();

		const sqlvrel = `
		SELECT
			to_char(r.datagerado, 'DD/MM/YYYY HH24:MI:SS'),
			r.id,
			r.tipo
		FROM
			bilhete b, recarga r
		WHERE 
			b.codigo = :0 AND r.codigo = :0
		ORDER BY r.datagerado`

		const dadosBilhete = [codigo];

		const result = await conexao.execute(sqlvrel, dadosBilhete);

		const data = result.rows

		return data

	}

}

function Bilhete(codigo, datagerado) {
	this.codigo = codigo;
	this.datagerado = datagerado;
}

function Recarga(codigo, tipo, datagerado, id, is_used) {
	this.codigo = codigo;
	this.tipo = tipo
	this.datagerado = datagerado;
	this.id = id;
	this.is_used = is_used;
}

function RecargaIniciada(codigo, idrecarga, tipo, datalimite, datainicio) {
	this.codigo = codigo;
	this.idrecarga = idrecarga;
	this.tipo = tipo;
	this.datalimite = datalimite;
	this.datainicio = datainicio;
}

function Comunicado(codigo, mensagem) {
	this.codigo = codigo;
	this.mensagem = mensagem;
}

function middleWareGlobal(req, res, next) {
	console.time('Requisição'); // marca o início da requisição
	console.log('Método: ' + req.method + '; URL: ' + req.url); // retorna qual o método e url foi chamada

	next(); // função que chama as próximas ações

	console.log('Finalizou'); // será chamado após a requisição ser concluída

	console.timeEnd('Requisição'); // marca o fim da requisição
}

// para a rota de CREATE
async function inclusaoBilhete(req, res) {
	const codigo = Math.floor(100000 + Math.random() * 900000);

	const dados = await global.verificaBilhete.verifica(codigo)
	const n = dados.length

	if (n > 0) {
		return res.status(200).send()
	}

	const tipo = 'BILHETE ÚNICO'

	const bilhete = new Bilhete(codigo);

	const recarga = new Recarga(codigo, tipo)

	try {
		await global.bilhetes.inclua(bilhete);

		await global.recargas.inclua(recarga);

		return res.status(201).send({ codigo })
	}
	catch (erro) {
		console.log('ERRO');
		return res.status(409).json(erro);
	}
}

async function inclusaoRecarga(req, res) {
	const { bilhete } = req.body
	const { tipo } = req.body

	const dados = await global.verificaBilhete.verifica(bilhete)
	const n = dados.length

	if (n < 1) {
		return res.status(204).send()
	}

	const recarga = new Recarga(bilhete, tipo)

	try {
		if (tipo === 'BILHETE DUPLO') {
			await global.recargas.inclua(recarga);
			await global.recargas.inclua(recarga);

		} else {
			await global.recargas.inclua(recarga);
		}

		return res.status(201).send()
	}
	catch (erro) {
		console.log('ERRO');

		return res.status(409).json(erro);
	}
}

async function utilizaRecarga(req, res) {
	const formatDate = require('date-fns')
	const ptBR = require('date-fns/locale/pt-BR')

	const { bilhete } = req.body

	console.log('Bilhete ========> ' + bilhete)

	const bilheteRecarga = await global.verificaBilhete.verifica(bilhete)
	const n = bilheteRecarga.length

	if (n < 1) {
		return res.status(200).send({
			'motivo': 1
		})
	}

	const recargasiniciadas = await global.verificaRecargasIniciadas.verifica(bilhete, new Date())

	let dadosBilheteDuplo = await global.verificaBilheteDuplo.verifica(bilhete)
	let qtdBilheteDuplo = dadosBilheteDuplo.length

	if (recargasiniciadas) {
		const recargaIniciada = {
			id: recargasiniciadas[0],
			tipo: recargasiniciadas[1],
			datainicio: recargasiniciadas[2],
			datalimite: recargasiniciadas[3],
			qtdBilheteDuplo
		}

		return res.status(200).send({ recargaIniciada })
	}
	
	const recarga = await global.verificaRecarga.verifica(bilhete)

	if (!recarga) {
		return res.status(200).send({
			'motivo': 2
		})
	}

	const id = recarga[0]

	const tipo = recarga[2]

	const data = new Date()
	let limitdate

	if (tipo === 'BILHETE ÚNICO') {
		limitdate = data.setMinutes(data.getMinutes() + 40)

	} else if (tipo === 'BILHETE DUPLO') {
		limitdate = data.setMinutes(data.getMinutes() + 40)
	} else if (tipo === 'BILHETE 7 DIAS') {
		limitdate = data.setDate(data.getDate() + 7)
	} else if (tipo === 'BILHETE 30 DIAS') {
		limitdate = data.setDate(data.getDate() + 30)
	}

	limitdate = new Date(limitdate)

	const utilizarecarga = new RecargaIniciada(bilhete, id, tipo, limitdate)

	if (!recargasiniciadas) {
		try {
			await global.recargasiniciadas.inclua(utilizarecarga);

			await global.excluirecarga.excluir(id)

			dadosBilheteDuplo = await global.verificaBilheteDuplo.verifica(bilhete)
			qtdBilheteDuplo = dadosBilheteDuplo.length

			const recargasiniciadas = await global.verificaRecargasIniciadas.verifica(bilhete, new Date())

			const recargaIniciada = {
				id: recargasiniciadas[0],
				tipo: recargasiniciadas[1],
				datainicio: recargasiniciadas[2],
				datalimite: recargasiniciadas[3],
				qtdBilheteDuplo
			}
	
			return res.status(201).send({ recargaIniciada })
		}
		catch (erro) {
			console.log('ERRO');
	
			return res.status(409).json(erro);
		}

	}
	
	return res.status(200).send({ recargasiniciadas })
}

async function exibeRelatorio(req , res) {
	const { bilhete } = req.body

	const dadosBilhete = await global.verificaBilhete.verifica(bilhete)
	const n = dadosBilhete.length

	if (n < 1) {
		return res.status(204).send()
	}

	const recargas = await global.exibeRelatorio.verifica(bilhete)

	const iniciadas = await global.verificaTodasRecargasIniciadas.verifica(bilhete)

	return res.status(200).send({ dadosBilhete, recargas, iniciadas })

}

async function ativacaoDoServidor() {
	const bd = new BD();
	await bd.estrutureSe();
	global.bilhetes = new Bilhetes(bd);
	global.recargas = new Recargas(bd);
	global.recargasiniciadas = new RecargasIniciadas(bd)
	global.excluirecarga = new ExcluirRecarga(bd)

	global.verificaBilhete = new VerificaBilhete(bd)
	global.verificaRecarga = new VerificaRecarga(bd)
	global.verificaRecargasIniciadas = new VerificaRecargasIniciadas(bd)
	global.verificaTodasRecargasIniciadas = new VerificaTodasRecargasIniciadas(bd)
	global.verificaBilheteDuplo = new VerificaBilheteDuplo(bd)
	global.exibeRelatorio = new ExibeRelatorio(bd)

	const express = require('express');
	const app = express();
	const cors = require('cors')
	const path = require('path')

	app.use(express.urlencoded({ extended: true })) // para pegar os valores do req body
	app.use(express.json());   // faz com que o express consiga processar JSON
	app.use(cors()) //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
	app.use(middleWareGlobal); // app.use cria o middleware global

	app.use(express.static(path.join(__dirname, '../public')))

	app.post('/bilhete', inclusaoBilhete);
	app.post('/recarga', inclusaoRecarga);
	app.post('/utilizar', utilizaRecarga);
	app.post('/relatorio', exibeRelatorio)

	// app.get("/", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'index.html'))
	// })

	// app.get("/gerar", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'gerar.html'))
	// })

	// app.get("/gerado", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'gerado.html'))
	// })

	// app.get("/inserir", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'inserir.html'))
	// })

	// app.get("/recarga", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'recarga.html'))
	// })

	// app.get("/recargarealizada", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'recargarealizada.html'))
	// })

	// app.get("/utilizar", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'utilizar.html'))
	// })

	// app.get("/consultar", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'consultar.html'))
	// })

	// app.get("/historico", function (req, res) {
	// 	return res.sendFile(path.join(__dirname, '../views', 'historico.html'))
	// })
	
	app.listen(3000, function () {
		console.log('Servidor ativo na porta 3000...');
	});
}

ativacaoDoServidor();
