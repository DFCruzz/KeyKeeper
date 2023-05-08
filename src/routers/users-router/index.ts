import { Router } from "express";
import userController from "@/controllers/users-controller";
import { createUserSchema } from "@/schemas/users-schema";
import { validateBody } from "@/middlewares/validation-middleware";

const userRouter = Router()

userRouter.post("/", validateBody(createUserSchema), userController.createNewUser)

export { userRouter }