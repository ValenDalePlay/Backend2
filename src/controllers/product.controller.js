const productService = require('../services/product.service');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            
            const result = await productService.getAllProducts(
                parseInt(limit), 
                parseInt(page), 
                sort, 
                query
            );
            
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
            
            const response = {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}` : null
            };
            
            res.json(response);
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await productService.getProductById(pid);
            
            res.json({ status: 'success', payload: product });
        } catch (error) {
            res.status(404).json({ status: 'error', error: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const productData = req.body;
            
            if (!productData.title || !productData.description || !productData.code || 
                !productData.price || !productData.stock || !productData.category) {
                return res.status(400).json({ 
                    status: 'error', 
                    error: 'Faltan datos obligatorios del producto' 
                });
            }
            
            const newProduct = await productService.createProduct(productData);
            
            res.status(201).json({ 
                status: 'success', 
                message: 'Producto creado exitosamente',
                payload: newProduct 
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const productData = req.body;
            
            const updatedProduct = await productService.updateProduct(pid, productData);
            
            res.json({ 
                status: 'success', 
                message: 'Producto actualizado exitosamente',
                payload: updatedProduct 
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            await productService.deleteProduct(pid);
            
            res.json({ 
                status: 'success', 
                message: 'Producto eliminado exitosamente'
            });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }
}

module.exports = new ProductController(); 