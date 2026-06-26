import mongoose from "mongoose";
import { mostrarMenu } from "./MenuPrincipal.js";

async function iniciar() {
    try {
        //conexion a la Base de Datos
        const uri = "mongodb+srv://TuturnoAdmin:Admin123@cluster0.dsobdqg.mongodb.net/gestionTurnos";
        await mongoose.connect(uri);

        console.log("Conectado a MongoDB Atlas");

        //Carga el menu
        mostrarMenu();

    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }
}

iniciar();
