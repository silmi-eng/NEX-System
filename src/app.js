require("dotenv").config();
const express = require("express");
const path = require("path");
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Import routers here
app.use("/subscribe", require("./router/subscription.router"));
app.use("/auth", require("./router/auths.route"));
app.use("/users", require("./router/users.route"));
app.use("/", require("./router/pages.route"));

app.use((req, res, next) => {
  const err = {};
  err.status = 404;
  err.message = "Page not found";
  next(err);
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;

  if (err.status === 404 && err.message === "Page not found")
    res.status(err.status).redirect("/");
  else
    res.status(err.status).json(message);
});

const { server } = require("./sockets/emulator.socket")(app);

module.exports = { server, app };
