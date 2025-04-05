const productRepository = require('../repositories/product.repository');

class ProductService {
    async getAllProducts(limit = 10, page = 1, sort = null, query = null) {
        return await productRepository.getAll(limit, page, sort, query);
    }

    async getProductById(id) {
        const product = await productRepository.getById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return product;
    }

    async createProduct(productData) {
        return await productRepository.create(productData);
    }

    async updateProduct(id, productData) {
        const product = await this.getProductById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return await productRepository.update(id, productData);
    }

    async deleteProduct(id) {
        const product = await this.getProductById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return await productRepository.delete(id);
    }
}

module.exports = new ProductService(); 