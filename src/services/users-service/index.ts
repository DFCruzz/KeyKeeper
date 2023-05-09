import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { duplicatedEmailError } from "@/errors";
import userRepository from "@/repositories/users-repository";

export type CreateUserParams = Pick<User, "email" | "password">
const SALT_ROUNDS = 12

async function validateEmail(email: string) {
    const isEmailValid = await userRepository.findByEmail(email);
    if(isEmailValid) throw duplicatedEmailError();
};

async function createUser({email, password}: CreateUserParams): Promise<User> {
    await validateEmail(email);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return userRepository.createUser({email, password: hashedPassword});
};

const userService = {
    createUser,
}

export default userService