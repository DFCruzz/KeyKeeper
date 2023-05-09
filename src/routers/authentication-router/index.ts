import { singInPost } from '@/controllers/authentication-controller';
import { validateBody } from '@/middlewares/validation-middleware';
import { signInSchema } from '@/schemas/authentication-schemas';
import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);

export { authenticationRouter };