import { Router } from "express"
import { 
    createComment, 
    deleteComment,
    updateComment
} from "../comment/comment.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"


const api = Router()

api.post('/', 
    [
        validateJwt
    ],
    createComment
)

api.put(
    '/:id', 
    [
        validateJwt
    ], 
    updateComment
)

api.delete(
    '/:id', 
    [
        validateJwt
    ], 
    deleteComment
)

export default api