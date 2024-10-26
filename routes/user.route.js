import express from "express";
const router = express.Router();
import { register ,login ,logout ,updateProfile } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

router.post("/register" , register);
router.post("/login" , login);
router.get("/logout" , logout);
router.put("/update", auth , updateProfile);



export default router;