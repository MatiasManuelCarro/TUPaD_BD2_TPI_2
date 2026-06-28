# Bloque 2: Mecanismo de Backups y Resguardo

## Introducción
Este script simula una tarea de administración de servidores, automatizando el respaldo físico de datos mediante la línea de comandos del sistema operativo.  
El objetivo es garantizar la disponibilidad y recuperación de la información en caso de fallos, aplicando buenas prácticas de **RTO (Recovery Time Objective)** y **RPO (Recovery Point Objective)**.

---

## Requisitos previos
- **Sistema operativo Windows** con PowerShell.  
- **MongoDB Database Tools** instaladas (incluyendo `mongodump.exe`).  
- **Acceso a MongoDB Atlas** con credenciales válidas.  
- Conexión a internet para acceder al clúster remoto.  

---

## Descripción del script
El script `backup.ps1` realiza las siguientes operaciones:

1. **Creación de carpeta principal de resguardo**  
   - Se genera la carpeta `resguardos_tpi` en el directorio actual si no existe.

2. **Creación de subcarpeta con fecha actual (YYYY-MM-DD)**  
   - Se organiza cada respaldo en una carpeta con la fecha correspondiente.

3. **Ejecución de `mongodump`**  
   - Se conecta al clúster de Atlas usando las credenciales:  
     - Usuario: `TuturnoAdmin`  
     - Contraseña: `Admin123`  

            Nota importante: Para esta version del script debido a que es algo educativo se almacena el string completo con el admin, esto no es algo que se debe utilizar en un entorno de produccion real y debe ser eliminado del script.

            Una opcion es guardar las credenciales como variables de entorno en un archivo que nunca se suba a ningun repositorio o servicio web. 

   - Descarga la base de datos `gestionTurnos` dentro de la carpeta creada.

4. **Confirmación en consola**  
   - Muestra el mensaje:  
     ```
     Respaldo completado en .\resguardos_tpi\YYYY-MM-DD
     ```

---

## Ejecución del script
1. Guardar el archivo como `backup.ps1`.  
2. Abrir PowerShell en la carpeta del proyecto.  
3. Ejecutar:
   ```powershell
   .\backup.ps1
    ```