require("dotenv").config();

module.exports = {
  test: {
    client: "pg",
    connection: {
      host: "192.168.1.125",
      port: 6002,
      user: "root",
      password: "123abc",
      database: "root",
    },
    debug: false,
    migrations: {
      directory: "src/migrations",
    },
    seeds: {
      directory: "src/seeds",
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};
