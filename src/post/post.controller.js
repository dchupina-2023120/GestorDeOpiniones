import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

// Crear una nueva publicación (Cualquier usuario autenticado puede crear una)
export const createPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;

        // Verificar que la categoría existe
        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(404).json({ message: "Categoría no encontrada" });

        const newPost = new Post({
            title,
            category,
            content,
            user: req.user.id  // Se obtiene del token de autenticación
        });

        await newPost.save();
        res.status(201).json({ message: "Publicación creada", post: newPost });
    } catch (err) {
        res.status(500).json({ message: "Error al crear la publicación", err });
    }
};

// Obtener todas las publicaciones
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username") // Mostrar el nombre del usuario que publicó
            .populate("category", "name") // Mostrar el nombre de la categoría
            .sort({ createdAt: -1 }); // Ordenar por fecha (más reciente primero)

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener publicaciones", err });
    }
};

// Obtener una publicación por ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "username")
            .populate("category", "name");

        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener la publicación", err });
    }
};

// Editar una publicación (Solo el autor puede editar)
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

        // Verificar que el usuario es el autor
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No puedes editar esta publicación" });
        }

        const { title, category, content } = req.body;

        // Si se cambia la categoría, verificar que existe
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) return res.status(404).json({ message: "Categoría no encontrada" });
        }

        post.title = title || post.title;
        post.category = category || post.category;
        post.content = content || post.content;

        await post.save();
        res.status(200).json({ message: "Publicación actualizada", post });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar publicación", err });
    }
};

// Eliminar una publicación (Solo el autor puede eliminar)
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

        // Verificar que el usuario es el autor
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No puedes eliminar esta publicación" });
        }

        await post.deleteOne();
        res.status(200).json({ message: "Publicación eliminada" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar publicación", err });
    }
};
