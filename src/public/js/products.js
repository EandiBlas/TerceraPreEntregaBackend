const socketClient = io();
let cartId = 0;
fetch('http://localhost:8080/api/products')
  .then((response) => response.json())
  .then((data) => {
    updateProductList(data.payload);
  })
// socketClient.on('enviodeproducts', (obj) => {
//   updateProductList(obj);
// });
socketClient.on('enviodecarts', (obj) => {
  cartId = obj._id;
});
function updateProductList(products) {
  let div = document.getElementById('contenedor');
  let addToCartButton = document.getElementById('addCart');
  let stockElement = document.getElementById('stock');

  if (addToCartButton) {
    addToCartButton.addEventListener('click', function() {
      let productId = addToCartButton.getAttribute('data-product-id');
      socketClient.emit('addToCart', { _id: cartId, products: [{ _id: productId }] });
      socketClient.on('stockUpdated', function(stock) {
        // Actualiza el stock en el frontend
        stockElement.textContent = 'STOCK: ' + stock;
      });
    });
  }
  let productos = '';
  products.forEach((product) => {
    productos += `
    <div class="card">
    <img src ="${product.thumbnail}" class="card-img-top imgshop">
    <div>
        <h5 class="card-title mytitulo">${product.title}</h5>
        <p class="card-text mydescripcion">Categoria: ${product.category}</p>
        <p class="card-text mydescripcion">ID:${product._id}</p>
        <p class="card-text mydescripcion">code:${product.code}</p>
        <p class="card-text mydescripcion">Info: ${product.description}</p>
        <p class="card-text mydescripcion">STOCK:${product.stock}</p>
        <p class="card-text mydescripcion">$${product.price}</p>
        <button class="btn mx-auto d-block mybutton" id="${product._id}" onclick="addCart('${product._id}')">
            <i class="fas fa-cart-plus"></i> Añadir al carrito
        </button>
        <div class="mydivrestysuma">
          <buttton class="btn btn-dark btn-rounded" onclick="decrementQuantity"> - </buttton>
          <p class="card-text mydescripcion" id="stock">STOCK: ${product.stock}</p>
          <buttton class="btn btn-dark btn-rounded botonsumar" onclick="incrementQuantity"> + </buttton>
        </div>
    <buttton class="btn myboton" id="eliminar${product.id}"> <i class="fas fa-cart-arrow-down"></i> Eliminar Producto </button>
</div>
    `;
  });

  // Set the innerHTML after the loop
  div.innerHTML = productos;
}

function addToCart(productId) {
  socketClient.emit('addCart', {
    _id: cartId,
    products: [{ _id: productId }],
  });
}

function incrementQuantity(productId) {
  // Incrementa la cantidad del producto en el carrito
  socketClient.emit('incrementQuantity', {
    _id: cartId,
    products: [{ _id: productId }],
  });
}

function decrementQuantity(productId) {
  // Decrementa la cantidad del producto en el carrito
  socketClient.emit('decrementQuantity', {
    _id: cartId,
    products: [{ _id: productId }],
  });
}

function updateStock(productId) {
  // Actualiza el stock del producto
  socketClient.emit('updateStock', {
    _id: productId,
  });
}
