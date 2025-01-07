class Connection {
  constructor(server) {
    this.connection = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
      transports: ["websocket"],
      pingInterval: 10000,
      pingTimeout: 5000,
      perMessageDeflate: {
        threshold: 1024,
      },
    });
  }
}

module.exports = { Connection };