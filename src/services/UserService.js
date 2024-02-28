const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variaveis.env" });

module.exports = {
  
  getUserById: (id) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT user.id, user.email, user.name FROM user WHERE id = ?",
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
        "SELECT user.id, user.email, user.name FROM user WHERE id != ?",
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

  register: (email, password, userId, name) => {
    return new Promise((accept, reject) => {
      db.query(
        "INSERT INTO `user` (`id`, `email`, `password`, `name`) VALUES (?, ?, ?, ?)",
        [userId, email, password, name],
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

  getMessageUser: (authorMessageId, recipientId, offset, limit) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT * FROM messages WHERE (authorMessageId = ? AND recipientId = ?) OR (authorMessageId = ? AND recipientId = ?) ORDER BY time DESC LIMIT ?, ?",
        [authorMessageId, recipientId, recipientId, authorMessageId, offset, limit],
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

  postMessage: (authorMessageId, recipientId, time, message, messageId) => {
    return new Promise((accept, reject) => {
      db.query(
        "INSERT INTO messages (authorMessageId, recipientId, time, message, id) VALUES (?, ?, ?, ?, ?);",
        [authorMessageId, recipientId, time, message, messageId],
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

  updateMessageAsRead: (authorMessageId, recipientId) => {
    return new Promise((accept, reject) => {
      db.query(
        "UPDATE messages SET `read` = ? WHERE (authorMessageId = ? AND recipientId = ? AND `read` = 'false');",
        ['true', authorMessageId, recipientId, recipientId, authorMessageId],
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
  
};
