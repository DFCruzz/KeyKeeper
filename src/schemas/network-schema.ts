import { CreateNetworkParams } from '@/services/network-service';
import Joi from 'joi';


export const createNetworkSchema = Joi.object<CreateNetworkParams>({
    title: Joi.string().required(),
    network: Joi.string().required,
    password: Joi.string().required(),
})