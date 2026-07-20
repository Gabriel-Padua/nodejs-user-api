import { Router } from "express";
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getMeController,
  updateUserRoleController,
} from "../controllers/userController.js";
import authenticator from "../middlewares/authMiddlewares.js";
import owner from "../middlewares/ownerMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";
import ownerOrAdmin from "../middlewares/ownerOrAdmin.js";

const router = Router();

router.post("/", createUserController);
router.post("/login", loginUserController);
router.get("/", authenticator, getUsersController);
router.get("/me", authenticator, getMeController);
router.get("/:id", authenticator, ownerOrAdmin, getUserByIdController);
router.patch("/:id", authenticator, ownerOrAdmin, updateUserController);
router.patch(
  "/:id/role",
  authenticator,
  authorize(ROLES.ADMIN),
  updateUserRoleController,
);
router.delete("/:id", authenticator, ownerOrAdmin, deleteUserController);

export default router;
