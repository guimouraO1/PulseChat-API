const socketio = require("socket.io");
const UserController = require("./controllers/UserController");

module.exports = function (server) {
  const io = new socketio.Server(server, {
    cors: {
      origin: "*",
    },
  });

  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    // connection do user para mapear seu ID com SOCKET.ID
    socket.on("connection_user", (user) => {
      userSocketMap.set(user.id, socket.id);
      io.to(socket.id).emit("connected", true);
      // console.log(socket.id);
    });

    socket.on("message", async (user) => {
      const { message, authorMessageId, recipientId, time } = user;
      await UserController.postMessage(
        authorMessageId,
        recipientId,
        time,
        message
      );

      const authorMessageSocketId = userSocketMap.get(authorMessageId);
      const recipientSocketId = userSocketMap.get(recipientId);

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
      // console.log(`Usuário desconectado: ${socket.id}`);
      io.to(socket.id).emit("connected", false);
      // Remova o usuário desconectado do mapa de usuários
      userSocketMap.forEach((value, key) => {
        if (value === socket.id) {
          userSocketMap.delete(key);
        }
      });
    });
  });
};
