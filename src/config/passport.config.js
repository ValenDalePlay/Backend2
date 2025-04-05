const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../dao/models/user.model');
const bcrypt = require('bcrypt');

const initializePassport = () => {
    // Estrategia Local
    passport.use('local', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                const isMatch = bcrypt.compareSync(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([
            ExtractJWT.fromAuthHeaderAsBearerToken(),
            req => req?.cookies?.['jwt']
        ]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};

module.exports = initializePassport; 