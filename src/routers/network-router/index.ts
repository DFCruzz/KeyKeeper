import { Router } from "express";
import { validateBody } from "@/middlewares/validation-middleware";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import networkController from "@/controllers/network-controller";
import { createNetworkSchema } from "@/schemas/network-schema";

const networkRouter = Router()

networkRouter
    .all("/*", authenticateToken)
    .get("/", networkController.listNetworks)
    .get("/:id", networkController.getNetwork)
    .post("/", validateBody(createNetworkSchema), networkController.postNetwork)
    .delete("/:id", networkController.deleteNetwork)

export { networkRouter }