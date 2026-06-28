# Bases de Datos 2 - TPI Parte 2 - Grupo 11 - Matias Carro y Hugo Catalan
####  Documentación del Proyecto – Sistema de Gestión de Usuarios (Node.js, Mongoose y MongoDB)

## Introducción del sistema

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

## Tecnologías utilizadas

    Node.js – Entorno de ejecución JavaScript.
    MongoDB – Base de datos NoSQL orientada a documentos.
    Mongoose – ODM para modelado y consultas.
    readline – Módulo de Node.js para interacción por consola.
    ECMAScript Modules (ESM) – Uso de import / export.
    JavaScript moderno (async/await) – Manejo claro de asincronía.

## Arquitectura del proyecto

```text
📁 Proyecto
│
├── MenuPrincipal.js          → Menú interactivo y flujo del sistema
├── TPI_parte2_mongoose.js    → Conexión, modelo y funciones CRUD
├── package.json              → Dependencias y configuración
└── node_modules/             → Librerías instaladas
```

### Descripción de archivos

#### index.js

    Solicita credenciales al usuario mediante consola usando readline.

    Construye dinámicamente la URI (Uniform Resource Identifier) de conexión a MongoDB Atlas.

    Conecta a MongoDB usando Mongoose.

    Inicializa el flujo del programa llamando a mostrarMenu() solo después de una conexión exitosa.

    Maneja errores de conexión y finalizar el proceso si algo falla.

##### MenuPrincipal.js  
    Maneja el menú, validaciones y flujo de interacción con el usuario.

##### TPI_parte2_mongoose.js  
    Contiene:

        Conexión a MongoDB

        Schema y modelo Usuario

        Funciones CRUD

        Baja lógica

## Entidades del sistema

El sistema se compone de cuatro entidades principales que representan los actores y operaciones de la gestión. Cada una cumple un rol específico dentro del modelo de datos:

- **Usuario**: Representa a la persona que solicita un turno. Contiene información básica de contacto como nombre, email y teléfono. Se gestiona con baja lógica para mantener historial de registros.

- **Profesional**: Representa al especialista que brinda servicios. Incluye nombre, especialidad y un conjunto de horarios de atención. Es clave para vincular servicios y turnos.

- **Servicio**: Define la prestación ofrecida por un profesional, con nombre, duración y precio. Se asocia directamente a un profesional y permite organizar la oferta disponible.

- **Turno**:Es la entidad que unifica todo el sistema. Relaciona a un usuario, un profesional y un servicio en una fecha y hora determinada.  
  Además, guarda un **historial del servicio** en el momento de la creación, lo que asegura un registro histórico (precio, duración y datos del profesional en el momento creado) incluso si el servicio cambia posteriormente.  
  De esta manera, el turno funciona como el núcleo integrador que conecta todas las entidades y garantiza la trazabilidad de la información.


## Modelo de datos

### Usuarios
##### Schema Usuarios

```js
const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    activo: { type: Boolean, default: true }
}, { timestamps: true });
```

##### Descripción de campos

| **Campo**   | **Tipo** | **Descripción**                                   |
|-------------|----------|---------------------------------------------------|
| **nombre**  | String   | Nombre del usuario                                |
| **email**   | String   | Email único y validado                            |
| **telefono**| String   | Teléfono de contacto                              |
| **activo**  | Boolean  | Indica si el usuario está activo (baja lógica)    |
| **createdAt** | Date   | Fecha de creación                                 |
| **updatedAt** | Date   | Fecha de actualización                             |

### Profesionales
##### Schema Profesionales
```js
const horarioSchema = new mongoose.Schema({
    dia: { type: String, required: true },
    desde: { type: String, required: true },
    hasta: { type: String, required: true }
}, { _id: false });
```
```js
const ProfesionalSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    horarios: { type: [horarioSchema], required: true },
    activo: { type: Boolean, default: true }
}, { timestamps: true });
```

