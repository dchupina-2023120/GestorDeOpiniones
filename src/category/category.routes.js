import {Router} from "express"

import { 
    agregarCategoria,
    listarCategoria,
    actulizarCategoria,
    eliminarCategoria
} from "./category.controller.js"

import { validateJwt } from "../../middlewares/validate.jwt.js"


const api = Router()



api.post('/',
    [
       
        validateJwt

    ],
    agregarCategoria
)

api.get('/',listarCategoria)


api.put(
    '/:id',
    [
        validateJwt
    ],
    actulizarCategoria
)

api.delete(
    '/:id',
    [
        validateJwt
    ],
    eliminarCategoria)


export default api