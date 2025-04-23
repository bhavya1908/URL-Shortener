import express from "express";
import {handleShorten, handleRedirect ,handleGetAnalytics, handleGenerateQR} from "../controllers/control.features.js"
import {protectRoute} from "../middleware/spam.check.js"
import { requireAuth } from "../middleware/auth.js";
const router =express.Router();

router.post( "/",protectRoute,handleShorten);

router.get("/:shortId", handleRedirect);

router.get("/analytics/:shortId",requireAuth, handleGetAnalytics);
router.get("/qr/:shortId",requireAuth, handleGenerateQR);


export default router;
