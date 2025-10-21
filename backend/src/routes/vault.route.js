import Router from "express";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import {
  isUserHasPinGenerated,
  generatePin,
  getUserVault,
  createVault,
} from "../controllers/vault.controller.js";

const router = Router();
router.use(verifyAuthentication);
router
  .route("/pin")
  .get(isUserHasPinGenerated)
  .patch(generatePin);
router
  .route("/")
  .get(getUserVault)
  .post(createVault);

export default router;
