const span = document.querySelector('.titulo span')
const tipo = new URLSearchParams(window.location.search).get('tipo')
const inputBilhete = document.querySelector('input#bilhete')
const inputTipo = document.querySelector('input#tipo')
const btn = document.querySelector('button.button')

btn.addEventListener('click', (e) => {
    e.preventDefault()

    inputBilhete.value === '' ? 
        (
            alert('ATENÇÃO!\n\nPreencha o número do bilhete...'),
            inputBilhete.focus()
        ) : gerarRecarga()
})

if (tipo === 'unico') {
    span.innerText = 'BILHETE ÚNICO'

} else if (tipo === 'duplo') {
    span.innerText = 'BILHETE DUPLO'

} else if (tipo === 'sete') {
    span.innerText = 'BILHETE 7 DIAS'

} else if (tipo === 'trinta') {
    span.innerText = 'BILHETE 30 DIAS'
}

inputTipo.value = span.innerText

console.log(inputTipo.value)

function gerarRecarga() {
    let url = "/recarga"

    const numBilhete = inputBilhete.value
    const tipoBilhete = inputTipo.value

    axios.post(url, {
        bilhete: numBilhete,
        tipo: tipoBilhete
    })
        .then((response) => {

            if (response.status === 204) {
                alert(`[BILHETES]\n\nO bilhete ${numBilhete} não está cadastrado!`)

                inputBilhete.value = ''

                return inputBilhete.focus()

            }

            return window.location.href = '/recargarealizada'
        })
        .catch((error) => {
            console.log(error)
        })

}