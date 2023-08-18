const btn = document.querySelector('form#form_1 button')
const terms = document.querySelector('input.terms')

btn.addEventListener('click', (e) => {
    e.preventDefault()

    !terms.checked ?

        alert('ATENÇÃO!\n\nVocê precisa aceitar as regras de uso antes de continuar.')

        : gerarBilhete()
})

function gerarBilhete() {

    let url = "/bilhete"

    axios.post(url)
        .then((response) => {

            if (response.status === 201) {
                const cod = response.data.codigo

                return window.location.href = `/gerado?bilhete=${cod}`
            }

            return alert('[BILHETE]\n\nO número gerado já foi cadastrado, gere novamente!')

        })

}