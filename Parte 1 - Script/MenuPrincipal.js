import mongoose from "mongoose";
import { rl } from "./index.js";   //importa el readline
import {
    Usuario, crearUsuario, listarUsuarios, actualizarUsuario, bajaUsuario,
    Profesional, crearProfesional, listarProfesionales, actualizarProfesional, bajaProfesional,
    Servicio, crearServicio, listarServicios, listarServiciosPorProfesional, actualizarServicio, bajaServicio,
    Turno, crearTurno, listarTurnos, actualizarTurno, bajaTurno
} from "./TPI_parte2_mongoose.js";

export function menuPrincipal() {
    console.log("\n==============================");
    console.log("=== MENÚ PRINCIPAL ===");
    console.log("1. Gestión de Usuarios");
    console.log("2. Gestión de Profesionales");
    console.log("3. Gestión de Servicios");
    console.log("4. Gestión de Turnos");
    console.log("5. Salir");
    console.log("==============================");

    rl.question("\nElegí una opción: ", async (opcion) => {
        switch (opcion) {
            case "1":
                await mostarMenuUsuarios();
                break;
            case "2":
                await mostrarMenuProfesionales();
                break;
            case "3":
                await mostrarMenuServicios();
                break;
                break;
            case "4":
                mostrarMenuTurnos();
                break;
            case "5":
                console.log("\nSaliendo...");
                rl.close();
                process.exit(0);
            default:
                console.log("\nOpción inválida");
                menuPrincipal();
        }
    });
}

export function mostarMenuUsuarios() {
    console.log("\n..........................");
    console.log("\n=== MENÚ DE USUARIOS ===");
    console.log("1. Crear usuario");
    console.log("2. Listar usuarios");
    console.log("3. Actualizar usuario");
    console.log("4. Dar de baja usuario");
    console.log("5. Volver al menú principal");
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
                return menuPrincipal(); // vuelve al menú principal

            default:
                console.log("\nOpción inválida");
                mostarMenuUsuarios();
        }
    });
}

export function mostrarMenuProfesionales() {
    console.log("\n..........................");
    console.log("\n=== MENÚ DE PROFESIONALES ===");
    console.log("1. Crear profesional");
    console.log("2. Listar profesionales");
    console.log("3. Actualizar profesional");
    console.log("4. Dar de baja profesional");
    console.log("5. Volver al menú principal");
    console.log(".........................");

    rl.question("\nElegí una opción: ", async (opcion) => {
        switch (opcion) {
            case "1":
                await crearProfesionalMenu();
                break;
            case "2":
                await listarProfesionalesMenu();
                break;
            case "3":
                await actualizarProfesionalMenu();
                break;
            case "4":
                await bajaProfesionalMenu();
                break;
            case "5":
                return menuPrincipal(); // vuelve al menú principal
            default:
                console.log("\nOpción inválida");
                mostrarMenuProfesionales();
        }
    });
}


export async function mostrarMenuServicios() {
    console.log("\n==============================");
    console.log("=== MENÚ DE SERVICIOS ===");
    console.log("1. Crear servicio");
    console.log("2. Listar servicios");
    console.log("3. Actualizar servicio");
    console.log("4. Dar de baja servicio");
    console.log("5. Volver al menú principal");
    console.log("==============================");

    rl.question("\nElegí una opción: ", async (opcion) => {
        switch (opcion) {
            case "1":
                await mostrarProfesionales();
                await crearServicioMenu();
                break;
            case "2":
                await mostrarServicios();
                mostrarMenuServicios();
                break;
            case "3":
                await mostrarServicios();
                await actualizarServicioMenu();
                break;
            case "4":
                await mostrarServicios();
                rl.question("\nIngrese ID del servicio a dar de baja: ", async (id) => {
                    const actualizado = await bajaServicio(id);
                    console.log("\nServicio dado de baja:", actualizado);
                    mostrarMenuServicios();
                });
                break;
            case "5":
                return menuPrincipal(); // vuelve al menú principal
            default:
                console.log("\nOpción inválida");
                mostrarMenuServicios();
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
            return mostarMenuUsuarios();
        }

        rl.question("\nEmail: ", async (email) => {


            // VALIDACIÓN DE INPUT VACÍO
            if (!email || email.trim() === "") {
                console.log("\nError: el email no puede estar vacío.");
                return mostarMenuUsuarios();
            }

            // VALIDACIÓN DE FORMATO
            const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

            if (!regexEmail.test(email)) {
                console.log("\nError: el email ingresado no es válido.");
                return mostarMenuUsuarios();
            }

            // VALIDACIÓN DE EMAIL REPETIDO
            const existente = await Usuario.findOne({ email });
            if (existente) {
                console.log("\nError: ya existe un usuario con ese email");
                console.log("\nEl email ingresado no es válido. No se permiten: espacios, acentos, ñ ni símbolos excepto por ._%+-")
                return mostarMenuUsuarios();
            }

            rl.question("\nTeléfono: ", async (telefono) => {

                // VALIDACIÓN DE INPUT VACÍO
                if (!telefono || telefono.trim() === "") {
                    console.log("\nError: el teléfono no puede estar vacío.");
                    return mostarMenuUsuarios();
                }

                const nuevo = await crearUsuario({ nombre, email, telefono });
                console.log("\Usuario creado:", nuevo);
                console.log("\n......................");
                mostarMenuUsuarios();
            });
        });
    });
}

