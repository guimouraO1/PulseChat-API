const socketio = require("socket.io");
const UserController = require("./controllers/UserController");

module.exports = function (server) {
  const io = new socketio.Server(server, {
    cors: {
      origin: "*",
    },
  });

  const connectedUsers = new Map();
  const connected = new Set();

  io.on("connection", (socket) => {
    try{
      const userInfo = JSON.parse(socket.handshake.query.user);
      connectedUsers.set(userInfo.id, socket.id);
      connected.add(userInfo.id);
      io.emit("connectedUsers", JSON.stringify(Array.from(connected)));
    } catch{
      console.log('error')
    }

    socket.on("message", (user) => {
      const { message, authorMessageId, recipientId, time } = user;
      UserController.postMessage(
        authorMessageId,
        recipientId,
        time,
        message
      );

      const authorMessageSocketId = connectedUsers.get(authorMessageId);
      const recipientSocketId = connectedUsers.get(recipientId);

      try {
        io.to(authorMessageSocketId).emit("private-message", {
          message,
          authorMessageId,
          recipientId,
          time,
          read: true
        });

        io.to(recipientSocketId).emit("private-message", {
          message,
          authorMessageId,
          recipientId,
          time,
          read: false
        });
        
      } catch (error) {
        console.error("Erro ao postar mensagem:", error);
      }
    });

    socket.on("disconnect", () => {
      connectedUsers.forEach((value, key) => {
        if (value === socket.id) {
          connected.delete(key);
          connectedUsers.delete(key);
          io.emit("connectedUsers", JSON.stringify(Array.from(connected)));
        }
      });
    });
  });
};