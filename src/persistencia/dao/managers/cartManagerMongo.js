import { cartModel } from "../models/carts.model.js"

class CartManager {

    getCarts = async () => {
        try {
            const carts = await cartModel.find().lean();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };


    
    getCartById = async (cartId) => {

        try {
            const cart = await cartModel.findById(cartId).populate('products._id');
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            return err;
        }
    };

    addCart = async (cartData) => {
        try {
            const cart = await cartModel.create(cartData);
            return cart; // Devuelve el carrito creado en caso de éxito
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            throw err; // Propaga el error para que sea manejado externamente
        }
    };


    // addProductInCart = async (cid, obj) => {
    //     try {
    //       const filter = { _id: cid, 'products._id': obj._id };
    //       const cart = await cartModel.findById(cid);
    //       const findProduct = cart.products.some(
    //         (product) => product._id.toString() == obj._id
    //       );
    //       if (findProduct) {
    //         const update = {
    //           $inc: { 'products.$.quantity': obj.quantity ? obj.quantity : 1 },
    //         };
    //         await cartModel.updateOne(filter, update);
    //       } else {
    //         const update = {
    //           $push: { products: { _id: obj._id, quantity: obj.quantity } },
    //         };
    //         await cartModel.updateOne({ _id: cid }, update);
    //       }
    
    //       return await cartModel.findById(cid);
    //     } catch (err) {
    //       console.error('Error al agregar el producto al carrito:', err.message);
    //       return err;
    //     }
    // };

      
    deleteProductInCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            return err
        }

    }

    updateCart = async (cid, products) => {
        return await cartModel.updateOne(
            { _id: cid },
            { products })
    }

    updateProductsInCart = async (cid, products) => {
        return await cartModel.updateOne(
            { _id: cid },
            { products }
        );

    }
    
};

export default CartManager;