##### Descripción de campos
| **Campo**     | **Tipo** | **Descripción**                                |
|---------------|----------|------------------------------------------------|
| **nombre**    | String   | Nombre del profesional                         |
| **especialidad** | String | Especialidad médica                            |
| **horarios**  | Array    | Lista de días y franjas horarias de atención   |
| **activo**    | Boolean  | Estado lógico (true = activo, false = baja)    |
| **createdAt** | Date     | Fecha de creación                              |
| **updatedAt** | Date     | Fecha de actualización                         |


### Servicios
##### Schema Servicios
```js
const ServicioSchema = new mongoose.Schema({
    profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: "Profesional", required: true },
    nombre: { type: String, required: true },
    duracion: { type: Number, required: true }, // minutos
    precio: { type: Number, required: true },
    activo: { type: Boolean, default: true }
}, { timestamps: true });
```
##### Descripción de campos
| **Campo**        | **Tipo**   | **Descripción**                              |
|------------------|------------|----------------------------------------------|
| **profesionalId**| ObjectId   | Referencia al profesional que brinda el servicio |
| **nombre**       | String     | Nombre del servicio                          |
| **duracion**     | Number     | Duración en minutos                          |
| **precio**       | Number     | Precio en pesos                              |
| **activo**       | Boolean    | Estado lógico (true = activo, false = baja)  |
| **createdAt**    | Date       | Fecha de creación                            |
| **updatedAt**    | Date       | Fecha de actualización                       |


### Turnos
##### Schema Turnos
```js
const TurnoSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: "Profesional", required: true },
    servicioId: { type: mongoose.Schema.Types.ObjectId, ref: "Servicio", required: true },
    servicioSnapshot: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        nombre: String,
        duracion: Number,
        precio: Number,
        profesional: { nombre: String, especialidad: String }
    },
    fechaInicio: { type: Date, required: true },
    estado: { type: String, enum: ["pendiente", "confirmado", "cancelado"], default: "pendiente" },
    observaciones: String,
    activo: { type: Boolean, default: true }
}, { timestamps: true });
```
##### Descripción de campos
| **Campo**           | **Tipo**   | **Descripción**                              |
|---------------------|------------|----------------------------------------------|
| **usuarioId**       | ObjectId   | Referencia al usuario                        |
| **profesionalId**   | ObjectId   | Referencia al profesional                    |
| **servicioId**      | ObjectId   | Referencia al servicio                       |
| **servicioSnapshot**| Object     | Copia del servicio en el momento de creación |
| **fechaInicio**     | Date       | Fecha y hora del turno                       |
| **estado**          | String     | Estado del turno (pendiente, confirmado, cancelado) |
| **observaciones**   | String     | Notas adicionales                            |
| **activo**          | Boolean    | Estado lógico                                |
| **createdAt**       | Date       | Fecha de creación                            |
| **updatedAt**       | Date       | Fecha de actualización                       |


##  Funciones CRUD

En el sistema se implementan operaciones CRUD (Create, Read, Update, Delete) para cada entidad del modelo de datos: **Usuarios, Profesionales, Servicios y Turnos**.  
Estas funciones permiten gestionar la información de manera estructurada y segura, aplicando **baja lógica** en lugar de eliminación física para preservar la integridad de los registros.  

Cada operación está desarrollada con **Node.js y Mongoose**, utilizando `async/await` para un manejo claro de la asincronía y validaciones específicas en cada caso.  
A continuación se detallan las funciones CRUD de cada entidad, acompañadas de su código y explicación.

### Usuarios

##### Crear usuario (CREATE)
```js
export async function crearUsuario(data) {
    return await Usuario.create(data);
}
```

##### Listar usuarios activos (READ)
```js
export async function listarUsuarios() {
    return await Usuario.find({ activo: true });
}
```

##### Actualizar un usuario (UPDATE)
```js
export async function actualizarUsuario(id, campos) {
    return await Usuario.findByIdAndUpdate(id, campos, { returnDocument: "after" });
}
```

