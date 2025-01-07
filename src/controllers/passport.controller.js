require("dotenv").config();
const passport = require('passport');
const passportJwt = require('passport-jwt');

const User = require("../services/user.processor");
const user = new User();

const Subscriptions = require("../services/subscription.processor");
const subscriptions = new Subscriptions();

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

    const verifySubscriptions = new Strategy(successParams, async (payload, done) => {
        await user.find({ id: payload.user.id })
            .then(dt => {
                if (dt.subscribed) {
                    subscriptions.getSubscriptionDetails({ u: { user: dt } })
                        .then(dta => {
                            if (dta.subscription.status === "ACTIVE") {
                                done(null, { ...payload })
                            }
                            else {
                                const e = {};
                                e.status = 400;
                                e.message = "There was a problem with the payment system. Verify your subscription to continue."
                                done(e);
                            }
                        })
                        .catch(err => done(err, false))
                }
                else {
                    const e = {};
                    e.status = 400;
                    e.message = "You do not have an active subscription. Sign up to continue using our services."
                    done(e)
                }
            })
            .catch(err => {
                const e = {};
                e.status = 500;
                e.message = "Invalid user. Please contact support for assistance."
                e.stack = err;
            
                done(e)
            })
    });

    passport.use('jwt', commonStrategy);
    passport.use('success', successStrategy);
    passport.use('subscription', verifySubscriptions);

    return {
        authenticateCommon: () =>  passport.authenticate('jwt', { session: false }),
        proceedToPayment: () => passport.authenticate('success', { session: false }),
        subscription: () => passport.authenticate('subscription', { session: false })
    }

};