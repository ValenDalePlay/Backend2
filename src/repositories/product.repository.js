const productDAO = require('../dao/mongo/product.mongo.dao');

class ProductRepository {
    async getAll(limit, page, sort, query) {
        try {
            return await productDAO.getAll(limit, page, sort, query);
        } catch (error) {
            throw new Error(`Error en el repositorio de producto: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await productDAO.getById(id);
        } catch (error) {
            throw new Error(`Error en el repositorio de producto: ${error.message}`);
        }
    }

    async create(productData) {
        try {
            return await productDAO.create(productData);
        } catch (error) {
            throw new Error(`Error en el repositorio de producto: ${error.message}`);
        }
    }

    async update(id, productData) {
        try {
            return await productDAO.update(id, productData);
        } catch (error) {
            throw new Error(`Error en el repositorio de producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await productDAO.delete(id);
        } catch (error) {
            throw new Error(`Error en el repositorio de producto: ${error.message}`);
        }
    }
}

module.exports = new ProductRepository(); 