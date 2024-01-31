const express = require("express");
const router = express.Router();
const userController = require("./controllers/UserController");
const UserController = require("./controllers/UserController");
const jwt = require("jsonwebtoken");
const UserService = require("./services/UserService");
const verifyJWT = require('./middlewares/auth');


// router.get("/users", userController.findAll);
router.get("/user", verifyJWT, userController.getUserById);
router.post("/user", UserController.register);
router.post("/login", UserController.login);
router.put("/user", verifyJWT, UserController.update);
router.delete("/user/:id", UserController.delete);

router.get("/user/auth", verifyJWT, async (req, res) => {
  res.json({ user: req.userId });
});

module.exports = router;
