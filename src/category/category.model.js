import { Schema, model} from 'mongoose'

const CategorySchema = Schema(
    {
    nombre:{
        type:String,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    }
}
)

export default model('Category',CategorySchema)