//CRUD USUARIOS

async function listarUsuariosMenu() {

    console.log("\n......................");
    console.log("\nUsuarios activos:");
    await mostrarUsuarios();
    mostarMenuUsuarios();
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

export async function mostrarMenuTurnos() {
    console.log("\n==============================");
    console.log("=== MENÚ DE TURNOS ===");
    console.log("1. Crear turno");
    console.log("2. Listar turnos");
    console.log("3. Actualizar turno");
    console.log("4. Dar de baja turno");
    console.log("5. Volver al menú principal");
    console.log("==============================");

    rl.question("\nElegí una opción: ", async (opcion) => {
        switch (opcion) {
            case "1":
                await crearTurnoMenu();
                break;
            case "2":
                await listarTurnosMenu();
                break;
            case "3":
                await actualizarTurnoMenu();
                break;
            case "4":
                await bajaTurnoMenu();
                break;
            case "5":
                return menuPrincipal();
            default:
                console.log("\nOpción inválida");
                mostrarMenuTurnos();
        }
    });
}

async function actualizarUsuarioMenu() {
    console.log("\n......................");
    console.log("\nSeleccione un Usuario para actualizar: ");
    await mostrarUsuarios();

    rl.question("\nIngrese ID del usuario a modificar: ", async (id) => {

        //  Valida que sea un formato de id correcto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("\nEl ID ingresado no es válido. Debe ser un ObjectId de 24 caracteres.");
            return mostarMenuUsuarios();
        }

        // Valida la existencia en la base
        const existe = await Usuario.findById(id);
        if (!existe) {
            console.log("\nNo existe ningún usuario con ese ID.");
            return mostarMenuUsuarios();
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
                        return mostarMenuUsuarios();
                    }

                    // VALIDACIÓN DE EMAIL REPETIDO
                    const existente = await Usuario.findOne({ email });
                    if (existente) {
                        console.log("\nError: ya existe un usuario con ese email");
                        console.log("\nEl email ingresado no es válido. No se permiten: espacios, acentos, ñ ni símbolos excepto por ._%+-")
                        return mostarMenuUsuarios();
                    }
                    if (telefono) campos.telefono = telefono;

                    const actualizado = await actualizarUsuario(id, campos);
                    console.log("\nUsuario actualizado:", actualizado);
                    mostarMenuUsuarios();
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
            return mostarMenuUsuarios();
        }

        // Valida la existencia en la base
        const existe = await Usuario.findById(id);
        if (!existe) {
            console.log("\nNo existe ningún usuario con ese ID.");
            return mostarMenuUsuarios();
        }


        const baja = await bajaUsuario(id);
        console.log("\nUsuario dado de baja:", baja);
        mostarMenuUsuarios();
    });
}

//CRUD PROFESIONALES

