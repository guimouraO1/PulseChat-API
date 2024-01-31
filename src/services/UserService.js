const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variaveis.env" });

module.exports = {
  
  getUserById: (id) => {
    return new Promise((accept, reject) => {
      db.query(
        "SELECT user.email, user.first_name, user.last_name, IF(user.admin, 'true', 'false') AS admin FROM user WHERE id = ?",
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
  
  update: (id, first_name, last_name, admin) => {
    return new Promise((accept, reject) => {
      db.query(
        "UPDATE user SET first_name = ?, last_name = ?, admin = ? WHERE id = ?",
        [first_name, last_name, admin, id],
        (error, results) => {
          if (error) {
            // console.error("Error updating user:", error);
            reject(error);
            return;
          }
          // console.log("User updated successfully");
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
            let authToken = jwt.sign(payload, SECRET, { expiresIn: '30d' });
            accept({ user: results[0], authToken });
          } else {
            reject();
          }
        }
      );
    });
  }
  }