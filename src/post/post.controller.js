import Publicacion from "../post/post.model.js";
import mongoose from "mongoose";


// Crear una nueva publicación
export const createPost = async (req, res) => {
    try {
        const { titulo, categoria, contenido, user } = req.body;

        if (!titulo || !categoria || !contenido || !user) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newPost = new Publicacion({ titulo, categoria, contenido, user });
        await newPost.save();

        res.status(201).json({ message: "Publicación creada", post: newPost });
    } catch (err) {
        console.error("Error al crear la publicación:", err);
        res.status(500).json({ message: "Error al crear la publicación" });
    }
};


export const updatePost = async (req, res) => {
    try {
        let { id } = req.params; // ID de la publicación
        let datos = req.body; // Datos nuevos de la publicación

        let publicacionActualizada = await Publicacion.findOneAndUpdate(
            { _id: id }, 
            datos, 
            { new: true } // Devuelve la publicación actualizada
        );

        if (!publicacionActualizada) {
            return res.status(404).send({ message: 'No se pudo actualizar la publicación' });
        }

        return res.send({ message: 'Publicación actualizada', publicacionActualizada });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar la publicación' });
    }
};





export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        //const usuarioId = req.user?.id; // Se obtiene el usuario autenticado (JWT)

        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de publicación no válido" });
        }

        // Buscar la publicación
        const post = await Publicacion.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        // // Verificar si el usuario es el dueño de la publicación
        // if (!post.usuario || post.usuario.toString() !== usuarioId) {
        //     return res.status(403).json({ message: "No puedes eliminar esta publicación" });
        // }

        // Eliminar la publicación
        await Publicacion.findByIdAndDelete(id);
        return res.json({ message: "Publicación eliminada exitosamente" });

    } catch (err) {
        console.error("Error al eliminar la publicación:", err);
        return res.status(500).json({ message: "Error interno al eliminar la publicación" });
    }
};

