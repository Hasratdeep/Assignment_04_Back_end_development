import { Router } from "express";
import { getUser, setCustomClaims } from "../controllers/user.controllers";
import authenticate from "../middleware/authorization";
import authorize from "../middleware/authorization";

const router = Router();

// Get user details by UID
router.get("/:uid", getUser);
router.get("/:uid",authenticate,
  authorize({ hasRole: ["admin"], allowSameUser: true }),
  getUser
);

// Admin route: Set custom claims
router.post("/:uid/claims", setCustomClaims);
router.post("/:uid/claims",authenticate,
  authorize({ hasRole: ["admin"] }),
  setCustomClaims
);

export default router;
