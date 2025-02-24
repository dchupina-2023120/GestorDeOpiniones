import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    comentario: {
      type: String,
      required: true,  // El comentario es obligatorio
    },
    publicacion: {
      type: Schema.Types.ObjectId,
      ref: 'Post',  // Referencia a la colección de publicaciones
      required: true,  // La publicación asociada es obligatoria
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Referencia a la colección de usuarios
      required: true,  // El usuario que hizo el comentario es obligatorio
    },
  },
  {
    timestamps: true,  // Generar automáticamente los campos `createdAt` y `updatedAt`
  }
);

// Crear y exportar el modelo de comentarios
export default model('Comment', commentSchema);
