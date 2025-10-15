// import { Router } from "express";
// import {
//   loginUser,
//   logoutUser,
//   registerUser,
// } from "../controllers/auth.controller.js";
// import { verifyJwt } from "../middlewares/auth.middleware.js";

// const router = Router();

// router.route("/login").post(loginUser);
// router.route("/register").post(registerUser);

// //verify route do use middleware
// router.route("/logout").post( verifyJwt,logoutUser);

// export default router;


import Router from "express";
import {loginUser, logoutUser, refreshAccessTokens, registerUser} from "../controllers/auth.controller.js"
import { verifyAuthentication } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(verifyAuthentication, logoutUser);
router.route("/register").post(registerUser);
router.route("/refresh-token").post(verifyAuthentication,refreshAccessTokens);
export default router;