// Crear profesional
async function crearProfesionalMenu() {
    console.log("\n......................");
    console.log("\nIngrese los datos del nuevo profesional:");

    rl.question("\nNombre: ", (nombre) => {
        if (!nombre || nombre.trim() === "") {
            console.log("\nError: el nombre no puede estar vacío.");
            return mostrarMenuProfesionales();
        }

        rl.question("\nEspecialidad: ", async (especialidad) => {
            if (!especialidad || especialidad.trim() === "") {
                console.log("\nError: la especialidad no puede estar vacía.");
                return mostrarMenuProfesionales();
            }

            const horarios = await ingresarHorariosProfesional();

            const nuevo = await crearProfesional({
                nombre,
                especialidad,
                horarios,
                activo: true
            });

            console.log("\nProfesional creado:", nuevo);
            mostrarMenuProfesionales();


        });
    });
}

async function ingresarHorariosProfesional() {
    const horarios = [];

    async function pedirHorario() {
        const dia = await inputDia();
        const desde = await inputHoraMinuto("\nDesde (HH:mm): ");
        const hasta = await inputHoraMinuto("\nHasta (HH:mm): ");

        horarios.push({ dia, desde, hasta });

        return new Promise((resolve) => {
            rl.question("\n¿Desea ingresar otro día y horario? (1. sí / 2. no): ", async (opcion) => {
                if (opcion === "1") {
                    const masHorarios = await pedirHorario();
                    resolve(masHorarios);
                } else {
                    resolve(horarios);
                }
            });
        });
    }

    return await pedirHorario();

}

// Listar profesionales
async function listarProfesionalesMenu() {
    console.log("\n......................");
    console.log("\nProfesionales activos:");
    await mostrarProfesionales();
    mostrarMenuProfesionales();
}

async function mostrarProfesionales() {
    const profesionales = await listarProfesionales();

    if (!profesionales || profesionales.length === 0) {
        console.log("\nNo hay profesionales activos.");
        return;
    }

    console.table(profesionales.map(p => ({
        id: p._id.toString(),
        nombre: p.nombre,
        especialidad: p.especialidad,
        horarios: Array.isArray(p.horarios)
            ? p.horarios.map(h => `${h.dia} ${h.desde}-${h.hasta}`).join(", ")
            : "Sin horarios"
    })));
}



async function actualizarProfesionalMenu() {
    console.log("\n......................");
    console.log("\nSeleccione un Profesional para actualizar:");
    await mostrarProfesionales();

    rl.question("\nIngrese ID del profesional a modificar: ", async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("\nEl ID ingresado no es válido.");
            return mostrarMenuProfesionales();
        }

        const profesional = await Profesional.findById(id);
        if (!profesional) {
            console.log("\nNo existe ningún profesional con ese ID.");
            return mostrarMenuProfesionales();
        }

        rl.question("\nNuevo nombre (enter para no cambiar): ", (nombre) => {
            rl.question("\nNueva especialidad (enter para no cambiar): ", async (especialidad) => {
                rl.question("\n¿Cambiar días y horarios? (1. sí / 2. no): ", async (opcion) => {

                    let nuevosHorarios;

                    if (opcion === "1") {
                        const nuevosHorarios = await ingresarHorariosProfesional(); // helper que pide varios horarios
                    } else {
                        nuevosHorarios = profesional.horarios; // mantener los actuales
                    }

                    const campos = {
                        nombre: nombre && nombre.trim() !== "" ? nombre : profesional.nombre,
                        especialidad: especialidad && especialidad.trim() !== "" ? especialidad : profesional.especialidad,
                        horarios: nuevosHorarios
                    };

                    const actualizado = await actualizarProfesional(id, campos);
                    console.log("\nProfesional actualizado:", actualizado);
                    mostrarMenuProfesionales();
                });
            });
        });
    });
}




// Baja lógica
async function bajaProfesionalMenu() {
    console.log("\n......................");
    console.log("\nSeleccione un Profesional para dar de baja:");
    await mostrarProfesionales();

    rl.question("\nIngrese el ID del profesional a dar de baja: ", async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("\nEl ID ingresado no es válido.");
            return mostrarMenuProfesionales();
        }

        const profesional = await Profesional.findById(id);
        if (!profesional) {
            console.log("\nNo existe ningún profesional con ese ID.");
            return mostrarMenuProfesionales();
        }

        const baja = await bajaProfesional(id);
        console.log("\nProfesional dado de baja:", baja);
        mostrarMenuProfesionales();
    });
}

