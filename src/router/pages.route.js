const router = require("express").Router();

const Rooms = require("../services/rooms.processor");
const room = new Rooms();

router.get("/signin", (req, res, next) => {
    res.status(200).render('auth', {
        auth: "Sign in",
        endpoint: ""
    });
});

router.get("/signup", (req, res, next) => {
    res.status(200).render('auth', {
        auth: "Sign up",
        endpoint: ""
    });
});

router.get("/:game/:token/play", (req, res, next) => {
    res.status(200).render('game', { game: req.params.game, token: req.params.token });
});

router.get("/", async (req, res, next) => {
    await room.createList().then((documents) => {
        res.status(200).render('dashboard', { documents });
    })
});

module.exports = router;