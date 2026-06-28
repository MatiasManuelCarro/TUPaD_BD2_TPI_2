import mongoose from "mongoose";


//Definición de esquemas y modelo
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: {
        type: String,
        required: true,
        match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    },
    telefono: {
        type: String,
        required: true,
        match: /^[0-9]{8,15}$/
    },
    activo: { type: Boolean, required: true, default: true }
}, { timestamps: true });

const horarioSchema = new mongoose.Schema({
    dia: { type: String, required: true },
    desde: { type: String, required: true },
    hasta: { type: String, required: true }
}, { _id: false });

const profesionalSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    horarios: { type: [horarioSchema], required: true },
    activo: { type: Boolean, default: true },
}, { timestamps: true });

const servicioSchema = new mongoose.Schema({
    profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: "Profesional", required: true },
    nombre: { type: String, required: true },
    duracion: { type: Number, required: true }, // minutos
    precio: { type: Number, required: true },
    activo: { type: Boolean, default: true }
}, { timestamps: true });

const turnoSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: "Profesional", required: true },
    servicioId: { type: mongoose.Schema.Types.ObjectId, ref: "Servicio", required: true },
    servicioSnapshot: { //Guarda historico del servicio con los datos en el momento de la creacion
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        nombre: String,
        duracion: Number,
        precio: Number,
        profesional: {
            nombre: String,
            especialidad: String,
        }
    },
    fechaInicio: { type: Date, required: true },
    estado: { type: String, enum: ["pendiente", "confirmado", "cancelado"], default: "pendiente" },
    observaciones: String,
    activo: { type: Boolean, default: true }
}, { timestamps: true });


//exporta los modelos
export const Usuario = mongoose.model("Usuario", usuarioSchema, "usuarios");
export const Profesional = mongoose.model("Profesional", profesionalSchema, "profesionales"); //Fuerza el nombre profesionales
export const Servicio = mongoose.model("Servicio", servicioSchema, "servicios");
export const Turno = mongoose.model("Turno", turnoSchema, "turnos");


// OPERACIONES CRUD DE USUARIOS

// CREATE
export async function crearUsuario(data) {
    return await Usuario.create(data);
}

// READ (respeta baja lógica)
export async function listarUsuarios() {
    return await Usuario.find({ activo: true });
}

// UPDATE
export async function actualizarUsuario(id, campos) {
    return await Usuario.findByIdAndUpdate(id, campos, { returnDocument: "after" });
}

// DELETE (baja lógica)
export async function bajaUsuario(id) {
    return await Usuario.findOneAndUpdate(
        { _id: id },
        { $set: { activo: false } },
        { returnDocument: "after" }
    );
}

// OPERACIONES CRUD DE PROFESIONALES

// CREATE
export async function crearProfesional(data) {
    return await Profesional.create(data);
}

// READ 
export async function listarProfesionales() {
    return await Profesional.find({ activo: true });
}

// UPDATE
export async function actualizarProfesional(id, campos) {
    return await Profesional.findByIdAndUpdate(id, campos, { returnDocument: "after" });
}


// DELETE (baja lógica)
export async function bajaProfesional(id) {
    return await Profesional.findByIdAndUpdate(id, { activo: false }, { returnDocument: "after" });
}

// CRUD DE SERVICIOS 

// CREATE
// CREATE
export async function crearServicio(data) {
    return await Servicio.create(data);
}


// READ (solo activos)
export async function listarServicios() {
    return await Servicio.find({ activo: true }).populate("profesionalId", "nombre especialidad");
}

// Busca servicios por profesional
export async function listarServiciosPorProfesional(profesionalId) {
    return await Servicio.find({ profesionalId, activo: true });
}


// UPDATE
export async function actualizarServicio(id, campos) {
    return await Servicio.findByIdAndUpdate(
        id,
        campos,
        { returnDocument: "after" }
    );
}

// DELETE (baja lógica)
export async function bajaServicio(id) {
    return await Servicio.findByIdAndUpdate(
        id, { activo: false }, { returnDocument: "after" });
}

//CRUD DE TURNOS
// CREATE
export async function crearTurno({ usuarioId, profesionalId, servicioId, fechaInicio, observaciones, estado }) {
    const servicio = await Servicio.findById(servicioId).populate("profesionalId");
    if (!servicio) throw new Error("Servicio no encontrado");

    //historico del servicio
    const snapshot = {
        _id: servicio._id,
        nombre: servicio.nombre,
        duracion: servicio.duracion,
        precio: servicio.precio,
        profesional: {
            nombre: servicio.profesionalId.nombre,
            especialidad: servicio.profesionalId.especialidad,
        }
    };

    return await Turno.create({
        usuarioId,
        profesionalId,
        servicioId,
        servicioSnapshot: snapshot,
        fechaInicio,
        observaciones,
        estado,
        activo: true
    });
}

// READ
// populate("usuarioId", "nombre email") reemplaza el ObjectId de usuario por el documento completo,
//   mostrando solo los campos "nombre" y "email".
// populate("profesionalId", "nombre especialidad") hace lo mismo con el profesional.
export async function listarTurnos() {
    return await Turno.find({ activo: true })
        .populate("usuarioId", "nombre email")
        .populate("profesionalId", "nombre especialidad");
}

// UPDATE
export async function actualizarTurno(id, campos) {
    return await Turno.findByIdAndUpdate(
        id,
        campos,
        { returnDocument: "after" }
    );
}

// DELETE (baja lógica)
export async function bajaTurno(id) {
    return await Turno.findByIdAndUpdate(
        id,
        { activo: false },
        { returnDocument: "after" }
    );
}