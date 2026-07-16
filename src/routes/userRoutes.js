import { Router } from "express";
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getMeController,
} from "../controllers/userController.js";
import authenticator from "../middlewares/authMiddlewares.js";
import owner from "../middlewares/ownerMiddleware.js";

const router = Router();

router.post("/", createUserController);
router.post("/login", loginUserController);
router.get("/", authenticator, getUsersController);
router.get("/me", authenticator, getMeController);
router.get("/:id", authenticator, getUserByIdController);
router.patch("/:id", authenticator, owner, updateUserController);
router.delete("/:id", authenticator, owner, deleteUserController);

export default router;
