import { Router } from 'express';
import { productModel } from '../models/product.model.js';
import { uploader } from '../utils/utilsMulter.js';
import { passportCall } from '../middlewares/passportCall.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

/** Método GET: PARA OBTENER TODOS LOS RECURSOS
 * Retornar todos los productos
 */
router.get('/', async(req, res) => {
    try{
        const products = await productModel.find();
        res.render('products', {products: products.map( product => product.toObject())});
    }catch(error){
        return res.render('error', {error:"Error al mostrar productos"});
    }
});

/** Método GET: PARA OBTENER UN RECURSO
 * Retornar un producto según su ID .get(/:id)
 */
router.get('/:id', async(req, res) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(!product){
            return res.render('error', {error: "Producto no encontrado"});
        }
        res.render('product', {product: product.toObject()});
    }catch(error){
        console.log(req.query.q)

        return res.render('error', {error:"Error al obtener el producto solicitado"});
        }
})


/** Método POST: PARA CREAR UN RECURSO
 * Crear un producto
 */

router.post('/', uploader.single('file') ,async(req,res) =>{
    try{
        const newproduct = new productModel(req.body);
        console.log(newproduct)

        newproduct.thumbnail = `/img/${req.file.originalname}`;

        if(!newproduct.title || !newproduct.description || !newproduct.code || !newproduct.price || !newproduct.stock || !newproduct.category){
            return res.render('error', {error: "Campos incompletos"});
        }
        await newproduct.save();
        res.render('product', {product: newproduct.toObject()});
    }catch(error){
        return res.render('error', {error: "Error al insertar el producto"});
    }
});


/** Método PUT: PARA ACTUALIZAR UN RECURSO
 * Actualizar un producto
 */
//Ruta protegida
router.get('/update/:id', async(req, res) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(!product){
            return res.render('error', {error: "Producto no encontrado"});
        }
        res.render('updateProduct', {product: product.toObject()});
    }catch(error){
        console.log(req.query.q)
        return res.render('error', {error:"Error al obtener el producto solicitado"});
        }
})

router.put('/:id', async(req, res) =>{
    try{
        const uid = await productModel.findById(req.params.id);
        const productUpdated = req.body;

        if (!productUpdated.title || !productUpdated.category || !productUpdated.description || !productUpdated.code || !productUpdated.price || !productUpdated.stock) {
            return res.render('error', {error: "Campos incompletos"});
        }

        await productModel.updateOne({_id:uid}, productUpdated);
        //await productUpdated.save();
        console.log(productUpdated);
        res.redirect('/editProductos');
    }catch(error){
        return res.render('error', {error: "Error al actualizar el producto"});
    }
});


/** Método DELETE: PARA ELIMINAR UN RECURSO
 * Eliminar un producto
 */

router.delete('/:id', passportCall('jwt'), authorization('admin'), async (req, res) => {
    try{
        const productDel = await productModel.findByIdAndDelete(req.params.id);
        if(!productDel){ 
            return res.render('error', {error: "No se encontró el producto a eliminar"})
        }
        res.redirect('/product');
        
    }catch(error){
        return res.render('error', {error: "Error al borrar un producto"});
    }
})

export default router;