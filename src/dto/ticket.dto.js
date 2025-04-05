const DTO = require('./dto.interface');

class TicketDTO extends DTO {
    /**
     * Convierte un ticket a formato de respuesta
     * @param {Object} ticket - Ticket del modelo
     * @returns {Object} - DTO para respuesta
     */
    static toResponse(ticket) {
        if (!ticket) return null;

        return {
            id: ticket._id || ticket.id,
            code: ticket.code,
            purchaseDateTime: ticket.purchase_datetime,
            amount: ticket.amount,
            purchaser: ticket.purchaser,
            createdAt: ticket.createdAt || ticket.created_at
        };
    }

    /**
     * Convierte datos para la creación de un ticket
     * @param {Object} ticketData - Datos del ticket
     * @returns {Object} - DTO para persistencia
     */
    static toPersistence(ticketData) {
        if (!ticketData) return null;

        return {
            amount: Number(ticketData.amount),
            purchaser: ticketData.purchaser
        };
    }

    /**
     * Convierte datos para la actualización de un ticket
     * @param {Object} ticketData - Datos actualizados del ticket
     * @returns {Object} - DTO para actualización
     */
    static toUpdate(ticketData) {
        const updateData = {};

        if (ticketData.amount) {
            updateData.amount = Number(ticketData.amount);
        }

        if (ticketData.purchaser) {
            updateData.purchaser = ticketData.purchaser;
        }

        return updateData;
    }
}

module.exports = TicketDTO; 