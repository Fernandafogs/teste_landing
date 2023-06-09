
/*-----HOME-ABOUT & FORM-----*/

let form = document.querySelector('#formRegistration');

//Função para validar se todo os campos foram preenchidos no formulário
form.onsubmit = function(e) {
    e.preventDefault();

    let hasError = false;

    let inputName = document.forms['formRegistration']['nome'];
    let inputEmail = document.forms['formRegistration']['email'];
    let inputCpf = document.forms['formRegistration']['cpf'];
    let inputGender = document.forms['formRegistration']['genero'];

    if (!inputName.value) {
        hasError = true;
        inputName.classList.add('inputError');

        let span = inputName.nextSibling.nextSibling;
        span.innerText = 'Digite o nome corretamente';
    } else {
        inputName.classList.remove('inputError');

        let span = inputName.nextSibling.nextSibling;
        span.innerText = '';
    }

    if (!inputEmail.value) {
        hasError = true;
        inputEmail.classList.add('inputError');

        let span = inputEmail.nextSibling.nextSibling;
        span.innerText = 'Digite o e-mail corretamente';
    } else {
        inputEmail.classList.remove('inputError');

        let span = inputEmail.nextSibling.nextSibling;
        span.innerText = '';
    }

    if (!inputCpf.value) {
        hasError = true;
        inputCpf.classList.add('inputError');

        let span = inputCpf.nextSibling.nextSibling;
        span.innerText = 'Digite seu CPF corretamente';
    } else {
        inputCpf.classList.remove('inputError');

        let span = inputCpf.nextSibling.nextSibling;
        span.innerText = '';

    // Validar CPF utilizando a biblioteca cpf-cnpj-validator
    const cpf = inputCpf.value;
    if (!CPF.isValid(cpf)) {
        hasError = true;
        inputCpf.classList.add('inputError');
        span.innerText = 'CPF inválido';
    }
    }

    if (!inputGender.value) {
        hasError = true;
        inputGender.classList.add('inputError');
    
        let span = inputGender.parentNode.querySelector('.error');
        span.innerText = 'Selecione uma opção';
    } else {
        inputGender.classList.remove('inputError');
    
        let span = inputGender.parentNode.querySelector('.error');
        span.innerText = '';
    }
    
    if (!hasError) {
        form.submit();
    }
};


/*-----GALLERY-----*/

// Função para buscar os produtos da API
function fetchProducts(page) {
  const url = `https://frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      updateGallery(data);
      updateNextPageState(data);
    })
    .catch((error) => {
      console.log('Erro ao buscar os produtos:', error);
    });
}

// Função para atualizar o botão "Próxima Página"
function updateNextPageButton(data) {
  const nextPageButton = document.querySelector('.nextPage');
  nextPageButton.setAttribute('data-url', data.nextPage);
}

// Função para exibir uma mensagem quando não houver mais produtos
function displayNoMoreProductsMessage() {
  const messageContainer = document.querySelector('.message');
  messageContainer.textContent = 'Não há mais produtos para exibir.';
}

// Atualiza o estado do botão "Próxima Página" com base nos dados retornados pela API
function updateNextPageState(data) {
  if (data.nextPage) {
    const nextPageButton = document.querySelector('.nextPage');
    nextPageButton.style.display = 'block';
    updateNextPageButton(data);
  } else {
    displayNoMoreProductsMessage();
  }
}

// Atualiza a galeria com os produtos retornados pela API
function updateGallery(data) {
  const products = data.products;
  let productCards = '';

  products.forEach((product) => {
    const card = createProductCard(product);
    productCards += card;
  });

  const galleryWrapper = document.querySelector('.gallery-wrapper');
  galleryWrapper.insertAdjacentHTML('beforeend', productCards);
}

// Função para criar um card de produto com as informações fornecidas
function createProductCard(product) {
  return `
    <div class="product" data-id="${product.id}">
      <div class="image-product">
        <img src="${product.image}" class="image" alt="Galeria">
      </div>
      <div class="product-description">
        <p class="name">${product.name}</p>
        <p class="description">${product.description}</p>
        <p class="oldPrice">De: R$${product.oldPrice.toFixed(2)}</p>
        <p class="price">Por: R$${product.price.toFixed(2)}</p>
        <p class="installments">ou ${product.installments.count}x de R$${product.installments.value.toFixed(2)}</p>
        <button class="buy">Comprar</button>
      </div>
    </div>
  `;
}

// Variável para o botão "Ainda mais produtos aqui!"
const nextPageButton = document.querySelector('.nextPage');
nextPageButton.addEventListener('click', loadNextPage);

// Definindo a função loadNextPage que será chamada quando o botão "Ainda mais produtos aqui!" for clicado
function loadNextPage() {
  const currentPage = getCurrentPage();
  const nextPage = currentPage + 1;
  fetchProducts(nextPage);
}

// Adicionando uma função getCurrentPage para recuperar o número da página atual a partir do atributo "data-url" do botão "Ainda mais produtos aqui!" = nextPage
function getCurrentPage() {
  const nextPageButton = document.querySelector('.nextPage');
  const url = nextPageButton.getAttribute('data-url');
  const urlParams = new URLSearchParams(url);
  const currentPage = parseInt(urlParams.get('page'));
  return currentPage;
}

// Chamando a função para buscar os produtos da primeira página
fetchProducts(1);
