const socketio = require("socket.io");

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
    });

    // Evento para lidar com o login do usuário e enviar informações adicionais
    socket.on("message", (user) => {
      const { message, authorMessageId, recipientId, time } = user;

      if (userSocketMap.has(recipientId)) {
        const authorMessageSocketId = userSocketMap.get(authorMessageId);
        const recipientSocketId = userSocketMap.get(recipientId);

        try {
          io.to(authorMessageSocketId).emit("private-message", {
            message,
            authorMessageId,
            recipientId,
            time,
          });

          io.to(recipientSocketId).emit("private-message", {
            message,
            authorMessageId,
            recipientId,
            time,
          });
          
        } catch (error) {
          console.error("Erro ao postar mensagem:", error);
        }
      } else {
        console.log(
          "Usuário não encontrado no mapa de usuários.",
          `ID: ${recipientId}`
        );
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
