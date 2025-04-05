const ProductModel = require('../models/product.model');
const DAO = require('../dao.interface');
const { ErrorHandler, ERROR_CODES } = require('../../utils/error-handler');

class ProductMongoDAO extends DAO {
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
            throw ErrorHandler.databaseError(
                `Error al obtener productos: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async getById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw ErrorHandler.notFoundError(
                    `Producto con ID ${id} no encontrado`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                );
            }
            return product;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al obtener producto por ID: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async create(productData) {
        try {
            return await ProductModel.create(productData);
        } catch (error) {
            if (error.code === 11000) {
                throw ErrorHandler.duplicateError(
                    'El código del producto ya está en uso',
                    ERROR_CODES.DUPLICATE_PRODUCT_CODE
                );
            }
            throw ErrorHandler.databaseError(
                `Error al crear producto: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async update(id, productData) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, productData, { new: true });
            if (!updatedProduct) {
                throw ErrorHandler.notFoundError(
                    `Producto con ID ${id} no encontrado`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                );
            }
            return updatedProduct;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            if (error.code === 11000) {
                throw ErrorHandler.duplicateError(
                    'El código del producto ya está en uso',
                    ERROR_CODES.DUPLICATE_PRODUCT_CODE
                );
            }
            throw ErrorHandler.databaseError(
                `Error al actualizar producto: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async delete(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw ErrorHandler.notFoundError(
                    `Producto con ID ${id} no encontrado`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                );
            }
            return deletedProduct;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al eliminar producto: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new ProductMongoDAO(); 