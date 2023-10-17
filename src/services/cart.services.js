import CartManager from "../persistencia/dao/managers/cartManagerMongo.js";
import ProductManager from "../persistencia/dao/managers/productManagerMongo.js";
import UsersManager from "../persistencia/dao/managers/userManagerMongo.js";

class CartService {

  constructor() {
    this.cart = new CartManager();
    this.product = new ProductManager();
    this.user = new UsersManager();
  }

  addProductToCart = async (cid, pid, quantity) => {
    try {
      const cart = await this.cart.getCartById(cid);
      if (!cart) {
        throw new Error(`Cart with ID: ${cid} not found`);
      }

      const productIndex = cart.products.findIndex((product) => product._id.toString() === pid);

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ _id: pid, quantity });
      }

      return await this.cart.updateProductsInCart(cid, cart.products);
    } catch (error) {
      throw error;
    }
  }

  createCart = async (products) => {
    let cartData = {};
    const validProducts = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const checkId = await this.product.getProductById(product._id);
      if (checkId === null) {
        throw new Error(`Product with ID ${product._id} does not exist`);
      }
      validProducts.push(product);
    }
    cartData.products = validProducts;
    return await this.cart.addCart(cartData)
  };

  getCart = async (id) => {
    const cart = await this.cart.getCartById(id);
    return cart;
  }

  getCarts = async () => {
    const carts = await this.cart.getCarts();
    return carts;
  };

  updateProductQuantityInCart = async (cid, pid, quantity) => {
    const cart = await this.cart.getCartById(cid);
    const products = cart.products;
    const checkId = await this.product.getProductById(pid);
    if (checkId === null) {
      throw new Error(`Product with ID ${pid} does not exist`);
    }
    const productIndex = products.findIndex(product => product._id == pid);
    if (productIndex !== -1) {
      products[productIndex].quantity += quantity;
    } else {
      products.push({ _id: pid, quantity });
    }
    const updatedCart = await this.cart.updateProductsInCart(cid, products);

    return updatedCart;
  };


  updateProductList = async (cid, pid, quantity) => {
    console.log(pid)
    try {
      const cart = await this.cart.getCartById(cid);

      const productIndex = cart.products.findIndex((product) => product._id == pid);

      if (productIndex > -1) {
        if (quantity > 0) {
          cart.products[productIndex].quantity = quantity;
        } else {
          cart.products.splice(productIndex, 1);
        }
      } else if (quantity > 0) {
        cart.products.push({ _id: pid, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw error;
    }
  };


  deleteProductInCart = async (cid, pid) => {
    try {
      const cart = await this.cart.getCartById(cid);
      const productIndex = cart.products.findIndex((product) => product._id.toString() === pid);
      if (productIndex === -1) {
        throw new Error(`Product with ID: ${pid} not found in cart`);
      }

      cart.products.splice(productIndex, 1);
      return await this.cart.updateCart(cid, cart.products);
    } catch (error) {
      throw error;
    }
  }


  emptyCart = async (cid) => {
    try {
      const cart = await this.cart.getCartById(cid);
      if (!cart) {
        throw new Error(`Cart with ID: ${cid} not found`);
      }

      if (cart.products.length === 0) {
        throw new Error('The cart is already empty');
      }

      cart.products = [];
      return await this.cart.updateCart(cid, cart.products);
    } catch (error) {
      throw error;
    }
  }


  // Método para finalizar la compra de un carrito
  finalizeCartPurchase = async (cid) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    // Función para obtener el correo del usuario asociado al carrito
    const getUserEmailAssociatedWithCart = async (cart) => {
      const user = await this.user.findUserById(cart.userId);
  
      if (!user) {
        throw new Error('Usuario asociado al carrito no encontrado');
      }
  
      return user.email;
    };
  
    try {
      const cart = await this.cart.getCartById(cid);
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const productsToUpdate = [];
      const productsToDelete = [];
  
      for (const product of cart.products) {
        const productData = await this.product.getProductById(product._id);
  
        if (!productData) {
          throw new Error(`Producto no encontrado en la base de datos: ${product._id}`);
        }
  
        if (product.quantity > productData.stock) {
          throw new Error(`No hay suficiente stock para el producto: ${productData.title}`);
        }
  
        productData.stock -= product.quantity;
        productsToUpdate.push(productData);
        productsToDelete.push(product);
      }
  
      for (const productData of productsToUpdate) {
        await this.product.updateProduct(productData._id, productData);
      }
  
      const ticket = new ticketModel({
        code: ticketModel.generateUniqueTicketCode(),
        purchase_datetime: new Date(),
        amount: ticketModel.calculateTotalAmount(cart.products),
        purchase: await getUserEmailAssociatedWithCart(cart),
      });
  
      await ticket.save();
  
      cart.products = cart.products.filter((product) => !productsToDelete.includes(product));
  
      await this.cart.updateCart(cid, cart.products);
  
      await session.commitTransaction();
      session.endSession();
  
      return { message: 'Compra exitosa', ticket: ticket };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };
  

}

export default CartService