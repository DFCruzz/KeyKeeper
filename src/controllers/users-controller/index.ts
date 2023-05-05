import { Response, Request, NextFunction } from "express";
import userService from "@/services/users- service";
import httpStatus from "http-status";

async function createNewUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
        const newUser = await userService.createUser({ email, password });
        const createdUser = {
            id: newUser.id,
            email: newUser.email
        };

        return res.status(httpStatus.CREATED).send(createdUser);

    } catch (error) {
        next(error);
    }
}

const userController = {
    createNewUser
}

export default userController