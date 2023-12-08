const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

const users = {};

io.on("connection", (socket) => {
    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", (message) => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id],
        });
    });

    socket.on("disconnect", (message) => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
});

httpServer.listen(8000, () => {
    console.log("listening on *:8000");
});
