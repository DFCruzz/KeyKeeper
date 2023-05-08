import Joi from 'joi';
import { User } from '@prisma/client';

export const createUserSchema = Joi.object<User>({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
});