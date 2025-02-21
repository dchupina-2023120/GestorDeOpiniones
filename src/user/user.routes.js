import { Router } from "express";
import { 
        deleteUser, 
        update
} from "./user.controller.js";
import { UserValidator } from "../../middlewares/validators.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

api.get("/profile", authenticate, getProfile); // Obtener perfil del usuario autenticado


api.put("/:id", 
        [
                validateJwt, 
        ], 
        update
); 



api.delete("/:id", deleteUser); 



export default api
