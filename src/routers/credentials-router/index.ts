import { Router } from "express";
import { validateBody } from "@/middlewares/validation-middleware";
import credentialController from "@/controllers/credentials-controller";
import { createCredentialSchema } from "@/schemas/credentials-schema";
import { authenticateToken } from "@/middlewares/authentication-middleware";

const credentialRouter = Router()

credentialRouter
    .all("/*", authenticateToken)
    .get("/", credentialController.listCredentials)
    .get("/:id", credentialController.getCredential)
    .post("/", validateBody(createCredentialSchema), credentialController.postCredential)
    .delete("/:id", credentialController.deleteCredential)



