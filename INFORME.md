# Informe de funcionamiento del sistema

## 1. Visión general
Este proyecto implementa una API REST para un **Sistema de Gestión de Cursos** utilizando **Node.js**, **Express** y **Mongoose** sobre **MongoDB**. La aplicación permite administrar tópicos y cursos, relacionarlos con usuarios docentes y aplicar reglas de validación, integridad y consistencia de datos.

La arquitectura se organiza en capas:
- **Configuración (`src/config`)**: conexión a la base de datos.
- **Modelos (`src/models`)**: definición de esquemas, tipos, restricciones y relaciones.
- **Middlewares (`src/middlewares`)**: validaciones de entrada y manejo de errores de validación.
- **Controladores (`src/controllers`)**: lógica de negocio y operaciones CRUD.
- **Rutas (`src/routes`)**: exposición de los endpoints HTTP.
- **Entrada (`app.js`)**: inicialización de Express, registro de middlewares/rutas y arranque del servidor.

## 2. Configuración e inicio de la aplicación
- `app.js` carga las variables de entorno con `dotenv/config`, crea la instancia de Express, habilita `express.json()` para parsear cuerpos JSON y registra los routers bajo el prefijo `/api`.
- Al iniciar el servidor (`app.listen`), se invoca `startDB()` desde `src/config/database.js`.
- `startDB()` lee `MONGODB_URI` desde el entorno y ejecuta `mongoose.connect(uri)`. Si la conexión es exitosa muestra un mensaje en consola; si falla, registra el error y finaliza el proceso con `process.exit(1)` para evitar que la API funcione sin base de datos.

## 3. Modelos y esquemas de datos

### 3.1 Usuario (`src/models/user.model.js`)
- Incluye un **perfil embebido** (`profileSchema`) con campos como `firstName`, `lastName` y `bio`, representando una relación **1:1 embebida** dentro del documento de usuario.
- Campos principales: `username`, `email`, `password`, `profile` y `deletedAt`.
- `deletedAt` (tipo `Date`, por defecto `null`) permite implementar **eliminación lógica**: un usuario activo tiene `deletedAt` en `null`.
- Se define un **virtual populate** `courses` (`ref: "Course"`, `localField: "_id"`, `foreignField: "teacher"`) para obtener los cursos dictados por el usuario sin almacenar un arreglo de cursos en el documento.
- El esquema habilita `timestamps: true`, `versionKey: false` y configura `toJSON`/`toObject` con `{ virtuals: true }` para incluir los virtuales en las respuestas.

### 3.2 Tópico (`src/models/topic.model.js`)
- Campos:
  - `name`: `String`, único, obligatorio, longitud entre 2 y 50 caracteres.
  - `description`: `String`, opcional, longitud máxima de 200 caracteres.
- Opciones del esquema: `timestamps: true`, `versionKey: false`, `toJSON` y `toObject` con `virtuals: true`.
- Virtual populate `courses`: permite recuperar los cursos que incluyen el tópico en su arreglo `topics` (`ref: "Course"`, `localField: "_id"`, `foreignField: "topics"`). Esto hace posible consultar la relación inversa desde el tópico.

### 3.3 Curso (`src/models/course.model.js`)
- Define constantes exportadas para valores permitidos:
  - `COURSE_LEVELS = ["beginner", "intermediate", "advanced"]`
  - `COURSE_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]`
- Incluye un esquema embebido `scheduleSchema` (relación **1:1 embebida** `Course–Schedule`) con:
  - `day`: `String`, obligatorio, `enum` de `COURSE_DAYS`.
  - `startTime`: `Date`, obligatorio.
  - `endTime`: `Date`, obligatorio.
- Campos principales del curso:
  - `title`: `String`, único, obligatorio, 3 a 100 caracteres.
  - `description`: `String`, obligatorio, 10 a 500 caracteres.
  - `level`: `String`, `enum` de `COURSE_LEVELS`, por defecto `beginner`.
  - `price`: `Number`, mínimo 0, por defecto 0.
  - `schedule`: subdocumento embebido obligatorio.
  - `teacher`: `ObjectId`, obligatorio, referencia a `User` (relación **1:N referenciada** `User–Course`).
  - `topics`: arreglo de `ObjectId` con referencia a `Topic` (relación **N:M referenciada** `Course–Topic`).
- Opciones del esquema: `timestamps: true` y `versionKey: false`.

## 4. Relaciones implementadas
- **1:1 embebida (Course–Schedule)**: el horario se almacena dentro del documento del curso, ya que forma parte intrínseca del mismo y se consulta junto con él.
- **1:N referenciada (User–Course)**: cada curso guarda en `teacher` el identificador del usuario docente. Desde `User`, el virtual `courses` permite obtener sus cursos.
- **N:M referenciada (Course–Topic)**: un curso puede tener múltiples tópicos y un tópico puede estar asociado a múltiples cursos mediante el arreglo `topics` en `Course`. Desde `Topic`, el virtual `courses` permite consultar los cursos relacionados.

## 5. Validaciones
Las validaciones se implementan con **express-validator** en archivos separados dentro de `src/middlewares/validations/` y se ejecutan antes de los controladores. El middleware `validateResult` (`src/middlewares/validator.middleware.js`) utiliza `validationResult(req)` y, si hay errores, responde con estado **400** y el detalle de los errores; en caso contrario, continúa con `next()`.

