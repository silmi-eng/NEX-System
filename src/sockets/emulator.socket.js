const http = require("http");

const { Connection } = require("./connection");

module.exports = (app) => {
  const server = http.createServer(app);
  const connection = new Connection(server).connection;

  connection.on("connection", (socket) => {
    console.log("socket connected");
    socket.on("ping", (callback) => callback());
  });

  return { server };
};
