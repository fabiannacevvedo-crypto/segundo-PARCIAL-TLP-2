# Sistema de Gestión de Cursos

## Descripción
API REST desarrollada con Node.js, Express y Mongoose (MongoDB) para la gestión de cursos, tópicos y usuarios docentes. El proyecto implementa relaciones embebidas y referenciadas, validaciones, eliminación lógica y eliminación en cascada.

## Requisitos
- Node.js 18 o superior
- MongoDB en ejecución (local o remoto)
- npm

## Instalación
1. Clonar o descargar el repositorio.
2. Instalar las dependencias del proyecto:

```bash
npm install
```

3. Crear el archivo `.env` a partir de `.env.example` y ajustar los valores según el entorno:

```bash
cp .env.example .env
```

Variables requeridas:
- `PORT`: puerto donde se ejecutará el servidor (por defecto `3000`).
- `MONGODB_URI`: URI de conexión a la base de datos MongoDB.

## Ejecución
- Modo desarrollo (con recarga automática en Node 18+):

```bash
npm run dev
```

- Modo normal:

```bash
npm start
```

Al iniciar, la aplicación se conecta a MongoDB y levanta el servidor en el puerto configurado.

## Estructura del proyecto
- `app.js`: punto de entrada de la aplicación y configuración de Express.
- `src/config/database.js`: conexión a MongoDB con Mongoose.
- `src/models/`: definición de esquemas y modelos (`user.model.js`, `topic.model.js`, `course.model.js`).
- `src/controllers/`: lógica de negocio y operaciones CRUD (`topics.controller.js`, `courses.controller.js`).
- `src/middlewares/`: middleware de validación y validaciones con express-validator.
- `src/routes/`: definición de rutas de la API (`topics.routes.js`, `courses.routes.js`).

## Endpoints principales
Base URL: `http://localhost:3000/api`

### Tópicos
- `POST /topics`: crear un tópico.
- `GET /topics`: listar todos los tópicos.
- `GET /topics/:id`: obtener un tópico por ID (incluye virtual populate de cursos).
- `PUT /topics/:id`: actualizar un tópico.
- `DELETE /topics/:id`: eliminar un tópico y aplicar eliminación en cascada (quita el tópico del array `topics` de los cursos que lo referencian).

### Cursos
- `POST /courses`: crear un curso con `teacher` y `topics`.
- `GET /courses`: listar todos los cursos con `populate` de `teacher` y `topics`.
- `GET /courses/:id`: obtener un curso por ID con `populate` de `teacher` y `topics`.
- `PUT /courses/:id`: actualizar un curso y sus `topics`.
- `DELETE /courses/:id`: eliminar un curso.

## Crear un usuario docente (teacher) en la base de datos
Antes de crear cursos es necesario contar con un usuario activo para asignarlo como `teacher`. Puede crearse manualmente en MongoDB con `mongosh` o MongoDB Compass.

### Opción 1: Usando mongosh
1. Abrir una terminal y conectarse a MongoDB:

```bash
mongosh
```

2. Seleccionar la base de datos configurada en `MONGODB_URI` (ejemplo):

```javascript
use sistema_gestion_cursos
```

3. Insertar un usuario docente con el perfil embebido y `deletedAt` en `null`:

```javascript
db.users.insertOne({
  username: "docente1",
  email: "docente1@example.com",
  password: "123456",
  profile: {
    firstName: "Juan",
    lastName: "Pérez",
    bio: "Docente de programación"
  },
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

4. Copiar el `_id` generado por MongoDB y utilizarlo como valor del campo `teacher` al crear un curso.

### Opción 2: Usando MongoDB Compass
1. Conectarse al servidor de MongoDB.
2. Abrir la base de datos indicada en `MONGODB_URI`.
3. Crear (si no existe) la colección `users`.
4. Insertar un documento con la siguiente estructura:

```json
{
  "username": "docente1",
  "email": "docente1@example.com",
  "password": "123456",
  "profile": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "bio": "Docente de programación"
  },
  "deletedAt": null
}
```

> Nota: El usuario debe tener `deletedAt: null` para ser considerado activo por las validaciones de cursos.

## Ejemplo de creación de curso
Con el `_id` del docente creado, se puede enviar una solicitud `POST /api/courses` con un cuerpo como:

```json
{
  "title": "Introducción a Node.js",
  "description": "Curso básico para aprender Node.js y Express desde cero.",
  "level": "beginner",
  "price": 0,
  "schedule": {
    "day": "monday",
    "startTime": "2026-01-01T18:00:00.000Z",
    "endTime": "2026-01-01T20:00:00.000Z"
  },
  "teacher": "<ID_DEL_USUARIO_DOCENTE>",
  "topics": []
}
```

## Notas
- El archivo `.env` y la carpeta `node_modules` no deben versionarse ni subirse al repositorio.
- Se utiliza `express-validator` para validar entradas y `matchedData()` en los controladores.
- Las operaciones de actualización se realizan de forma manual: se busca el documento, se modifican sus campos y se guarda.
