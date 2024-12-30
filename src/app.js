require("dotenv").config();
const express = require("express");
const knexfile = require("../knexfile");
const app = express();

app.db = require("knex")(knexfile[process.env.DB_ENVIRONMENT]);

app.use(require("body-parser").json());

app.use(
  require("cors")({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Import routers here
app.use("/subscribe", require("./router/subscription.router"));
app.use("/auth", require("./router/auths.route"));
app.use("/user", require("./router/users.route"));

app.use((req, res, next) => {
  const err = {};
  err.status = 404;
  err.message = "Page not found";
  next(err);
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  console.log(err);

  res.status(err.status).json(message);
});

module.exports = { app };
