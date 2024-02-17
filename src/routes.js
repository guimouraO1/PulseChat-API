const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const verifyJWT =  require("./middlewares/auth")

router.get("/user/auth", verifyJWT, UserController.getUserById);
router.post("/user", UserController.register);
router.post("/login", UserController.login);
// router.put("/user", verifyJWT, UserController.update);
// router.delete("/user/:id", UserController.delete);

module.exports = router;
