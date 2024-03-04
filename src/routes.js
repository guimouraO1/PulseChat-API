const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const verifyJWT =  require("./middlewares/auth")

router.get("/user/auth", verifyJWT, UserController.getUserById);
router.get("/users", verifyJWT, UserController.getUsers);
router.post("/register", UserController.register);
router.post("/login", UserController.login);


router.get('/messages', verifyJWT, UserController.getMessageUser);
router.put('/messages', UserController.updateMessageAsRead);

router.get('/friends', verifyJWT, UserController.getFriends);

module.exports = router;
