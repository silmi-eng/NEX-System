const router = require("express").Router();

const Rooms = require("../services/rooms.processor");
const room = new Rooms();

const Passport = require("../controllers/passport.controller");
const passportInstance = Passport();

router.get("/signin", (req, res, next) => {
    res.status(200).render('auth', {
        auth: "Sign in",
        endpoint: "/auth/signin"
    });
});

router.get("/signup", (req, res, next) => {
    res.status(200).render('auth', {
        auth: "Sign up",
        endpoint: "/auth/signup"
    });
});

router.get("/:game/play", passportInstance.subscription(), (req, res, next) => {
    res.status(200).render('game', { game: req.params.game });
});

router.get("/home", async (req, res, next) => {
    await room.createList().then((documents) => {
        res.status(200).render('dashboard', { documents });
    })
});

router.get("/error", (req, res, next) => {
    res.status(req.query.code).render("error", { message: req.query.err });
})

module.exports = router;