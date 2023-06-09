import { SignInParams } from '@/services/authorization-service';
import Joi from 'joi';

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
})