//INPUTS
async function inputDia(pregunta = "\nDía de atención: ") {
    return new Promise((resolve) => {
        const diasValidos = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

        const ask = () => {
            rl.question(pregunta, (dia) => {
                const normalizado = dia.trim().toLowerCase();
                if (diasValidos.includes(normalizado)) {
                    resolve(normalizado);
                } else {
                    console.log("\nError: día inválido. Debe ser uno de:", diasValidos.join(", "));
                    ask(); // repetir hasta que sea válido
                }
            });
        };
        ask();
    });
}

async function inputCambiarDia(pregunta = "\nNuevo día (enter para no cambiar): ") {
    return new Promise((resolve) => {
        const diasValidos = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

        const ask = () => {
            rl.question(pregunta, (dia) => {
                const normalizado = dia.trim().toLowerCase();

                if (normalizado === "") {
                    //Enter → no cambiar
                    resolve(null);
                } else if (diasValidos.includes(normalizado)) {
                    // Día válido
                    resolve(normalizado);
                } else {
                    console.log("\nError: día inválido. Debe ser uno de:", diasValidos.join(", "));
                    ask(); // repetir hasta que sea válido
                }
            });
        };
        ask();
    });
}


async function inputHoraMinuto(pregunta = "\nHora (HH:mm): ") {
    return new Promise((resolve) => {
        const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

        const ask = () => {
            rl.question(pregunta, (hora) => {
                if (regexHora.test(hora.trim())) {
                    resolve(hora.trim());
                } else {
                    console.log("\nError: formato inválido. Debe ser HH:mm (ejemplo: 08:30, 14:00).");
                    ask(); // repetir hasta que sea válido
                }
            });
        };
        ask();
    });
}

//Verifica input pero permite vacio para mantener
async function inputCambiarHoraMinuto(pregunta = "\nHora (HH:mm, enter para no cambiar): ") {
    return new Promise((resolve) => {
        const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

        const ask = () => {
            rl.question(pregunta, (hora) => {
                const valor = hora.trim();

                if (valor === "") {
                    //Enter no cambiar
                    resolve(null);
                } else if (regexHora.test(valor)) {
                    //Hora válida
                    resolve(valor);
                } else {
                    console.log("\nError: formato inválido. Debe ser HH:mm (ejemplo: 08:30, 14:00).");
                    ask(); // repetir hasta que sea válido
                }
            });
        };
        ask();
    });
}

// Crear servicio
async function crearServicioMenu() {
    console.log("\n......................");
    console.log("\nIngrese los datos del nuevo servicio:");

    rl.question("\nID del profesional: ", async (profesionalId) => {
        if (!mongoose.Types.ObjectId.isValid(profesionalId)) {
            console.log("\nError: el ID del profesional no es válido.");
            return mostrarMenuServicios();
        }

        const profesional = await Profesional.findById(profesionalId);
        if (!profesional) {
            console.log("\nNo existe ningún profesional con ese ID.");
            return mostrarMenuServicios();
        }

        rl.question("\nNombre del servicio: ", (nombre) => {
            if (!nombre || nombre.trim() === "") {
                console.log("\nError: el nombre no puede estar vacío.");
                return mostrarMenuServicios();
            }

            rl.question("\nDuración en minutos: ", (duracion) => {
                const duracionNum = parseInt(duracion, 10);
                if (isNaN(duracionNum) || duracionNum <= 0) {
                    console.log("\nError: la duración debe ser un número positivo.");
                    return mostrarMenuServicios();
                }

                rl.question("\nPrecio: ", async (precio) => {
                    const precioNum = parseInt(precio, 10);
                    if (isNaN(precioNum) || precioNum <= 0) {
                        console.log("\nError: el precio debe ser un número positivo.");
                        return mostrarMenuServicios();
                    }

                    const nuevo = await crearServicio({
                        profesionalId,
                        nombre,
                        duracion: duracionNum,
                        precio: precioNum,
                        activo: true
                    });

                    console.log("\nServicio creado:", nuevo);
                    mostrarMenuServicios();
                });
            });
        });
    });
}

async function mostrarServicios() {
    const servicios = await listarServicios();
    console.log("\n=== SERVICIOS ACTIVOS ===");
    if (servicios.length === 0) {
        console.log("\nNo hay servicios activos.");
    } else {
        console.table(
            servicios.map((s) => ({
                ID: s._id.toString(),
                Profesional: `${s.profesionalId?.nombre} (${s.profesionalId?.especialidad})`,
                Nombre: s.nombre,
                Duración: `${s.duracion} min`,
                Precio: `$${s.precio}`
            }))
        );
    }
}


