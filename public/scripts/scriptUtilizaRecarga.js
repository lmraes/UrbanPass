const btn = document.querySelector('.button button')
const inputBilhete = document.querySelector('input#bilhete')
const modalContainer = document.querySelector('.modal-container')
const btnModal = document.querySelector('.modal .button')
const exibeTipo = document.querySelector('.modal h3')
const exibeDetalhesTipo = document.querySelector('.modal h4')
const exibeLimitTime = document.querySelector('.modal span.time')
const exibeBilheteDuplo = document.querySelector('.modal span.bilheteDuplo')

btn.addEventListener('click', (e) => {
    e.preventDefault()

    inputBilhete.value === '' ? 
        (
            alert('ATENÇÃO!\n\nPreencha o número do bilhete...'),
            inputBilhete.focus()
        ) : utilizaRecarga()
})

btnModal.addEventListener('click', () => {
    modalContainer.classList.remove('mostrar')
})

inputBilhete.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        
        inputBilhete.value === '' ? 
        (
            alert('ATENÇÃO!\n\nPreencha o número do bilhete...'),
            inputBilhete.focus()
        ) : utilizaRecarga()
    }
})

function utilizaRecarga() {
    let url = "/utilizar"

    const numBilhete = inputBilhete.value

    axios.post(url, {
        bilhete: numBilhete,
    })
        .then((response) => {

            if (response.status === 200 && response.data.motivo === 1) {
                alert(`[BILHETE]\n\nO bilhete ${numBilhete} não está cadastrado.`)

                inputBilhete.value = ''

                return inputBilhete.focus()
            } else if (response.status === 200 && response.data.motivo === 2) {
                alert(`[RECARGA]\n\nNão há recarga disponível para o bilhete ${numBilhete}.\nDirija-se a um terminal para recarga.`)
                inputBilhete.value = ''

                return inputBilhete.focus()
            }

            const tipoBilhete = response.data.recargaIniciada.tipo

            exibeTipo.innerText = tipoBilhete

            if (tipoBilhete === 'BILHETE ÚNICO') {
                exibeDetalhesTipo.innerText = data.unico.texto
            } else if (tipoBilhete === 'BILHETE DUPLO') {
                exibeDetalhesTipo.innerText = data.duplo.texto
            } else if (tipoBilhete === 'BILHETE 7 DIAS') {
                exibeDetalhesTipo.innerText = data.sete.texto
            } else if (tipoBilhete === 'BILHETE 30 DIAS') {
                exibeDetalhesTipo.innerText = data.trinta.texto
            }

            function calculaDias() {
                const datainicio = new Date();
                const datalimite = new Date(response.data.recargaIniciada.datalimite);
                const diferenca = new Date(datalimite - datainicio);

                let resultado = diferenca.getUTCDate() - 1 + 'd '
                resultado += diferenca.getUTCHours() + 'h '
                resultado += diferenca.getUTCMinutes() + 'm '
                resultado += `${diferenca.getUTCSeconds()}`.padStart(2, 0) + 's '
                
                return exibeLimitTime.innerText = `Tempo restante para utilização da recarga:\n ${resultado}`
                
            }

            function calculaMinutos() {
                const datainicio = new Date();
                const datalimite = new Date(response.data.recargaIniciada.datalimite);
                const diferenca = new Date(datalimite - datainicio);

                let resultado = diferenca.getUTCMinutes() + 'm '
                resultado += `${diferenca.getUTCSeconds()}`.padStart(2, 0) + 's '
                
                return exibeLimitTime.innerText = `Tempo restante para utilização da recarga:\n ${resultado}`
                
            }

            if (tipoBilhete === 'BILHETE 7 DIAS' || tipoBilhete=== 'BILHETE 30 DIAS') {
                setInterval(calculaDias, 1000)

            } else {
                setInterval(calculaMinutos, 1000);
            }

            if (tipoBilhete === 'BILHETE DUPLO') {
                const qtd = response.data.recargaIniciada.qtdBilheteDuplo

                if (qtd % 2 === 0) {
                    exibeBilheteDuplo.innerText = 'Você já está ulizando a segunda recarga.'
                } else {
                    exibeBilheteDuplo.innerText = 'Você ainda tem uma recarga de crédito para usar.'
                }
            }
            
            return modalContainer.classList.add('mostrar')
        })
        .catch((error) => {
            console.log(error)
        })

}

const data = {
    unico: {
        texto: 'O bilhete único lhe que dará o direito de utilizar o mesmo  bilhete  em quantos  transportes  quiser, por um  período  de  40  minutos.'
    },
    duplo: {
        texto: 'Para  cada  período  de  utilização do Bilhete duplo você poderá utilizar o mesmo bilhete em quantos transportes quiser, por um período de 40 minutos.'
    },
    sete: {
        texto: 'O bilhete 7 dias lhe que dará o direito de utilizar o transporte público quantas vezes quiser durante o período de 7 dias, contados a partir da primeira utilização do bilhete.'
    },
    trinta: {
        texto: 'O bilhete 30 dias lhe que dará o direito de utilizar o transporte público quantas vezes quiser durante o período de 30 dias, contados apartir da primeira utilização do bilhete.'
    }
}