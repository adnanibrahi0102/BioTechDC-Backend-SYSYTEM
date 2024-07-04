import { Router } from "express";
import { getCurrentUser, loginUserController, registerUserController } from "../controllers/user.controller.js";
import { isUser, verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/registerUser").post(registerUserController);

router.route("/login").post(loginUserController);

router.get("/currentUser").get(verifyJwt , isUser , getCurrentUser);


export default router