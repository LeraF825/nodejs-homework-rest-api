import express from "express";
import authControllers from "../../controllers/auth-controllers.js";
import usersSchemas from "../../schemas/users-schemas.js";
import {validateBody} from "../../decorators/index.js";
import {authenticate} from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post( "/register",validateBody(usersSchemas.userRegisterSchema),authControllers.register);

authRouter.post("/login",validateBody(usersSchemas.userLoginSchema),authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;