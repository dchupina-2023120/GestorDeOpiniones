import Category from "../models/category.model.js";
import Post from "../models/post.model.js";

// Verificar si el usuario es ADMIN
const isAdmin = (role) => role === "ADMIN";

// Crear una nueva categoría (Solo ADMIN)
export const createCategory = async (req, res) => {
    try {
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden crear categorías." });
        }

        const { name } = req.body;
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ message: "La categoría ya existe" });
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json({ message: "Categoría creada", category: newCategory });
    } catch (err) {
        res.status(500).json({ message: "Error al crear la categoría", err });
    }
};

// Obtener todas las categorías (Disponible para todos)
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener categorías", err });
    }
};

// Editar una categoría (Solo ADMIN)
export const updateCategory = async (req, res) => {
    try {
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden editar categorías." });
        }

        const { name } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({ message: "Categoría actualizada", category: updatedCategory });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar categoría", err });
    }
};

// Eliminar una categoría (Solo ADMIN)
export const deleteCategory = async (req, res) => {
    try {
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar categorías." });
        }

        // Verificar si hay publicaciones en esta categoría
        const categoryInUse = await Post.findOne({ category: req.params.id });
        if (categoryInUse) {
            return res.status(400).json({ message: "No se puede eliminar la categoría porque está en uso en una publicación." });
        }

        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({ message: "Categoría eliminada" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar categoría", err });
    }
};
