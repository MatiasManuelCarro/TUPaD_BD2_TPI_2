Documentación del Proyecto – Sistema de Gestión de Usuarios (Node.js + MongoDB + Mongoose)
## 1. Introducción del sistema

Este proyecto implementa un sistema de gestión de usuarios desarrollado en Node.js, utilizando MongoDB como base de datos NoSQL y Mongoose como ODM.
El sistema funciona mediante un menú interactivo en consola, permitiendo realizar operaciones CRUD completas:

    Crear usuarios

    Listar usuarios activos

    Actualizar datos

    Realizar baja lógica

    Validar datos ingresados

El objetivo es aplicar conceptos de Bases de Datos II, integrando:

    Modelado de datos

    Validaciones

    Operaciones CRUD

    Manejo de errores

    Modularización del código

## 2. Tecnologías utilizadas

    Node.js – Entorno de ejecución JavaScript.

    MongoDB – Base de datos NoSQL orientada a documentos.

    Mongoose – ODM para modelado y consultas.

    readline – Módulo de Node.js para interacción por consola.

    ECMAScript Modules (ESM) – Uso de import / export.

    JavaScript moderno (async/await) – Manejo claro de asincronía.

## 3. Arquitectura del proyecto
Código

📁 Proyecto
│
├── MenuPrincipal.js          → Menú interactivo y flujo del sistema
├── TPI_parte2_mongoose.js    → Conexión, modelo y funciones CRUD
├── package.json              → Dependencias y configuración
└── node_modules/             → Librerías instaladas

### Descripción de archivos

    MenuPrincipal.js  
    Maneja el menú, validaciones y flujo de interacción con el usuario.

    TPI_parte2_mongoose.js  
    Contiene:

        Conexión a MongoDB

        Schema y modelo Usuario

        Funciones CRUD

        Baja lógica

## 4. Modelo de datos
### Schema del Usuario
js

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    activo: { type: Boolean, default: true }
}, { timestamps: true });

### Descripción de campos
Campo	Tipo	Descripción
nombre	String	Nombre del usuario
email	String	Email único y validado
telefono	String	Teléfono de contacto
activo	Boolean	Indica si el usuario está activo (baja lógica)
createdAt	Date	Fecha de creación
updatedAt	Date	Fecha de actualización