async function actualizarServicioMenu() {
    rl.question("\nIngrese ID del servicio a modificar: ", async (id) => {
        const servicio = await Servicio.findById(id);
        if (!servicio) {
            console.log("\nNo existe ningún servicio con ese ID.");
            return mostrarMenuServicios();
        }

        rl.question("\nNuevo nombre (enter para no cambiar): ", (nombre) => {
            rl.question("\nNueva duración en minutos (enter para no cambiar): ", (duracion) => {
                rl.question("\nNuevo precio (enter para no cambiar): ", async (precio) => {

                    const campos = {};
                    if (nombre && nombre.trim() !== "") campos.nombre = nombre;

                    if (duracion && duracion.trim() !== "") {
                        const duracionNum = parseInt(duracion, 10);
                        if (!isNaN(duracionNum) && duracionNum > 0) {
                            campos.duracion = duracionNum;
                        } else {
                            console.log("\nError: la duración debe ser un número positivo.");
                            return mostrarMenuServicios();
                        }
                    }

                    if (precio && precio.trim() !== "") {
                        const precioNum = parseInt(precio, 10);
                        if (!isNaN(precioNum) && precioNum > 0) {
                            campos.precio = precioNum;
                        } else {
                            console.log("\nError: el precio debe ser un número positivo.");
                            return mostrarMenuServicios();
                        }
                    }

                    const actualizado = await actualizarServicio(id, campos);
                    console.log("\nServicio actualizado:", actualizado);
                    mostrarMenuServicios();
                });
            });
        });
    });
}

//Menus de turnos

async function listarTurnosMenu() {
    const turnos = await listarTurnos();

    mostrarTurnos(turnos);

    mostrarMenuTurnos();
}

function mostrarTurnos(turnos) {
    if (!turnos || turnos.length === 0) {
        console.log("\nNo hay turnos activos.");
        return;
    }

    console.table(
        turnos.map((t) => ({
            ID: t._id.toString(),
            Usuario: `${t.usuarioId?.nombre} (${t.usuarioId?.email})`,
            Profesional: `${t.profesionalId?.nombre} (${t.profesionalId?.especialidad})`,
            Servicio: t.servicioSnapshot?.nombre || "N/A",
            Duración: t.servicioSnapshot?.duracion ? `${t.servicioSnapshot.duracion} min` : "N/A",
            Precio: t.servicioSnapshot?.precio ? `$${t.servicioSnapshot.precio}` : "N/A",
            Estado: t.estado,
            Fecha: t.fechaInicio.toLocaleString(),
            Observaciones: t.observaciones || ""
        }))
    );
}

