/**
 * Interfaz base para repositorios
 * El patrón Repository actúa como intermediario entre la capa de servicio y los DAOs
 * Aplica transformaciones DTO y encapsula la lógica de acceso a datos
 */
class BaseRepository {
    constructor(dao, dto) {
        this.dao = dao;
        this.dto = dto;
    }

    async getAll(options = {}) {
        const items = await this.dao.getAll(options);
        return this.dto.toResponseList(items);
    }

    async getById(id) {
        const item = await this.dao.getById(id);
        return this.dto.toResponse(item);
    }

    async create(data) {
        const dataToCreate = this.dto.toPersistence(data);
        const newItem = await this.dao.create(dataToCreate);
        return this.dto.toResponse(newItem);
    }

    async update(id, data) {
        const updateData = this.dto.toUpdate(data);
        const updatedItem = await this.dao.update(id, updateData);
        return this.dto.toResponse(updatedItem);
    }

    async delete(id) {
        const deletedItem = await this.dao.delete(id);
        return this.dto.toResponse(deletedItem);
    }
}

module.exports = BaseRepository; 