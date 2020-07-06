String.prototype.replaceAll = function(from, to){ return this.split(from).join(to); };

const createDB = (key, storage) => {

  return {
    getCart : () => JSON.parse(storage[key] || '[]'),
    setCart : function(cart) {
      storage[key] = JSON.stringify(cart);
      return this.getCart();
    }
  };

};

const createCart = (render, db) => {
  let _cart = db.getCart();

  return {
    addItem : (item) => {
      _cart = db.setCart([..._cart, item]);
      if(render) render();
    },
    
    getItems : () => _cart,
    
    removeItemById : (id) => {
      _cart = db.setCart(_cart.filter(item => item.id !== id));
      if(render) render();
    },
    
    alterQuantity : (id, quantity) => {
      const index = _cart.findIndex(item => item.id === id);
      _cart[index].quantity = quantity;
      _cart = db.setCart(_cart);
      if(render) render();
    },
    
    findItemById : (id) => {
      const index = _cart.findIndex(item => item.id === id);
      const item = index > -1 ? _cart[index] : null;
      return { index, item };
    },
    
    calcTotal : () => _cart.reduce((total, item) => total + item.quantity * item.price, 0)
  };
};

const render = (template) => () => {
  // Fazer o replace dos valores do objeto no template
  const applyTemplateToItem = applyTemplate(template);
  const html = cart.getItems().map(applyTemplateToItem).join('\n');
  // Renderizar - Adicionar todos os items (transformados pelo template) da lista global no innerHTML da lista do carrinho
  cartList.innerHTML = html;
  totalSpan.innerText = cart.calcTotal().toLocaleString('pt-BR', { style: 'currency', currency:'BRL'});
};

const onComprarClicked = (evt) => {
  if(evt.target.nodeName === 'BUTTON' && evt.target.hasAttribute('data-id')){
    const id = parseInt(evt.target.getAttribute('data-id'));
    const { index, item } = cart.findItemById(id);
    
    if(index === -1){
      // Ler os valores do attr data- e criar um objeto
      const attributeList = [...evt.target.attributes];
      const attributes = attributeList.reduce((obj, attribute) => {
        obj[attribute.nodeName.replace('data-','')] = attribute.nodeValue;
        return obj;
      }, {});
      const itemToAdd = { 
        id : parseInt(attributes.id),
        name : attributes.name,
        price : parseFloat(attributes.price),
        image : attributes.image,
        quantity : parseInt(attributes.quantity)
      };
      console.log('novo item', itemToAdd);
      // Adicionar esse objeto em uma lista "global" que representa o carrinho
      cart.addItem(itemToAdd);
    }
    else{
      // Caso o item comprado já exista no carrinho incrementar a quantidade
      cart.alterQuantity(id, item.quantity + 1);
    }
    console.log('cart', cart.getItems());
  }
};

const applyTemplate = template => item => {
  return template
    .replaceAll('{{ID}}', item.id)
    .replaceAll('{{NOME}}',item.name)
    .replaceAll('{{IMAGEM}}',item.image)
    .replaceAll('{{PRECO}}', item.price)
    .replaceAll('{{QUANTIDADE}}', item.quantity);
};

const onRemoveClicked = (evt) => {
// Verificar se é o botão remover
  if(evt.target.nodeName === 'BUTTON' && evt.target.hasAttribute('data-id')){
    // Pegar o data-id, para saber qual item remover
    const id = parseInt(evt.target.getAttribute('data-id'));
    // Fazer um filter na lista global e remover o que tiver o id proveniente do botão
    // Rederizar - Adicionar todos os items (transformados pelo template) da lista global no innerHTML da lista do carrinho
    cart.removeItemById(id);
    console.log('cart after removal', cart.getItems());
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
    cart.alterQuantity(id, quantity);
    console.log('Quantity altered', cart.getItems());
  }
};

// Obter a lista de produtos como Elemento (UL)
const productList = document.querySelector('#lista-produtos');
// Adicionar um eventListener para click na lista
productList.addEventListener('click', onComprarClicked);
// Obter a lista de produtos DO CARRINHO como Elemento (UL)
const cartList = document.querySelector('#lista-carrinho');
// Adicionar um eventListener para click na lista do carrinho
cartList.addEventListener('click', onRemoveClicked);
cartList.addEventListener('change', onQuantityChanged);
// Obter o template do produto para o carrinho
const template = document.querySelector('template#carrinho-item').innerHTML;
const totalSpan = document.querySelector('span#total');

const defaultRender = render(template);
const db = createDB('cart', localStorage);
const cart = createCart(defaultRender, db);
defaultRender();