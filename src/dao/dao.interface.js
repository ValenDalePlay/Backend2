/**
 * Interfaz genérica para los Data Access Objects
 * Esta clase define los métodos que todos los DAOs deben implementar
 */
class DAO {
    async getAll() {
        throw new Error('El método getAll debe ser implementado');
    }

    async getById(id) {
        throw new Error('El método getById debe ser implementado');
    }

    async create(data) {
        throw new Error('El método create debe ser implementado');
    }

    async update(id, data) {
        throw new Error('El método update debe ser implementado');
    }

    async delete(id) {
        throw new Error('El método delete debe ser implementado');
    }
}

module.exports = DAO; 