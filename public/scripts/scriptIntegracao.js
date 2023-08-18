// function gerarBilhete() {

//     let objetobilhete = {
//         codigo: 0,
//         datagerado: ""
//     }

//     let url = "/bilhete"

//     axios.post(url, objetobilhete)

    // let cod = res.data

    // return res.send(201)

    // return res.render("gerado", { cod })
        // .then((response) => console.log(response.data.codigo))
        // .catch((err) => {
        //     console.error("ops! ocorreu um erro" + err);
        // });


    // let data = res.data.code.codigo

    // console.log("Axios response: " + data)
    // alert("Axios responde: " + data)

    // let res = axios.post(url, objetobilhete)
    // .then(response => {
    //     if (response.data) {
    //         const msg = new Comunicado (response.data.codigo, 
    //                                     response.data.mensagem);
    //         alert(msg.get());
    //     }
    // })
    // .catch(error  =>  {

    //     if (error.response) {
    //         const msg = new Comunicado (error.response.data.codigo, 
    //                                     error.response.data.mensagem, 
    //                                     error.response.data.descricao);
    //         alert(msg.get());
    //         console.log(error)
    //     }
    // })
// }

// function mostraDados (dados, msg) {
//     document.getElementById('codigo')     .innerHTML = `Código		    : ${dados.codigo}`
//     document.getElementById('tipo')       .innerHTML = `Tipo	   	 	: ${dados.tipo}`
//     document.getElementById('data_geracao').innerHTML =`Data de Geração:  ${dados.data_geracao}`

//     document.getElementById('codigo')     .className = ''
//     document.getElementById('tipo')      .className = ''
//     document.getElementById('data_geracao').className = ''
//     document.getElementById('mensagem')   .className = 'oculto'
// }

function Comunicado(codigo, mensagem) {
    this.codigo = codigo;
    this.mensagem = mensagem;

    this.get = function () {
        return (this.codigo + " \n " +
            this.mensagem);

    }
}
