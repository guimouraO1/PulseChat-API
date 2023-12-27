const express = require("express");
const router = express.Router();
const userController = require("./controllers/UserController");
const UserController = require("./controllers/UserController");
const jwt = require("jsonwebtoken");
const UserService = require("./services/UserService");

const SECRET = process.env.SECRET;

// router.get("/users", userController.findAll);
router.get("/user", verifyJWT, userController.getUserById);
router.post("/user", UserController.register);
router.post("/login", UserController.login);
router.put("/user", verifyJWT, UserController.update);
router.delete("/user/:id", UserController.delete);

async function verifyJWT(req, res, next) {
  const token = req.headers["authorization"];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err){
      return res.status(401).json({ msg: "inválid token" }).end();
    } 

    req.userId = decoded.userId;
    next();
  });
}

router.get("/user/auth", verifyJWT, async (req, res) => {
  res.json({ user: req.userId, loggedIn: true });
});

module.exports = router;
