const socketClient = io();

socketClient.on("enviodecarts", (cartData) => {
    // Llama a una función para actualizar la vista del carrito con los datos recibidos
    updateCartList(cartData.products);
});

function updateCartList(products) {
    let cartContainer = document.getElementById("cart-container");
    let cartContent = "";

    products.forEach((product) => {
        cartContent += `
            <div class="cart-item">
                <img src="${product.thumbnail}" class="cart-item-image">
                <div class="cart-item-details">
                    <h5 class="cart-item-title">${product.title}</h5>
                    <p class="cart-item-category">Categoría: ${product.category}</p>
                    <p class="cart-item-id">ID: ${product._id}</p>
                    <p class="cart-item-description">Descripción: ${product.description}</p>
                    <p class="cart-item-price">$${product.price}</p>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = cartContent;
}

// Agrega un listener de clic a la ventana (porque los botones se agregan dinámicamente)
window.addEventListener("click", (event) => {
    if (event.target && event.target.id.startsWith("boton")) {
        const productId = event.target.id.substring(5); // Obtén el ID del producto
        addProductToCart(productId);
    }
});

function addProductToCart(productId) {
    // Envía una solicitud al servidor para agregar el producto al carrito
    socketClient.emit("add-to-cart", { productId });
}
