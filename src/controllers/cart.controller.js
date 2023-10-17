import CartService from "../services/cart.services.js";

class CartsController {
    constructor() {
        this.service = new CartService();
    }

    addProductToCart = async (req, res) => {
        const { cid } = req.params;
        const { pid, quantity } = req.body;
    
        try {
          const updatedCart = await this.service.addProductToCart(cid, pid, quantity);
          res.status(200).send({
            status: 'success',
            message: `The product with ID: ${pid} was added correctly`,
            cart: updatedCart,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: error.message });
        }
    }


    createCart = async (req, res) => {
        try {
            const { products } = req.body;
            if (!Array.isArray(products)) {
                return res.status(400).send('Invalid request: products must be an array');
            }
            const cart = await this.service.createCart(products);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json(error.message);
        }
    };

    getCartById = async (req, res) => {
        try {
            const cart = await this.service.getCart(req.params.cid);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    getAllCarts = async (req, res) => {
        try {
            const cart = await this.service.getCarts(req.body);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    updateProductQuantityInCart = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const result = await this.service.updateProductQuantityInCart(cid, pid, quantity);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    };

    updateProductList = async (req, res) => {
        const { cid } = req.params;
        const { _id, quantity } = req.body;
        try {
            const updatedCart = await this.service.updateProductList(cid, _id, quantity);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send(error.message);
        }
    };


    deleteProductInCart = async (req, res) => {
        const { cid, pid } = req.params;
    
        try {
          const updatedCart = await this.service.deleteProductInCart(cid, pid);
          res.status(200).send({ status: 'success', message: `Deleted product with ID: ${pid}`, cart: updatedCart });
        } catch (error) {
          console.log(error);
          res.status(500).send({ status: 'error', message: error.message });
        }
    }

    emptyCart = async (req, res) => {
        const { cid } = req.params;
    
        try {
          const updatedCart = await this.service.emptyCart(cid);
          res.status(200).send({
            status: 'success',
            message: `The cart with ID: ${cid} was emptied correctly`,
            cart: updatedCart,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: error.message });
        }
    }

    finalizeCartPurchase = async (req, res) => {
        const { cid } = req.params;
      
        try {
          const result = await this.service.finalizeCartPurchase(cid);
          res.status(200).json(result);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al finalizar la compra' });
        }
    };

}

export default CartsController