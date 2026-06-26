import mongoose from "mongoose";


//Definición de esquema y modelo
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

//exporta el modelo de usuario
export const Usuario = mongoose.model("Usuario", usuarioSchema); 

// OPERACIONES CRUD

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