### 5.1 Validaciones de tópicos (`topic.validation.js`)
- **Creación**: valida `name` (obligatorio, 2-50 caracteres, único mediante consulta personalizada) y `description` (opcional, máximo 200 caracteres).
- **Actualización**: valida `id` de parámetro con `isMongoId()`, campos opcionales y unicidad de `name` excluyendo el propio tópico (`_id: { $ne: req.params.id }`).
- **ID**: validación reutilizable `topicIdValidation` para operaciones por identificador.

### 5.2 Validaciones de cursos (`course.validation.js`)
- **Creación (`createCourseValidation`)**:
  - `title`: obligatorio, 3-100 caracteres y único (custom).
  - `description`: obligatorio, 10-500 caracteres.
  - `level`: opcional, dentro de `COURSE_LEVELS`.
  - `price`: opcional, número >= 0.
  - `schedule.day`: obligatorio, dentro de `COURSE_DAYS`.
  - `schedule.startTime`: obligatorio, fecha válida (`isISO8601`, convertida a `Date`).
  - `schedule.endTime`: obligatorio, fecha válida y posterior a `startTime` (custom).
  - `teacher`: obligatorio, `isMongoId`, debe existir y estar activo (`deletedAt: null`) (custom).
  - `topics`: opcional, arreglo de IDs válidos (`topics.*` con `isMongoId`) y existentes en la colección de tópicos (custom).
- **Actualización (`updateCourseValidation`)**:
  - Valida el `id` del parámetro con `isMongoId()`.
  - Aplica las mismas reglas que creación pero con campos opcionales.
  - La unicidad de `title` excluye el curso que se está editando.
  - La comparación de `schedule.endTime` considera valores nuevos o existentes para soportar actualizaciones parciales.

## 6. Controladores y operaciones CRUD
Todos los controladores utilizan bloques `try-catch`, obtienen datos con `matchedData(req)` y responden con mensajes claros y códigos HTTP apropiados (**201**, **200**, **404**, **500**). Las actualizaciones se realizan de forma manual: se busca el documento, se modifican sus campos y se guarda con `save()`.

### 6.1 Controlador de tópicos (`src/controllers/topics.controller.js`)
- `createTopic`: crea y guarda un nuevo tópico.
- `getAllTopics`: lista todos los tópicos.
- `getTopicById`: busca un tópico por ID y aplica `populate("courses")` usando el virtual definido en el modelo.
- `updateTopic`: verifica existencia, asigna los datos recibidos con `Object.assign` y guarda.
- `deleteTopic`: verifica existencia, elimina el tópico y aplica **eliminación en cascada** manual:
  1. Busca los cursos que contienen el tópico en `topics` (`CourseModel.find({ topics: id })`).
  2. Recorre cada curso y filtra el arreglo `topics` para quitar la referencia eliminada.
  3. Guarda cada curso modificado.

### 6.2 Controlador de cursos (`src/controllers/courses.controller.js`)
- `createCourse`: crea un curso con los datos validados, incluyendo `teacher` y `topics`.
- `getAllCourses`: lista cursos con `populate("teacher")` y `populate("topics")`.
- `getCourseById`: obtiene un curso por ID con los mismos `populate`.
- `updateCourse`: busca el curso, verifica existencia, asigna los campos recibidos (incluyendo `topics` y datos del horario cuando se envían) y guarda los cambios.
- `deleteCourse`: verifica existencia y elimina el curso.

## 7. Rutas de la API
Las rutas se definen en `src/routes/` y se montan en `app.js` con el prefijo `/api`.

- **Tópicos (`/api/topics`)**: `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`. Cada ruta aplica las validaciones correspondientes y `validateResult` antes del controlador.
- **Cursos (`/api/courses`)**: `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`. Las rutas de creación y actualización usan `createCourseValidation`/`updateCourseValidation`; las de consulta y eliminación por ID usan `courseIdValidation`.

## 8. Flujo de una solicitud
1. El cliente envía una petición HTTP a un endpoint de `/api`.
2. Express dirige la solicitud al router correspondiente.
3. Se ejecutan las validaciones de `express-validator` declaradas en la ruta.
4. `validateResult` comprueba los errores: si existen, responde con **400**; si no, pasa al controlador.
5. El controlador extrae datos con `matchedData()`, ejecuta la operación en Mongoose dentro de un `try-catch` y devuelve la respuesta con el código HTTP adecuado.
6. En operaciones con relaciones, Mongoose resuelve referencias mediante `populate` y virtuales según corresponda.

## 9. Consideraciones de integridad y consistencia
- **Unicidad**: controlada en esquemas (`unique`) y reforzada en validaciones personalizadas (por ejemplo, `title` de curso y `name` de tópico), incluyendo exclusión del propio documento en actualizaciones.
- **Existencia previa**: los controladores verifican que el recurso exista antes de editar o eliminar, respondiendo con **404** si no se encuentra.
- **Docente activo**: las validaciones de curso exigen que el `teacher` exista y tenga `deletedAt: null`.
- **Eliminación en cascada**: al eliminar un tópico se limpian las referencias en los cursos afectados para evitar relaciones huérfanas.
- **Uso de datos validados**: `matchedData()` evita procesar campos no contemplados por las reglas de validación.

## 10. Tecnologías utilizadas
- **Node.js** y **Express**: servidor y enrutamiento de la API REST.
- **MongoDB** y **Mongoose**: persistencia, esquemas, validaciones a nivel de modelo, referencias, virtual populate y operaciones de consulta/actualización.
- **express-validator**: validación y sanitización de datos de entrada en capa de middleware.
- **dotenv**: gestión de variables de entorno (`PORT`, `MONGODB_URI`).
