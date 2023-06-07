

/*-----GALLERY-----*/

// Função para buscar os produtos da API
function fetchProducts(page) {
    const url = `https://frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=${page}`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const products = data.products;
        let productCards = '';
  
        products.forEach((product) => {
          const card = createProductCard(product);
          productCards += card;
        });
  
        const galleryWrapper = document.querySelector('.gallery-wrapper');
        galleryWrapper.innerHTML = productCards;
      })
      .catch((error) => {
        console.log('Erro ao buscar os produtos:', error);
      });
}
  
// Função para criar um card de produto com as informações fornecidas
function createProductCard(product) {
    return `
      <div class="product">
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

//variavel para a próxima página
const nextPageButton = document.querySelector('.nextPage');
nextPageButton.addEventListener('click', loadNextPage);

//Definindo a função loadNextPage que será chamada quando o botão "nextPage" for clicado
function loadNextPage() {
    const currentPage = getCurrentPage();
    const nextPage = currentPage + 1;
    fetchProducts(nextPage);
}

//Adicionando uma função getCurrentPage para recuperar o número da página atual a partir da URL do botão "nextPage"
function getCurrentPage() {
    const nextPageButton = document.querySelector('.nextPage');
    const url = nextPageButton.getAttribute('data-url');
    const urlParams = new URLSearchParams(url);
    const currentPage = parseInt(urlParams.get('page'));
    return currentPage;
  }
  
  
  // Chamando a função para buscar os produtos
  fetchProducts(1);

  