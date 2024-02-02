import { Router } from "express";
const router = Router();
import { getUserById, register, login, update, getPalls, postPalls, deletePall } from "./controllers/UserController";
import verifyJWT from "./middlewares/auth";

router.get("/user/auth", verifyJWT, getUserById);
router.post("/user", register);
router.post("/login", login);
router.put("/user", verifyJWT, update);


router.get("/user/palls", verifyJWT, getPalls);
router.post("/user/palls", verifyJWT, postPalls);
router.delete("/user/palls", verifyJWT, deletePall)

// router.delete("/user/:id", UserController.delete);

export default router;
