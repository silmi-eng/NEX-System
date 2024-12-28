const router = require("express").Router();
const Subscriptions = require("../services/subscription.processor");
const subscriptions = new Subscriptions();

const Passport = require("../controllers/passport.controller");
const passportInstance = Passport();

router.post('/create', passportInstance.authenticateCommon(), async (req, res, next) => {
    await subscriptions.create(req.user)
        .then(({approval_url}) => res.status(200).json({approval_url}))
        .catch(err => {
            err.status = 400;
            err.message = "Something happen generating billingAgreement";
            next(err);
        })
});

router.post('/unsubscribe', passportInstance.authenticateCommon(), async (req, res, next) => {
    await subscriptions.unsubscribe({ reason: req.body.reason ? req.body.reason : "", u: req.user })
        .then(({status}) => res.status(200).json({status}))
        .catch(err => {
            err.status = 400;
            err.message = "Something happen during subscription process.";
            next(err);
        })
});

router.get('/success', passportInstance.proceedToPayment(), async (req, res, next) => {
    await subscriptions.success({subscription: req.query.subscription_id, u: req.user})
        .then(({subscription}) => res.status(200).json({subscription}))
        .catch(err => {
            err.status = 400;
            err.message = "Something happen during subscription process.";
            next(err);
        })
});

router.get('/cancel', passportInstance.proceedToPayment(), async (req, res, next) => {
    res.status(200).json("Operation aborted")
});

router.get('/details', passportInstance.authenticateCommon(), async (req, res, next) => {
    await subscriptions.getSubscriptionDetails({ u: req.user })
        .then(({subscription}) => res.status(200).json({subscription}))
        .catch(err => {
            err.status = 400;
            err.message = err.message ? err.message : "Something happen during subscription process.";
            next(err);
        })
});

module.exports = router;