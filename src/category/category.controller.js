import post from '../post/post.model.js'
import category from '../category/category.model.js'


export const agregarCategoria = async(req,res)=>{
    try {
        let datos = req.body
        let categoria = new category(datos)
        await categoria.save()
        return res.send({message: 'Se agrego exitosamente ',categoria})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'No se pudo agregar Categoria'})
    }
}


export const listarCategoria = async(req,res)=>{
    try {
        let categoria  = await category.find()
        if(categoria.length === 0) return res.status(400).send({message: 'No funciono'})
        return res.send({categoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'No hay categorias existentes'})
    }
}


export const actulizarCategoria = async(req,res)=>{
    try {
        let {id} = req.params
        let datos = req.body
        let actulizarCategoria = await category.findOneAndUpdate(
            {_id: id},
            datos,
            {new: true}

        )
        if(!actulizarCategoria)return res.status(401).send({message: 'No se pudieron actulizar los datos'})
        return res.send({message:'Actualizado',actulizarCategoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error al actulizar'})
    }
}

export const eliminarCategoria = async (req, res) => {
    try {
        let { id } = req.params
        let eliminarCategoria = await category.findOneAndDelete({ _id: id })
        if (!eliminarCategoria) return res.status(404).send({ 
            message: 'No se encontró la categoría y no se eliminó' 
        })
        
        await porDefecto(id, res)
        return res.send({ message: `La categoría ${eliminarCategoria.categoria} fue eliminada` })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar' })
    }
}


const agregarCategoriasPorDefecto = async () => {
    const categoriasExistentes = await category.countDocuments();
    if (categoriasExistentes === 0) {
      const categoriasPorDefecto = [
        {
            nombre: "Musica",
            descripcion: "Categoria para musica"
        },
      ];
   
      try {
        await category.insertMany(categoriasPorDefecto);
        console.log("Categorias por defecto agregados");
      } catch (error) {
        console.error("Error al agregar categorias por defecto: ", error);
      }
    }
  };
  agregarCategoriasPorDefecto();