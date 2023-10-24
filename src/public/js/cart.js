let cartId = 0;
let saveCart;

function updateCartList(products) {
  let cartContainer = document.getElementById('carrito');
  let cartContent = '';

  products.forEach((product) => {
    console.log(product);
    cartContent +=`
              <h2>Carrito de compras</h2>
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
                      <button data-cid="${cartId}" data-pid="${product.product._id}" class="remove-from-cart" onclick="removeProductFromCart('${cartId}', '${product.product._id}')">Eliminar</button>
                  </div>
            `
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

function removeProductFromCart(cid, pid) {
  const url = `/api/carts/${cid}/product/${pid}`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('No se pudo eliminar el producto del carrito');
      }
    })
    .then((data) => {
      const updatedCart = data.cart.products;
      console.log(updatedCart);
    })
    .catch((error) => {
      console.error(error);
    });
}