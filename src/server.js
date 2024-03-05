require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const setupSocket = require("./socket");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
setupSocket(server);

module.exports = {
  start: function () {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on Port: ${PORT}`);
    });
  },
  close: function () {
    server.close();
  },
};
