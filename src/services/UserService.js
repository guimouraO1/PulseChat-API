const db = require("../db");

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

          accept(results.id);
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
            accept(results[0]);
          } else {
            accept(false);
          }
        }
      );
    });
  },
};
