import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { createComment, getCommentsByPost, updateComment, deleteComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/", authenticate, createComment); // Solo usuarios autenticados pueden comentar
router.get("/:postId", getCommentsByPost); // Obtener comentarios de una publicación
router.put("/:id", authenticate, updateComment); // Solo el autor puede editar su comentario
router.delete("/:id", authenticate, deleteComment); // Solo el autor puede eliminar su comentario

export default router;
