import { Router } from 'express';
import {privateAcces,publicAcces,adminAccess} from '../middlewares/middlewares.js'
const router = Router()

import ProductController from '../controllers/product.controller.js';

const pc = new ProductController();

//Traer todos los productos
router.get('/', pc.getAllProducts)
//Traer un solo producto
router.get('/:pid', pc.getProduct)
//Crear un producto
router.post('/', adminAccess, pc.addProduct)
//Modifica las carasteristicas de un producto
router.put('/:pid', adminAccess, pc.updateProduct)
//Eliminar un producto
router.delete('/:pid', adminAccess, pc.deleteProduct)


export default router