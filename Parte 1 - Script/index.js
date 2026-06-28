import mongoose from "mongoose";
import readline from "readline";
import { menuPrincipal } from "./MenuPrincipal.js";

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function iniciar() {

    console.log("\n=== Conexión a MongoDB Atlas ===");

    rl.question("Usuario de MongoDB: ", (usuario) => {
        rl.question("Contraseña: ", async (password) => {

            const uri = `mongodb+srv://${usuario}:${password}@cluster0.dsobdqg.mongodb.net/gestionTurnos`;
            try {
                //conexion a la BD con el Uniform Resource Identifier armado con el input
                await mongoose.connect(uri);
                console.log("\nConectado a MongoDB Atlas");
                menuPrincipal();
            } catch (error) {
                console.error("\nError al conectar:", error.message);
                process.exit(1);
            }
        });
    });
}

iniciar();
