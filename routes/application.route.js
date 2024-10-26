import express from "express";
const router = express.Router();
import {applyJob , getApplicants ,getAppliedJobs , updateStatus} from "../controllers/application.controller.js";
import auth from "../middleware/auth.js";

router.get("/apply/:id" , auth , applyJob);
router.get("/get" , auth , getAppliedJobs);
router.get("/:id/applicants" , auth , getApplicants);
router.post("/status/:id/update" , auth , updateStatus);

export default router;