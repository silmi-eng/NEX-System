require("dotenv").config();
const router = require('express').Router();
const User = require("../services/user.processor");
const user = new User();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

router.post('/signup', async (req, res, next) => {
    const { email, password } = req.body;

    await user.create({ email, password })
        .then((dt) => {
            const copy = { ...dt[0] }
            delete copy.password;

            const access_token = jwt.sign({ user: copy }, process.env.SECRET);
            res.status(200).json({access_token})
        })
        .catch(err => {
            switch(err.constraint) {
                case 'users_email_unique': next({
                            status: 400,
                            message: err.detail
                        })
                    break;
                case undefined: next({
                        status: 400,
                        message: `The required parameter ${err.column} is ${err.dataType}.`
                    })
                break;
                default: next(err)
                    break;
            }
        })
});

router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) next({
        status: 400,
        message: "The required parameter email is undefined."
    })
    else if (!password) next({
        status: 400,
        message: "The required parameter password is undefined."
    })

    await user.find({ email })
        .then((dt) => {
            if (!dt) throw new Error({
                status: 404,
                message: "Something happen: unauthorized"
            });

            if (bcrypt.compareSync(password, dt.password)) {
                const copy = { ...dt }
                delete copy.password;

                const access_token = jwt.sign({ user: copy }, process.env.SECRET);
                res.status(200).json({access_token})
            }
            else 
                throw new Error({
                    status: 404,
                    message: "Something happen: unauthorized"
                });
        })
        .catch(err => {
            next({
                status: 404,
                message: "Something happen: unauthorized"
            })
        })
});

module.exports = router;