import { Router } from "express";
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  loginUserController,
} from "../controllers/userController.js";
import authenticator from "../middlewares/authMiddlewares.js";

const router = Router();

router.post("/", createUserController);
router.post("/login", loginUserController);
router.get("/", authenticator, getUsersController);
router.get("/:id", getUserByIdController);
router.patch("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
