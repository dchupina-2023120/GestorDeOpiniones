import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

// Crear un comentario (Cualquier usuario puede comentar)
export const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;

        // Verificar que la publicación existe
        const postExists = await Post.findById(postId);
        if (!postExists) return res.status(404).json({ message: "Publicación no encontrada" });

        const newComment = new Comment({
            content,
            user: req.user.id,  // Se obtiene del token
            post: postId
        });

        await newComment.save();
        res.status(201).json({ message: "Comentario agregado", comment: newComment });
    } catch (err) {
        res.status(500).json({ message: "Error al agregar comentario", err });
    }
};

// Obtener comentarios de una publicación
export const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate("user", "username") // Para mostrar el nombre del usuario
            .sort({ createdAt: -1 }); // Ordenados por fecha, el más reciente primero

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener comentarios", err });
    }
};

// Editar un comentario (Solo el autor puede editar)
export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

        // Validar que el usuario sea el autor del comentario
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No puedes editar este comentario" });
        }

        comment.content = req.body.content; // Actualizar contenido
        await comment.save();

        res.status(200).json({ message: "Comentario actualizado", comment });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar comentario", err });
    }
};

// Eliminar un comentario (Solo el autor puede eliminar)
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

        // Validar que el usuario sea el autor del comentario
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No puedes eliminar este comentario" });
        }

        await comment.deleteOne();
        res.status(200).json({ message: "Comentario eliminado" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar comentario", err });
    }
};