##### Dar de baja un usuario (DELETE) Baja logica
```js
export async function bajaUsuario(id) {
    return await Usuario.findOneAndUpdate(
        { _id: id },
        { $set: { activo: false } },
        { returnDocument: "after" }
    );
}
```


### Profesionales
##### Crear profesional (CREATE)
```js
export async function crearProfesional(data) {
    return await Profesional.create(data);
}
```
##### Listar profesionales activos (READ)
```js
export async function listarProfesionales() {
    return await Profesional.find({ activo: true });
}
```
##### Actualizar un profesional (UPDATE)
```js
export async function actualizarProfesional(id, campos) {
    return await Profesional.findByIdAndUpdate(id, campos, { returnDocument: "after" });
}
```
##### Dar de baja un profesional (DELETE) Baja lógica
```js
export async function bajaProfesional(id) {
    return await Profesional.findByIdAndUpdate(id, { activo: false }, { returnDocument: "after" });
}
```


### Servicios

##### Crear servicio (CREATE)
```js
export async function crearServicio(data) {
    return await Servicio.create(data);
}
```

##### Listar servicios activos (READ)
```js
export async function listarServicios() {
    return await Servicio.find({ activo: true }).populate("profesionalId", "nombre especialidad");
}
```

##### Listar servicios por profesional (READ)
```js
export async function listarServiciosPorProfesional(profesionalId) {
    return await Servicio.find({ profesionalId, activo: true });
}
```

##### Actualizar un servicio (UPDATE)
```js
export async function actualizarServicio(id, campos) {
    return await Servicio.findByIdAndUpdate(
        id,
        campos,
        { returnDocument: "after" }
    );
}
```

##### Dar de baja un servicio (DELETE) Baja lógica
```js
export async function bajaServicio(id) {
    return await Servicio.findByIdAndUpdate(
        id,
        { activo: false },
        { returnDocument: "after" }
    );
}
```


### Turnos
##### Crear turno (CREATE)
```js
export async function crearTurno({ usuarioId, profesionalId, servicioId, fechaInicio, observaciones, estado }) {
    const servicio = await Servicio.findById(servicioId).populate("profesionalId");
    if (!servicio) throw new Error("Servicio no encontrado");

    // histórico del servicio
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
```

##### Listar turnos activos (READ)
```js
export async function listarTurnos() {
    return await Turno.find({ activo: true })
        .populate("usuarioId", "nombre email")
        .populate("profesionalId", "nombre especialidad");
}
```

##### Actualizar un turno (UPDATE)
```js
export async function actualizarTurno(id, campos) {
    return await Turno.findByIdAndUpdate(
        id,
        campos,
        { returnDocument: "after" }
    );
}
```

##### Dar de baja un turno (DELETE) Baja lógica
```js
export async function bajaTurno(id) {
    return await Turno.findByIdAndUpdate(
        id,
        { activo: false },
        { returnDocument: "after" }
    );
}
```

## Guía de Uso del Sistema

### Requisitos previos
Para ejecutar el sistema es necesario tener:
- **Node.js** (versión 18 o superior recomendada).
- **MongoDB Atlas** (El sistema ya conecta a su base de datos propia)
- **Mongosh** Opcional para poder visualizar los cambios de la Base de Datos sin utilizar Atlas.
- **pnpm** como gestor de paquetes (más seguro y eficiente que npm).
- Conexión a internet para acceder a la base de datos en la nube.

---

### Instalación de dependencias
1. **Instalar pnpm** (si no lo tenés):
```bash
npm install -g pnpm
```
2. **Inicializar el proyecto** (si aún no existe package.json):

```bash
pnpm init
 ```

4. **Instalar Mongoose**
```bash
pnpm add mongoose
```

5. **Instalar todas las dependencias necesarias:**

```bash
pnpm add mongoose readline
 ```

###### Dependencias principales:

- **mongoose** ODM para modelado de datos en MongoDB.

- **readline** Módulo para interacción por consola.

6. **Ejecución del sistema**
Iniciar el programa desde la raíz del proyecto:

```bash
node index.js
```

Tambien es posible utilizar `pnpm start` si se configura el package.json como muestra el siguente paso.

**Nota sobre ECMAScript Modules (ESM)**
(El warning que aparece al ejecutar el script)

```bash
(node:4896) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///RUTA/index.js is not specified and it doesn't parse as CommonJS.

Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to RUTA\package.json
```

 El proyecto utiliza sintaxis moderna de JavaScript (`import` / `export`), lo que requiere que Node.js interprete los archivos como **ES Modules**.  
 Para evitar advertencias al ejecutar `index.js`, es necesario agregar la propiedad `"type": "module"` en el archivo `package.json`.  

 Ejemplo:
 ```json
 {
   "name": "parte-1-script",
   "version": "1.0.0",
   "main": "index.js",
   "type": "module",
   "scripts": {
     "start": "node index.js"
   },
   "dependencies": {
     "mongoose": "^9.7.3",
     "readline": "^1.3.0"
   }
 }
 ```

 Con esta configuración, Node.js reconoce automáticamente la sintaxis ESM y el warning desaparece. Además, se habilita el comando `pnpm start` (declarando el `"main": "index.js"`) para ejecutar el sistema de forma más sencilla.


## Credenciales para el Ingreso

**Al ejecutar index.js**

Se solicitarán las credenciales de conexión a MongoDB Atlas (usuario y contraseña).

**Ingresar**
```
    Usuario: TuturnoAdmin
    Contraseña: Admin123
```

Se construirá dinámicamente la URI de conexión en el index.

En caso de error, se muestra un mensaje y se finaliza el proceso.

Una vez conectado, se mostrará el Menú Principal.


## Navegación de menús
El sistema funciona mediante un menú interactivo en consola:

### Menú Principal

```js
=== MENÚ PRINCIPAL ===
1. Gestión de Usuarios
2. Gestión de Profesionales
3. Gestión de Servicios
4. Gestión de Turnos
5. Salir
```
Cada opción abre un submenú con operaciones CRUD:

**Usuarios** - Crear, listar, actualizar, dar de baja.

**Profesionales** - Crear, listar, actualizar, dar de baja.

**Servicios** - Crear, listar, actualizar, dar de baja.

**Turnos** - Crear, listar, actualizar, dar de baja.

La navegación se realiza ingresando el número de la opción deseada.
En cada submenú se pueden volver al menú principal o continuar con nuevas operaciones.

Cuando se solicita una ID, copiar de la tabla correspondiente y pegarla. 

## Conclusión 

La implementación de la comunicación Cliente-Servidor en este proyecto permitió comprender de manera práctica cómo interactúan las aplicaciones con una base de datos remota.  
Uno de los principales desafíos fue garantizar la **consistencia de los datos** y manejar correctamente la asincronía en Node.js mediante `async/await`. También resultó clave aplicar **validaciones** en cada operación para evitar errores comunes como IDs inválidos, emails repetidos o formatos incorrectos.

Otro aspecto complejo fue la **modularización del sistema**, separando la lógica de conexión, los modelos y los menús interactivos. Esto facilitó la escalabilidad y el mantenimiento del código.

Finalmente, la entidad **Turno** demostró ser el núcleo del sistema, ya que unifica usuarios, profesionales y servicios en una sola operación. El uso del **historico del servicio** en el momento de la creación fue un aprendizaje importante: asegura la trazabilidad histórica y evita inconsistencias si los datos del servicio cambian posteriormente.

Este trabajo permitió aplicar conceptos de **Bases de Datos II** en un entorno realista, enfrentando desafíos de asincronía, validación y diseño modular, y mostrando cómo la comunicación Cliente-Servidor es esencial para construir sistemas confiables y escalables.
