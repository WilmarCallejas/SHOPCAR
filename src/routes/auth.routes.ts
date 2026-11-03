import { Router } from "express";

import {
  registrar,
  login,
  refresh,
  logout
} from "../controllers/auth.controller";

const router = Router();

router.post("/registro", registrar);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;