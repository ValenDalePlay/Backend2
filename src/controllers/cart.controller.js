const cartService = require('../services/cart.service');
const ticketService = require('../services/ticket.service');

class CartController {
    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            
            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(404).json({ status: 'error', error: error.message });
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            
            res.status(201).json({ 
                status: 'success', 
                message: 'Carrito creado exitosamente',
                payload: newCart 
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity = 1 } = req.body;
            
            const result = await cartService.addProductToCart(cid, pid, parseInt(quantity));
            
            res.json({ 
                status: 'success', 
                message: 'Producto agregado al carrito exitosamente',
                payload: result 
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            
            await cartService.removeProductFromCart(cid, pid);
            
            res.json({ 
                status: 'success', 
                message: 'Producto eliminado del carrito exitosamente'
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            
            if (!Array.isArray(products)) {
                return res.status(400).json({ 
                    status: 'error', 
                    error: 'El campo products debe ser un array' 
                });
            }
            
            const result = await cartService.updateCart(cid, products);
            
            res.json({ 
                status: 'success', 
                message: 'Carrito actualizado exitosamente',
                payload: result 
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ 
                    status: 'error', 
                    error: 'La cantidad debe ser un número positivo' 
                });
            }
            
            const result = await cartService.updateProductQuantity(cid, pid, quantity);
            
            res.json({ 
                status: 'success', 
                message: 'Cantidad actualizada exitosamente',
                payload: result 
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async emptyCart(req, res) {
        try {
            const { cid } = req.params;
            
            await cartService.emptyCart(cid);
            
            res.json({ 
                status: 'success', 
                message: 'Carrito vaciado exitosamente'
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const purchaserEmail = req.user.email;
            
            const result = await ticketService.processPurchase(cid, purchaserEmail);
            
            if (result.ticket) {
                res.json({ 
                    status: 'success', 
                    message: 'Compra realizada exitosamente',
                    payload: {
                        ticket: result.ticket,
                        failedProducts: result.productsFailed
                    }
                });
            } else {
                res.status(400).json({ 
                    status: 'error', 
                    error: 'No se pudo completar la compra. No hay productos disponibles en stock.',
                    failedProducts: result.productsFailed
                });
            }
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }
}

module.exports = new CartController(); 