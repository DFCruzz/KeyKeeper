import { Router } from "express";
import { validateBody } from "@/middlewares/validation-middleware";
import { createCredentialSchema } from "@/schemas/credentials-schema";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import networkController from "@/controllers/network-controller";

const networkRouter = Router()

networkRouter
    .all("/*", authenticateToken)
    .get("/", networkController.listNetworks)
    .get("/:id", networkController.getNetwork)
    .post("/", validateBody(createCredentialSchema), networkController.postNetwork)
    .delete("/:id", networkController.deleteNetwork)

export { networkRouter }