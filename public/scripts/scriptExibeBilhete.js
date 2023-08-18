const bilhete = new URLSearchParams(window.location.search).get('bilhete')
const span = document.querySelector('.card-number span')

span.innerText = bilhete