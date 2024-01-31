const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

async function verifyJWT(req, res, next) {
    const token = req.headers["authorization"];
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "inválid token", loggedIn: false }).end();
      }
  
      req.userId = decoded.userId;
      next();
    });
  }

module.exports = verifyJWT;