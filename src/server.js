require("dotenv").config({ path: "variaveis.env" });
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const http = require("http");
const path = require("path");
const app = express();
const UserService = require("./services/UserService");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(routes);

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
  // connection do user para mapear seu ID com SOCKET.ID
  socket.on("connection_user", (user) => {
    userSocketMap.set(user.id, socket.id);
  });

  // Evento para lidar com o login do usuário e enviar informações adicionais
  socket.on("message", (user) => {
    const { message, authorMessageId, recipientId, time } = user;

    if (userSocketMap.has(recipientId)) {
      const authorMessageSocketId = userSocketMap.get(authorMessageId);
      const recipientSocketId = userSocketMap.get(recipientId);

      // Invoca a rota correspondente para postar a mensagem
      // try {
      //   await routes.post('/messages')(user);
      // } catch (error) {
      //   console.error("Erro ao postar mensagem:", error);
      // }

      try {
        io.to(recipientSocketId)
          .to(authorMessageSocketId)
          .emit("private-message", {
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

    // Remova o usuário desconectado do mapa de usuários
    userSocketMap.forEach((value, key) => {
      if (value === socket.id) {
        userSocketMap.delete(key);
      }
    });
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Aplicação rodando na porta: ${process.env.PORT}`);
});
