const btns = document.querySelectorAll(".btns a")
const modalContainer = document.querySelector('.modal-container')
const titulo = modalContainer.querySelector('h3')
const texto = modalContainer.querySelector('h4')

let tipoBilhete = ''

btns.forEach((tipo) => {
    tipo.addEventListener('click', (e) => {
        const tipo = e.target.className
        tipoBilhete = tipo

        if(tipo === 'unico') {
            titulo.innerText = data.unico.titulo
            texto.innerText = data.unico.texto
        } else if (tipo ==='duplo') {
            titulo.innerText = data.duplo.titulo
            texto.innerText = data.duplo.texto
        } else if (tipo === 'sete') {
            titulo.innerText = data.sete.titulo
            texto.innerText = data.sete.texto
        } else {
            titulo.innerText = data.trinta.titulo
            texto.innerText = data.trinta.texto
        }

        modalContainer.classList.add('mostrar')

    })
})

const btnFechar = modalContainer.querySelector('.fechar')

btnFechar.addEventListener('click', () => {
    modalContainer.classList.remove('mostrar')

})

function abreInserirRecarga() {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('tipo', tipoBilhete)

    window.location.href = `/inserir?${urlParams.toString()}`
}

const data = {
    unico: {
        titulo: 'BILHETE ÚNICO',
        texto: 'O bilhete único lhe que dará o direito de utilizar o mesmo  bilhete  em quantos  transportes  quiser, por um  período  de  40  minutos.\n\nVALOR: R$3,00'
    },
    duplo: {
        titulo: 'BILHETE DUPLO',
        texto: 'Para  cada  período  de  utilização do Bilhete duplo você poderá utilizar o mesmo bilhete em quantos transportes quiser, por um período de 40 minutos.\n\nVALOR: R$6,00'
    },
    sete: {
        titulo: 'BILHETE 7 DIAS',
        texto: 'O bilhete 7 dias lhe que dará o direito de utilizar o transporte público quantas vezes quiser durante o período de 7 dias, contados a partir da primeira utilização do bilhete.\n\nVALOR: R$21,00'
    },
    trinta: {
        titulo: 'BILHETE 30 DIAS',
        texto: 'O bilhete 30 dias lhe que dará o direito de utilizar o transporte público quantas vezes quiser durante o período de 30 dias, contados apartir da primeira utilização do bilhete.\n\nVALOR: R$90,00'
    }
}