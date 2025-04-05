const express = require('express');
const router = express.Router();
const passport = require('passport');
const ticketController = require('../controllers/ticket.controller');
const { isAdmin } = require('../middlewares/auth.middlewares');

// Obtener todos los tickets (solo admin)
router.get('/', 
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    ticketController.getAllTickets
);

// Obtener un ticket por ID
router.get('/:tid', 
    passport.authenticate('jwt', { session: false }),
    ticketController.getTicketById
);

// Obtener tickets del usuario actual
router.get('/user/purchases', 
    passport.authenticate('jwt', { session: false }),
    ticketController.getTicketsByUser
);

module.exports = router; 