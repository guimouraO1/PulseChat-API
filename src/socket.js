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
    // io.emit("connectedUsers", JSON.stringify(Array.from(connected)));
   
    // connection do user para mapear seu ID com SOCKET.ID
    socket.on("userJoin", (user) => {
      if (user) {
        connectedUsers.set(user.id, socket.id);
        connected.add(user.id);
        io.emit("connectedUsers", JSON.stringify(Array.from(connected)));
      }
    });

    socket.on("message", async (user) => {
      const { message, authorMessageId, recipientId, time } = user;
      await UserController.postMessage(
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
          // Aqui você deve emitir a lista de usuários conectados como um JSON
          io.emit("connectedUsers", JSON.stringify(Array.from(connected)));
        }
      });
    });
  });
};