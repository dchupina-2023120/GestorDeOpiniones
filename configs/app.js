'use strict'


import express from 'express' //Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors' //Acceso al API
//Importamos las rutas de las entidades a trabajar.
import userRoutes from "../src/user/user.routes.js"
import authRoutes from '../src/auth/auth.routes.js'
import categoryRoutes from "../src/category/category.routes.js"
import commentRoutes from "../src/comment/comment.routes.js"
import postRoutes from "../src/post/post.routes.js"


import dotenv from 'dotenv';
import { limiter } from '../middlewares/rate.limit.js'
dotenv.config(); 


const configs = (app)=>{
    app.use(express.json()) //Aceptar y enviar datos en JSON
    app.use(express.urlencoded({extended: false})) 
    app.use(cors()) 
    app.use(helmet()) 
    app.use(morgan('dev')) 
    app.use(limiter)
}

//  Carga de rutas
const routes = (app) => {
    app.use('/api/auth',authRoutes);
    app.use('/api/users', userRoutes); 
    app.use('/api/category',categoryRoutes);
    app.use('/api/comment',commentRoutes);
    app.use('/api/post',postRoutes);
   
};

//Ejecutamos el servidor
export const initServer =  ()=>{
    //Crear instancia de express
    const app = express()//Instancia de express
    try {
                //servidor : app.
        configs(app)
        routes(app)
                //puerto en el que corre: 2636.
        app.listen(process.env.PORT)
                //Impresión sobre el puerto en el que corre.
        console.log(`Server running on port ${process.env.PORT}`)
    } catch (err) {
            //Impresión del fallo de inicialización del servidor, impresión del error.
        console.error('Server init failed', err)
        process.exit(1); // Cierra el proceso si hay error
    }
}