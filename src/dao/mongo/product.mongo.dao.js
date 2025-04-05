const ProductModel = require('../models/product.model');

class ProductMongoDAO {
    async getAll(limit = 10, page = 1, sort = null, query = null) {
        try {
            const options = {
                limit,
                page,
                lean: true
            };

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            const queryObject = query ? { category: query } : {};

            return await ProductModel.paginate(queryObject, options);
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener producto por ID: ${error.message}`);
        }
    }

    async create(productData) {
        try {
            return await ProductModel.create(productData);
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    async update(id, productData) {
        try {
            return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

module.exports = new ProductMongoDAO(); 