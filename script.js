/*-----HOME-ABOUT & FORM-----*/

let form = document.querySelector('#formRegistration');

// Função para validar se todos os campos foram preenchidos no formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
  
    let hasError = false;
  
    let inputName = document.forms['formRegistration']['nome'];
    let inputEmail = document.forms['formRegistration']['email'];
    let inputCpf = document.forms['formRegistration']['cpf'];
    let inputGender = document.forms['formRegistration']['genero'];
    //Confirmação de preenchimento campo nome
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
  
    //Confirmação de preenchimento campo e-mail
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
  
    //Confirmação de preenchimento campo CPF
    if (!inputCpf.value) {
      hasError = true;
      inputCpf.classList.add('inputError');
  
      let span = inputCpf.nextSibling.nextSibling;
      span.innerText = 'Digite seu CPF corretamente';
    } else {
      // Validação do CPF
      function TestaCPF(cpf) {
        let Soma;
        let Resto;
        Soma = 0;
        if (cpf == "00000000000") return false;
  
        for (i = 1; i <= 9; i++) {
          Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        Resto = (Soma * 10) % 11;
  
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(cpf.substring(9, 10))) return false;
  
        Soma = 0;
        for (i = 1; i <= 10; i++) {
          Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        Resto = (Soma * 10) % 11;
  
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(cpf.substring(10, 11))) return false;
        return true;
      }
  
      if (!TestaCPF(inputCpf.value)) {
        hasError = true;
        inputCpf.classList.add('inputError');
  
        let span = inputCpf.nextSibling.nextSibling;
        span.innerText = 'CPF inválido';
      } else {
        inputCpf.classList.remove('inputError');
  
        let span = inputCpf.nextSibling.nextSibling;
        span.innerText = '';
      }
    }
    
    //Confirmação de seleção de um dos generos
    let genderSelected = false;
    for (var i = 0; i < inputGender.length; i++) {
        if (inputGender[i].checked) {
        genderSelected = true;
        break;
        }
    }

    if (!genderSelected) {
        hasError = true;

        let inputGenderWrapper = document.querySelector('.input-wrapper-genero');
        inputGenderWrapper.classList.add('inputError');

        let span = inputGenderWrapper.querySelector('.error');
        span.innerText = 'Selecione uma opção';
    } else {
        let inputGenderWrapper = document.querySelector('.input-wrapper-genero');
        inputGenderWrapper.classList.remove('inputError');

        let span = inputGenderWrapper.querySelector('.error');
        span.innerText = '';
    }


  
    if (!hasError) {
      const successMessage = document.querySelector('#successMessage');
      successMessage.textContent = 'Cadastro efetuado com sucesso.';
      form.reset();
    }
});
  

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




/*-----SHARE-----*/

let formFriend = document.querySelector('#formShare');

// Função para validar se todos os campos foram preenchidos no formulário
formFriend.addEventListener('submit', function(e) {
    e.preventDefault();
  
    let hasErrorFriend = false;
  
    let inputNameFriend = document.forms['formShare']['nome_amigo'];
    let inputEmailFriend = document.forms['formShare']['email_amigo'];

    //Confirmação de preenchimento campo nome
    if (!inputNameFriend.value) {
      hasErrorFriend = true;
      inputNameFriend.classList.add('inputError');
  
      let spanFriend = inputNameFriend.nextSibling.nextSibling;
      spanFriend.innerText = 'Digite o nome do amigo corretamente';
    } else {
      inputNameFriend.classList.remove('inputError');
  
      let spanFriend = inputNameFriend.nextSibling.nextSibling;
      spanFriend.innerText = '';
    }
  
    //Confirmação de preenchimento campo e-mail
    if (!inputEmailFriend.value) {
      hasErrorFriend = true;
      inputEmailFriend.classList.add('inputError');
  
      let spanFriend = inputEmailFriend.nextSibling.nextSibling;
      spanFriend.innerText = 'Digite o e-mail do amigo corretamente';
    } else {
      inputEmailFriend.classList.remove('inputError');
  
      let spanFriend = inputEmailFriend.nextSibling.nextSibling;
      spanFriend.innerText = '';
    }
  
    if (!hasErrorFriend) {
        const successMessageFriend = document.querySelector('#successMessageFriend');
        successMessageFriend.textContent = 'Cadastro efetuado com sucesso.';
        formFriend.reset();
      }
  });