async function crearTurnoMenu() {
    console.log("\n=== CREAR TURNO ===");

    const usuarios = await mostrarUsuarios();

    rl.question("\nIngrese ID del usuario: ", async (usuarioId) => {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            console.log("\nError: el ID de usuario no es válido.");
            return mostrarMenuTurnos();
        }

        const profesionales = await mostrarProfesionales();
        rl.question("\nIngrese ID del profesional: ", async (profesionalId) => {
            if (!mongoose.Types.ObjectId.isValid(profesionalId)) {
                console.log("\nError: el ID de profesional no es válido.");
                return mostrarMenuTurnos();
            }

            // Mostrar solo servicios de ese profesional
            const servicios = await listarServiciosPorProfesional(profesionalId);
            if (!servicios || servicios.length === 0) {
                console.log("\nEste profesional no tiene servicios activos.");
                return mostrarMenuTurnos();
            }

            console.table(
                servicios.map(s => ({
                    ID: s._id.toString(),
                    Nombre: s.nombre,
                    Duración: `${s.duracion} min`,
                    Precio: `$${s.precio}`
                }))
            );

            rl.question("\nIngrese ID del servicio: ", async (servicioId) => {
                if (!mongoose.Types.ObjectId.isValid(servicioId)) {
                    console.log("\nError: el ID de servicio no es válido.");
                    return mostrarMenuTurnos();
                }

                rl.question("\nIngrese fecha (YYYY-MM-DD, ejemplo: 2026-07-01): ", (fechaStr) => {
                    rl.question("\nIngrese hora (HH:mm, ejemplo: 14:30): ", (horaStr) => {
                        const fechaInicioStr = `${fechaStr} ${horaStr}`;
                        const fechaInicio = new Date(fechaInicioStr);

                        if (isNaN(fechaInicio.getTime())) {
                            console.log("\nError: formato inválido. Ejemplo correcto: 2026-07-01 14:30");
                            return mostrarMenuTurnos();
                        }
                        rl.question("\nObservaciones: ", (observaciones) => {
                            rl.question("\nEstado (1. pendiente, 2. confirmado, 3. cancelado): ", async (estadoOpcion) => {
                                let estado;
                                switch (estadoOpcion) {
                                    case "1": estado = "pendiente"; break;
                                    case "2": estado = "confirmado"; break;
                                    case "3": estado = "cancelado"; break;
                                    default:
                                        console.log("\nError: opción inválida para estado.");
                                        return mostrarMenuTurnos();
                                }

                                try {
                                    const fechaInicio = new Date(fechaInicioStr);

                                    const nuevoTurno = await crearTurno({
                                        usuarioId,
                                        profesionalId,
                                        servicioId,
                                        fechaInicio,
                                        observaciones,
                                        estado
                                    });

                                    console.log("\nTurno creado:");
                                    console.log(nuevoTurno);
                                } catch (error) {
                                    console.error("\nError al crear turno:", error.message);
                                }

                                mostrarMenuTurnos();
                            });
                        });
                    });
                });
            });
        });
    });
}

async function actualizarTurnoMenu() {

    console.log("\nTurnos Activos: ")
    const turnos = await listarTurnos();
    mostrarTurnos(turnos);

    rl.question("\nIngrese ID del turno a modificar: ", async (id) => {
        const existe = await Turno.findById(id);
        if (!existe) {
            console.log("\nNo existe ningún turno con ese ID.");
            return mostrarMenuTurnos();
        }

        rl.question("\nNueva fecha (YYYY-MM-DD, enter para no cambiar): ", (fechaStr) => {
            rl.question("\nNueva hora (HH:mm, enter para no cambiar): ", (horaStr) => {
                let nuevaFecha = existe.fechaInicio; // valor actual por defecto

                if (fechaStr.trim() !== "" && horaStr.trim() !== "") {
                    const fechaInicioStr = `${fechaStr} ${horaStr}`;
                    const fechaInicio = new Date(fechaInicioStr);
                    if (isNaN(fechaInicio.getTime())) {
                        console.log("\nError: formato inválido. Ejemplo correcto: 2026-07-01 14:30");
                        return mostrarMenuTurnos();
                    }
                    nuevaFecha = fechaInicio;
                }

                rl.question("\nEstado (1. pendiente, 2. confirmado, 3. cancelado, enter para no cambiar): ", async (estadoOpcion) => {
                    let estado;
                    switch (estadoOpcion) {
                        case "1": estado = "pendiente"; break;
                        case "2": estado = "confirmado"; break;
                        case "3": estado = "cancelado"; break;
                        case "": estado = existe.estado; break; //mantiene el estado actual si se presiona enter
                        default:
                            console.log("\nError: opción inválida para estado.");
                            return mostrarMenuTurnos();
                    }

                    rl.question("\nNueva observación (enter para no cambiar): ", async (observaciones) => {

                        //aca inserta los cambios
                        const campos = {};
                        if (estado && estado.trim() !== "") campos.estado = estado;
                        if (observaciones && observaciones.trim() !== "") campos.observaciones = observaciones;
                        if (nuevaFecha) campos.fechaInicio = nuevaFecha;

                        const actualizado = await actualizarTurno(id, campos);
                        console.log("\nTurno actualizado:", actualizado);
                        mostrarMenuTurnos();
                    });
                });
            });
        });
    });
}

async function bajaTurnoMenu() {
    const turnos = await listarTurnos();
    mostrarTurnos(turnos);

    rl.question("\nIngrese ID del turno a dar de baja: ", async (id) => {
        const actualizado = await bajaTurno(id);
        if (!actualizado) {
            console.log("\nNo existe ningún turno con ese ID.");
        } else {
            console.log("\nTurno dado de baja:", actualizado);
        }
        mostrarMenuTurnos();
    });
}
