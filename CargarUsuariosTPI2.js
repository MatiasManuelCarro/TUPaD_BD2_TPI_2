import { crearUsuario, listarUsuarios } from "./TPI_parte2_mongoose.js";

async function run() {
  try {
    // Crear Hugo Catalán versión TPI Parte 2
    const hugoParte2 = await crearUsuario({
      nombre: "Hugo Catalán TPI Parte 2",
      email: "hugo_tpi-parte2@mail.com",
      telefono: "3421234567",
      activo: true
    });
    console.log("Usuario creado:", hugoParte2);

    // Crear Matías Carro versión TPI Parte 2
    const matiasParte2 = await crearUsuario({
      nombre: "Matías Carro TPI Parte 2",
      email: "matias_tpi-parte2@mail.com",
      telefono: "3419876543",
      activo: true
    });
    console.log("Usuario creado:", matiasParte2);

    // Listar usuarios activos para verificar
    const activos = await listarUsuarios();
    console.log("Usuarios activos:", activos);
  } catch (error) {
    console.error("Error al cargar usuarios:", error.message);
  }
}

run();
