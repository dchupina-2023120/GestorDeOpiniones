import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Corregido: Usar 'User' en lugar de 'user'
        required: true
    }
});

export default model('Post', postSchema);
