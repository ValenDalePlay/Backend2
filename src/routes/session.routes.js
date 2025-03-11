const express = require('express');
const router = express.Router();
const passport = require('passport');
const SessionController = require('../controllers/session.controller');

router.post('/register', SessionController.register);
router.post('/login', SessionController.login);
router.get('/current', 
    passport.authenticate('jwt', { session: false }),
    SessionController.current
);

module.exports = router; 