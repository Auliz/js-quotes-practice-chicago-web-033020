const quoteC = document.querySelector('#quote-list')
const quoteAPI = 'http:/localhost:3000/quotes'

function main(){
  getQuotes()
  handleFormClick()
  handleQuoteClick()
}



function handleQuoteClick(){
  quoteC.addEventListener('click', function(event){
    if(event.target.className === 'btn-danger'){
      delQuote(event)
    } else if(event.target.className === 'btn-success'){
      likeQuote(event)
    }
  })
}

function likeQuote(event){
  const qId = parseInt(event.target.parentNode.dataset.id)

  const objReq = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteId: qId,
      createdAt: Date.now()
    })
  }
  fetch('http:localhost:3000/likes', objReq)
  .then(resp => resp.json())
  .then(newLike => {
    quoteC.innerHTML = ''
    getQuotes()
  })
}

function delQuote(event){
  const qId = event.target.parentNode.dataset.id
  const objReq = {
    method: 'DELETE'
  }

  fetch(`${quoteAPI}/${qId}`, objReq)
  .then(resp => resp.json())
  .then(data => {
    quoteC.innerHTML = ''
    getQuotes()
  })
}


function handleFormClick(){
  const form = document.querySelector('form')
  form.addEventListener('submit', function(event){
    event.preventDefault()
    const formQuote = {
      quote: event.target.quote.value,
      author: event.target.author.value
    }
    form.reset()
    formPost(formQuote)
  })
}

function formPost(quote){
  const objReq = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quote)
  }
  fetch(quoteAPI, objReq)
  .then(resp => resp.json())
  .then(newQuote => {
    renderOneQuote(newQuote)
  })
}

function getQuotes(){
  fetch('http://localhost:3000/quotes?_embed=likes')
  .then(resp => resp.json())
  .then(quotes => {
    renderAllQuotes(quotes)
  })
}

function renderAllQuotes(quotes){
  quotes.forEach(quote => renderOneQuote(quote))
}

function renderOneQuote(quote){
  quoteC.innerHTML += `
  <li class='quote-card'>
    <blockquote data-id=${quote.id} class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
}

main()