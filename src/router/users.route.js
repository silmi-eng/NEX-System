require("dotenv").config();
const router = require("express").Router();

const User = require("../services/user.processor");
const user = new User();

const Subscriptions = require("../services/subscription.processor");
const subscriptions = new Subscriptions();

const Passport = require("../controllers/passport.controller");
const passportInstance = Passport();

router.get(
  "/",
  passportInstance.authenticateCommon(),
  async (req, res, next) => {
    await user
      .find({ id: req.user.user.id })
      .then(async (u) => {
        await subscriptions
          .getSubscriptionDetails({ u: req.user })
          .then(({ subscription }) => {
            res.status(200).json({
              id: u.id,
              email: u.email,
              subscribed: u.subscribed,
              subscription_id: u.subscription_id,
              subscription_details: subscription,
            });
          })
          .catch((err) => {
            err.status = 400;
            err.message = err.message
              ? err.message
              : "Something happen during subscription process.";
            next(err);
          });
      })
      .catch((err) => next(err));
  }
);

router.delete("/remove", async (req, res, next) => {
  await user
    .remove({ id: req.user.user.id })
    .then(async (u) => res.status(201).json())
    .catch((err) => next(err));
});

module.exports = router;
