import { Router } from "express";

import userController from "@/controllers/users-controller";

const userRouter = Router()

userRouter.post("/", userController.createNewUser)

export { userRouter }