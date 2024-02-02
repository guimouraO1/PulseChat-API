const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const verifyJWT =  require("./middlewares/auth")

router.get("/user/auth", verifyJWT, UserController.getUserById);
router.post("/user", UserController.register);
router.post("/login", UserController.login);
router.put("/user", verifyJWT, UserController.update);

router.get("/user/palls", verifyJWT, UserController.getPalls);
router.post("/user/palls", verifyJWT, UserController.postPalls);
router.delete("/user/palls", verifyJWT, UserController.deletePall)

// router.delete("/user/:id", UserController.delete);

module.exports = router;
