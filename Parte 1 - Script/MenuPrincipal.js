import mongoose from "mongoose";
import { rl } from "./index.js";   //importa el readline
import {
    crearUsuario,
    listarUsuarios,
    actualizarUsuario,
    bajaUsuario,
    Usuario
} from "./TPI_parte2_mongoose.js";

export function mostrarMenu() {
    console.log("\n..........................");
    console.log("\n=== MENÚ DE USUARIOS ===");
    console.log("1. Crear usuario");
    console.log("2. Listar usuarios");
    console.log("3. Actualizar usuario");
    console.log("4. Dar de baja usuario");
    console.log("5. Salir");
    console.log(".........................");

    rl.question("\nElegí una opción: ", async (opcion) => {
        switch (opcion) {

            case "1":
                await crearUsuarioMenu();
                break;

            case "2":
                await listarUsuariosMenu();
                break;

            case "3":
                await actualizarUsuarioMenu();
                break;

            case "4":
                await bajaUsuarioMenu();
                break;

            case "5":
                console.log("\nSaliendo...");
                rl.close();
                process.exit(0);

            default:
                console.log("\nOpción inválida");
                mostrarMenu();
        }
    });
}

async function crearUsuarioMenu() {
    console.log("\n......................");
     console.log("\nIngrese los datos del usuario nuevo:");
    rl.question("\nNombre: ", (nombre) => {

        // VALIDACIÓN DE INPUT VACÍO
        if (!nombre || nombre.trim() === "") {
            console.log("\nError: el nombre no puede estar vacío.");
            return mostrarMenu();
        }

        rl.question("\nEmail: ", async (email) => {

            
            // VALIDACIÓN DE INPUT VACÍO
            if (!email || email.trim() === "") {
                console.log("\nError: el email no puede estar vacío.");
                return mostrarMenu();
            }

            // VALIDACIÓN DE FORMATO
            const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

            if (!regexEmail.test(email)) {
                console.log("\nError: el email ingresado no es válido.");
                return mostrarMenu();
            }

            // VALIDACIÓN DE EMAIL REPETIDO
            const existente = await Usuario.findOne({ email });
            if (existente) {
                console.log("\nError: ya existe un usuario con ese email");
                console.log("\nEl email ingresado no es válido. No se permiten: espacios, acentos, ñ ni símbolos excepto por ._%+-")
                return mostrarMenu();
            }

            rl.question("\nTeléfono: ", async (telefono) => {

                // VALIDACIÓN DE INPUT VACÍO
                if (!telefono || telefono.trim() === "") {
                    console.log("\nError: el teléfono no puede estar vacío.");
                    return mostrarMenu();
                }

                const nuevo = await crearUsuario({ nombre, email, telefono });
                console.log("\Usuario creado:", nuevo);
                console.log("\n......................");
                mostrarMenu();
            });
        });
    });
}


async function listarUsuariosMenu() {

    console.log("\n......................");
    console.log("\nUsuarios activos:");
    await mostrarUsuarios();
    mostrarMenu();
}

async function mostrarUsuarios() {
    const usuarios = await listarUsuarios();
    console.table(usuarios.map(u => ({
        id: u._id.toString(),
        nombre: u.nombre,
        email: u.email,
        telefono: u.telefono
    })));
}

async function actualizarUsuarioMenu() {
    console.log("\n......................");
        console.log("\n.Seleccione un Usuario para actualizar: ");
    await mostrarUsuarios();

    rl.question("\nIngrese ID del usuario a modificar: ", async (id) => {

        //  Valida que sea un formato de id correcto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("\nEl ID ingresado no es válido. Debe ser un ObjectId de 24 caracteres.");
            return mostrarMenu();
        }

        // Valida la existencia en la base
        const existe = await Usuario.findById(id);
        if (!existe) {
            console.log("\nNo existe ningún usuario con ese ID.");
            return mostrarMenu();
        }

        rl.question("\nNuevo nombre (enter para no cambiar): ", (nombre) => {
            rl.question("\nNuevo email (enter para no cambiar): ", (email) => {
                rl.question("\nNuevo teléfono (enter para no cambiar): ", async (telefono) => {

                    const campos = {};
                    if (nombre) campos.nombre = nombre;
                    if (email) campos.email = email;

                    // VALIDACIÓN DE FORMATO
                    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

                    if (!regexEmail.test(email)) {
                        console.log("\nError: el email ingresado no es válido.");
                        return mostrarMenu();
                    }

                    // VALIDACIÓN DE EMAIL REPETIDO
                    const existente = await Usuario.findOne({ email });
                    if (existente) {
                        console.log("\nError: ya existe un usuario con ese email");
                        console.log("\nEl email ingresado no es válido. No se permiten: espacios, acentos, ñ ni símbolos excepto por ._%+-")
                        return mostrarMenu();
                    }
                    if (telefono) campos.telefono = telefono;

                    const actualizado = await actualizarUsuario(id, campos);
                    console.log("\nUsuario actualizado:", actualizado);
                    mostrarMenu();
                });
            });
        });
    });
}

async function bajaUsuarioMenu() {
    console.log("\n......................");
    console.log("\n.Seleccione un Usuario para dar de baja : ");

    await mostrarUsuarios()
    rl.question("\nIngrese el ID del usuario a dar de baja: ", async (id) => {

        //  Valida que sea un formato de id correcto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("\nEl ID ingresado no es válido. Debe ser un ObjectId de 24 caracteres.");
            return mostrarMenu();
        }

        // Valida la existencia en la base
        const existe = await Usuario.findById(id);
        if (!existe) {
            console.log("\nNo existe ningún usuario con ese ID.");
            return mostrarMenu();
        }


        const baja = await bajaUsuario(id);
        console.log("\nUsuario dado de baja:", baja);
        mostrarMenu();
    });
}
