import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);

export default router;
