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

  findOne: (email) => {
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

  findOneWpass: (email) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT user.id, user.email FROM user WHERE email = ?",
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
          // Modificação na consulta para selecionar email e senha
          db.query(
            "SELECT user.id, user.email FROM user WHERE email = ? AND password = ?",
            [email, password],
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              if (results.length > 0) {
                let payload = { subject: results[0] };
                let token = jwt.sign(
                  payload,
                  "5+P/|j99rJ]\4H9NMu^QhRcJPP8B.+Q"
                );
                accept({ token });
              } else {
                accept(false);
              }
            }
          );
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
    const secret = process.env.SECRET;

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
            let payload = { subject: results[0] };
            let token = jwt.sign(payload, secret);
            accept({ user: results[0], token });
          } else {
            accept(false);
          }
        }
      );
    });
  },

  token(token) {
    const secret = process.env.SECRET;
    const jwt = require("jsonwebtoken");
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (err) {
      console.error("Erro ao decodificar o JWT:", err.message);
    }
  },
};
