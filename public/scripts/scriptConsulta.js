const btn = document.querySelector('form button.button')
const btnModal = document.querySelector('button.btn_modal')
const inputBilhete = document.querySelector('input#bilhete')
const modalContainer = document.querySelector('.modal-container')
const exibeNumBilhete = document.querySelector('.modal h3')
const exibeDataBilhete = document.querySelector('.modal p.data-bilhete')
const modalRecargas = document.querySelector('.modal .recargas')

btn.addEventListener('click', (e) => {
    e.preventDefault()

    inputBilhete.value === '' ? 
        (
            alert('ATENÇÃO!\n\nPreencha o número do bilhete...'),
            inputBilhete.focus()
        ) : exibeRelatorio()
})

btnModal.addEventListener('click', () => {
    modalContainer.classList.remove('mostrar')
})

function exibeRelatorio() {
    let url = "/relatorio"

    const numBilhete = inputBilhete.value

    axios.post(url, {
        bilhete: numBilhete
    })
        .then((response) => {
            if (response.status === 204) {
                alert(`[BILHETES]\n\nO bilhete ${numBilhete} não está cadastrado!`)

                inputBilhete.value = ''

                return inputBilhete.focus()
            }

            exibeNumBilhete.innerText = `Bilhete: ${response.data.dadosBilhete[0][0]}`
            exibeDataBilhete.innerText = `Data de geração: ${response.data.dadosBilhete[0][1]}`

            response.data.recargas.forEach((recarga) => {
                const idRecarga = recarga[1]

                const div = document.createElement("div");
                div.className = `rec${idRecarga}`

                const spanData = document.createElement('span')
                const spanTipo = document.createElement('span')

                spanData.innerText = recarga[0]
                spanTipo.innerText = recarga[2]

                div.appendChild(spanData)
                div.appendChild(spanTipo)

                modalRecargas.appendChild(div)

                response.data.iniciadas.forEach((iniciada) => {
                    if (iniciada[1] === idRecarga) {
                        const rec = modalRecargas.querySelector(`.rec${idRecarga}`)

                        const div = document.createElement('div')
                        div.className = ("iniciada")

                        const span = document.createElement('span')
                        span.innerText = recarga[0]
                        
                        div.appendChild(span)

                        rec.appendChild(div)

                        // alert(iniciada[0])
                    }
                })

            })

            return modalContainer.classList.add('mostrar')
            
        })
}