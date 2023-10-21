let cartId = 0;
let saveCart;

function updateCartList(products) {
  let cartContainer = document.getElementById('carrito');
  let cartContent = '';

  products.forEach((product) => {
    console.log(product);
    cartContent +=` 
            <div class="cart-item">
                <img src="${product.product.thumbnail}" class="cart-item-image">
                <div class="cart-item-details">
                    <h5 class="cart-item-title">${product.product.title}</h5>
                    <p class="cart-item-category">Categoría: ${product.product.category}</p>
                    <p class="cart-item-id">ID: ${product.product._id}</p>
                    <p class="cart-item-description">Descripción: ${product.product.description}</p>
                    <p class="cart-item-price">$${product.product.price}</p>
                </div>
                <p class="cart-item-quantity">Cantidad: ${product.quantity}</p>
                <button class="cart-item-remove-button" onclick="removeCart(${product.product._id})">Eliminar</button>
            </div>`
        ;
  });

  cartContainer.innerHTML = cartContent;
}

fetch('/api/carts/', {
  method: 'POST',
  body: JSON.stringify({ products: []}),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((result) => {
  result.json().then((data) => {
    cartId = data._id;
  });
});

function addCart(id) {
  fetch(`/api/carts/${cartId}/`, {
    method: 'POST',
    body: JSON.stringify({
      pid: id,
      quantity: 1,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    result.json().then((data) => {
      saveCart = data.cart.products;
      console.log(saveCart);
      updateCartList(saveCart);
    });
  });
}