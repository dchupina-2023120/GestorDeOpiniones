import Comment from "../comment/comment.model.js";
import Post from "../post/post.model.js";
import User from "../user/user.model.js";



// Crear un nuevo comentario
export const createComment = async (req, res) => {
    try {
        const { comentario, publicacion, user } = req.body;

        if (!comentario || !publicacion || !user) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newComment = new Comment({ comentario, publicacion, user });
        await newComment.save();

        res.status(201).json({ message: "Comentario creado", comment: newComment });
    } catch (err) {
        console.error("Error al crear el comentario:", err);
        res.status(500).json({ message: "Error al crear el comentario" });
    }
};




// Actualizar un comentario
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario } = req.body;
       // const { id: Uid } = req.user;

        // Verificar si el comentario existe
        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

        //  // Verificar que el usuario sea el autor del comentario
        //  if (comment.user.toString() !== Uid) {
        //      return res.status(403).json({ message: "No puedes editar un comentario que no te pertenece" });
        //  }

        // Actualizar el comentario
        comment.comentario = comentario;
        await comment.save();

        res.json({
            message: "Comentario actualizado",
            comment,
        });
    } catch (err) {
        console.error("Error al actualizar el comentario:", err);
        res.status(500).json({ message: "Error al actualizar el comentario", err });
    }
};

// Eliminar un comentario
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;

        // Verificar si el comentario existe
        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

        // // Verificar que el usuario sea el autor del comentario
        // if (comment.user.toString() !== userId) {
        //     return res.status(403).json({ message: "No puedes eliminar un comentario que no te pertenece" });
        // }


        res.json({ message: "Comentario eliminado" });
    } catch (err) {
        console.error("Error al eliminar el comentario:", err);
        res.status(500).json({ message: "Error al eliminar el comentario", err });
    }
};
