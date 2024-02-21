const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variaveis.env" });

module.exports = {
  
  getUserById: (id) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT user.id, user.email FROM user WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          if (results.length > 0) {
            accept(results[0]);
          } else {
            reject(false);
          }
        }
      );
    });
  },

  getUsers: (id) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT user.id, user.email FROM user WHERE id != ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          if (results.length > 0) {
            accept(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  getUserByEmail: (email) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT * FROM user WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          if (results.length > 0) {
            accept(results[0]);
          } else {
            accept(false);
          }
        }
      );
    });
  },

  register: (email, password) => {
    return new Promise((accept, reject) => {
      db.query(
        "INSERT INTO `user` (`email`, `password`) VALUES (?, ?)",
        [email, password],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          accept({ msg: true });
        }
      );
    });
  },

  login: (email, password) => {
    const SECRET = process.env.SECRET;

    return new Promise((accept, reject) => {
      db.query(
        "SELECT user.id, user.email FROM user WHERE email = ? AND password = ?",
        [email, password],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          if (results.length > 0) {
            let payload = { userId: results[0].id };
            let authToken = jwt.sign(payload, SECRET, { expiresIn: "30d" });
            accept({ user: results[0], authToken });
          } else {
            reject();
          }
        }
      );
    });
  },

  getMessageUser: (authorMessageId, recipientId) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT * FROM messages WHERE (authorMessageId = ? AND recipientId = ?) OR (authorMessageId = ? AND recipientId = ?) ORDER BY time ASC LIMIT 50",
        [authorMessageId, recipientId, recipientId, authorMessageId],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          accept(results);
        }
      );
    });
},

  postMessage: (authorMessageId, recipientId, time, message) => {
    return new Promise((accept, reject) => {
      db.query(
        "INSERT INTO messages (authorMessageId, recipientId, time, message) VALUES (?, ?, ?, ?);",
        [authorMessageId, recipientId, time, message],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          accept(results); // Aceita os resultados da operação de inserção
        }
      );
    });
  },
};
