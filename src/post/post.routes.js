import express from "express";
import { 
    createPost, 
    updatePost, 
    deletePost 
} from "../post/post.controller.js";

import { validateJwt } from "../../middlewares/validate.jwt.js"
const router = express.Router();

router.post('/', 
    [
        validateJwt
    ],
    createPost
)       
router.put(
    '/:id',
    [
        validateJwt
    ], 
    updatePost
);       
router.delete(
    "/:id",
    [
        validateJwt
    ], 
    deletePost
);   
export default router;
