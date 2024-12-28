require("dotenv").config();
const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require("../services/user.processor");
const user = new User();

const { Strategy, ExtractJwt } = passportJwt;

module.exports = () => {
    const params = {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()        
    };

    const successParams = {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('uuid') 
    };

    const commonStrategy = new Strategy(params, async (payload, done) => {
        await user.find({ id: payload.user.id })
            .then(dt => {
                if (dt) done(null, { ...payload })
                else done(null, false);
            })
            .catch(err => done(err, false))
    });

    const successStrategy = new Strategy(successParams, async (payload, done) => {
        await user.find({ id: payload.user.id })
            .then(dt => {
                if (dt) done(null, { ...payload })
                else done(null, false);
            })
            .catch(err => done(err, false))
    });

    passport.use('jwt', commonStrategy);
    passport.use('success', successStrategy);

    return {
        authenticateCommon: () =>  passport.authenticate('jwt', { session: false }),
        proceedToPayment: () => passport.authenticate('success', { session: false })
    }

};