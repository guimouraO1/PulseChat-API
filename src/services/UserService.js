const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variaveis.env" });

module.exports = {
  
  findAll: () => {
    return new Promise((accept, reject) => {
      db.query("SELECT * FROM user", (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        accept(results);
      });
    });
  },

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

  findUserByEmail: (email) => {
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
          
          accept({ register: true });
        }
      );
    });
  },
  
  update: (id, email, password) => {
    return new Promise((accept, reject) => {
      db.query(
        "UPDATE user SET email = ?, password = ? WHERE id = ?",
        [email, password, id],
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

  delete: (id) => {
    return new Promise((accept, reject) => {
      db.query("DELETE FROM user WHERE id = ?", [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        accept(results);
      });
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
            let token = jwt.sign(payload, SECRET, { expiresIn: '24h' });
            accept({ user: results[0], token });
          } else {
            reject();
          }
        }
      );
    });
  },

};
