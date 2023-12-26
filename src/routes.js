const express = require("express");
const router = express.Router();
const userController = require("./controllers/UserController");
const UserController = require("./controllers/UserController");
const jwt = require("jsonwebtoken");
const UserService = require("./services/UserService");

router.get("/users", userController.findAll);
router.get("/user", userController.findOne);
router.post("/user", UserController.register);
router.post("/login", UserController.login);
router.put("/user/:id", UserController.update);
router.delete("/user/:id", UserController.delete);

router.get("/user/auth/:id", checkToken, async (req, res) => {
  
  const id = req.params.id;
  const user = await UserService.findOneWpass(id);

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" });
  }
  res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET
    jwt.verify(token, secret);
    next();

  } catch (error) {
    res.status(400).json({ msg: "Token inválido!" });
  }
}
module.exports = router;
