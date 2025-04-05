const cartService = require('../services/cart.service');
const ticketService = require('../services/ticket.service');

class CartController {
    async getCartById(req, res, next) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            
            res.json({ status: 'success', payload: cart });
        } catch (error) {
            next(error);
        }
    }

    async createCart(req, res, next) {
        try {
            const newCart = await cartService.createCart();
            
            res.status(201).json({ 
                status: 'success', 
                message: 'Carrito creado exitosamente',
                payload: newCart 
            });
        } catch (error) {
            next(error);
        }
    }

    async addProductToCart(req, res, next) {
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
            next(error);
        }
    }

    async removeProductFromCart(req, res, next) {
        try {
            const { cid, pid } = req.params;
            
            const updatedCart = await cartService.removeProductFromCart(cid, pid);
            
            res.json({ 
                status: 'success', 
                message: 'Producto eliminado del carrito exitosamente',
                payload: updatedCart
            });
        } catch (error) {
            next(error);
        }
    }

    async updateCart(req, res, next) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            
            const result = await cartService.updateCart(cid, products);
            
            res.json({ 
                status: 'success', 
                message: 'Carrito actualizado exitosamente',
                payload: result 
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProductQuantity(req, res, next) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            
            const result = await cartService.updateProductQuantity(cid, pid, quantity);
            
            res.json({ 
                status: 'success', 
                message: 'Cantidad actualizada exitosamente',
                payload: result 
            });
        } catch (error) {
            next(error);
        }
    }

    async emptyCart(req, res, next) {
        try {
            const { cid } = req.params;
            
            const emptyCart = await cartService.emptyCart(cid);
            
            res.json({ 
                status: 'success', 
                message: 'Carrito vaciado exitosamente',
                payload: emptyCart
            });
        } catch (error) {
            next(error);
        }
    }

    async purchaseCart(req, res, next) {
        try {
            const { cid } = req.params;
            const purchaserEmail = req.user.email;
            
            const result = await ticketService.processPurchase(cid, purchaserEmail);
            
            // Comprobar si al menos un producto fue comprado
            if (result.ticket) {
                // Si hay productos fallidos, informamos pero la compra fue parcialmente exitosa
                if (result.productsFailed && result.productsFailed.length > 0) {
                    return res.json({ 
                        status: 'success', 
                        message: 'Compra parcialmente completada. Algunos productos no tenían stock suficiente.',
                        payload: {
                            ticket: result.ticket,
                            failedProducts: result.productsFailed
                        }
                    });
                }
                
                // Compra completamente exitosa
                return res.json({ 
                    status: 'success', 
                    message: 'Compra realizada exitosamente',
                    payload: {
                        ticket: result.ticket
                    }
                });
            } else {
                // Ningún producto pudo ser comprado
                return res.status(400).json({ 
                    status: 'error', 
                    error: 'No se pudo completar la compra. No hay productos disponibles en stock.',
                    failedProducts: result.productsFailed
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CartController(); 