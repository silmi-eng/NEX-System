const http = require("http");
const { Server } = require("socket.io");

module.exports = (app) => {
    const server = http.createServer(app);
    const connection = new Server(server, { cors: { origin: "*" }});

    connection.on("connection", socket => {
        console.log('socket connected');
    });

    return { server }
    
};