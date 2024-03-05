const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        "SELECT user.id, user.email, user.name FROM user WHERE email = ? AND password = ?",
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

  getFriends: (userId) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT friends.status, CASE WHEN friends.user1Id = ? THEN user2.id ELSE user1.id END AS friendId, CASE WHEN friends.user1Id = ? THEN user2.name ELSE user1.name END AS friendName FROM friends INNER JOIN user AS user1 ON friends.user1Id = user1.id INNER JOIN user AS user2 ON friends.user2Id = user2.id WHERE friends.status = 'Accepted' AND (friends.user1Id = ? OR friends.user2Id = ?)",
        [userId, userId, userId, userId],
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
