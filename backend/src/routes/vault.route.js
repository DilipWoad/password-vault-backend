import Router from "express";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import { isUserHasPinGenerated,generatePin } from "../controllers/vault.controller.js";

const router = Router();

router.route("/pin-exists").get(verifyAuthentication, isUserHasPinGenerated);
router.route("/generate-pin").patch(verifyAuthentication,generatePin);

export default router;
