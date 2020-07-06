String.prototype.replaceAll = function(from, to){ return this.split(from).join(to); };

let cart = [];

// Obter a lista de produtos DO CARRINHO como Elemento (UL)
const cartList = document.getElementById('lista-carrinho');
// Obter o template do produto para o carrinho
const template = document.getElementById('carrinho-item').innerHTML;

const totalSpan = document.querySelector('span#total');

// Fazer o replace dos valores do objeto no template
const applyTemplateToItem = (item, template) => {
  return template
    .replaceAll('{{ID}}', item.id)
    .replaceAll('{{NOME}}',item.name)
    .replaceAll('{{IMAGEM}}',item.image)
    .replaceAll('{{PRECO}}', item.price)
    .replaceAll('{{QUANTIDADE}}', item.quantity);
};

const onComprarClicked = (evt) => {
  console.log(evt.target.nodeName, evt.target.attributes['data-id']);
  // No evento, filtrar quem é o target, e regir apenas ao botão comprar
  
  if(evt.target.nodeName === 'BUTTON' && evt.target.attributes['data-id']){
    const id = parseInt(evt.target.attributes['data-id'].nodeValue);
    const index = cart.findIndex(item=>item.id === id);
    if(index === -1){
      // Ler os valores do attr data- e criar um objeto
      const name = evt.target.attributes['data-name'].nodeValue;
      const price = parseFloat(evt.target.attributes['data-price'].nodeValue);
      const image = evt.target.attributes['data-image'].nodeValue;
      const quantity = parseInt(evt.target.attributes['data-quantity'].nodeValue);
      const item = { id, name, price, image, quantity };
      console.log('novo item', item);
      // Adicionar esse objeto em uma lista "global" que representa o carrinho
      cart.push(item);
      console.log('cart', cart);
    }
    else{
      cart[index].quantity++;
    }
    render();
  }
};

const onRemoveClicked = (evt) => {
  // Verificar se é o botão remover
  if(evt.target.nodeName === 'BUTTON' && evt.target.hasAttribute('data-id')){
    // Pegar o data-id, para saber qual item remover
    const id = parseInt(evt.target.getAttribute('data-id'));
    // Fazer um filter na lista global e remover o que tiver o id proveniente do botão
    cart = cart.filter(item => item.id !== id);
    // Rederizar - Adicionar todos os items (transformados pelo template) da lista global no innerHTML da lista do carrinho
    render();
    console.log('cart after removal', cart);
  }
};

const onQuantityChanged = (evt) => {
  // Verificar se o target é um input
  if(evt.target.nodeName === 'INPUT' && evt.target.hasAttribute('data-id')){
    // Pegar o valor do target que é a quantidade
    const quantity = parseInt(evt.target.value);
    // Pegar o id do data-id do target
    const id = parseInt(evt.target.getAttribute('data-id'));
    // Alterar o item na lista global de mesmo id atualizando a quantidade
    const index = cart.findIndex(item=>item.id === id);
    cart[index].quantity = quantity;
    render();
    console.log('Quantity altered', cart);
    
  }
};

const render = () => {
  const html = cart.map((item) => applyTemplateToItem(item, template)).join('\n');
  cartList.innerHTML = html;
  const total = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  totalSpan.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency:'BRL'});
};

// Obter a lista de produtos como Elemento (UL)
const productList = document.getElementById('lista-produtos');
// Adicionar um eventListener para click na lista
productList.addEventListener('click', onComprarClicked);
// Adicionar um eventListener para click na lista do carrinho
cartList.addEventListener('click', onRemoveClicked);
cartList.addEventListener('change', onQuantityChanged);