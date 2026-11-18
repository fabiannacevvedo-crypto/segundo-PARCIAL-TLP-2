// * ARCHIVO A COMPLETAR // Indica que este archivo contiene las validaciones a completar según las consignas.
// Importa body y param desde express-validator para definir reglas de validación. // Herramientas para validar cuerpo y parámetros.
import { body, param } from "express-validator"; // Extrae los constructores de validación necesarios.
// Importa el modelo Course para verificar la unicidad del título. // Permite consultar cursos existentes.
import { CourseModel } from "../../models/course.model.js"; // Carga el modelo de cursos.
// Importa el modelo User para verificar que el docente exista y esté activo. // Permite consultar usuarios.
import { UserModel } from "../../models/user.model.js"; // Carga el modelo de usuarios.
// Importa el modelo Topic para verificar que los tópicos existan. // Permite consultar tópicos.
import { TopicModel } from "../../models/topic.model.js"; // Carga el modelo de tópicos.
// Importa los arreglos de valores permitidos para nivel y día. // Provee enums definidos en el modelo de curso.
import { COURSE_LEVELS, COURSE_DAYS } from "../../models/course.model.js"; // Extrae constantes de niveles y días.

// Define las validaciones para la creación de un curso. // Exporta el arreglo de middlewares de validación.
export const createCourseValidation = [ // Inicia el arreglo de validaciones para crear cursos.
  // TODO: 1 - Validar title: 3 a 100 caracteres, obligatorio, único. // Tarea de consigna 6.
  body("title") // Selecciona el campo title del body.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .notEmpty() // Verifica que el título no esté vacío.
    .withMessage("El título es obligatorio") // Mensaje si falta el título.
    .isLength({ min: 3, max: 100 }) // Valida que la longitud esté entre 3 y 100 caracteres.
    .withMessage("El título debe tener entre 3 y 100 caracteres") // Mensaje si la longitud es inválida.
    .custom(async (value) => { // Agrega validación personalizada para verificar unicidad del título.
      // Busca si ya existe un curso con el mismo título. // Consulta la base de datos por título.
      const existing = await CourseModel.findOne({ title: value }); // Ejecuta búsqueda por título exacto.
      // Si existe, lanza un error para rechazar la validación. // Evita títulos duplicados.
      if (existing) { // Comprueba si se encontró un documento existente.
        throw new Error("El título del curso ya existe"); // Lanza error de unicidad.
      } // Cierra la condición de existencia.
      // Retorna true si la validación pasa correctamente. // Confirma que el título es válido.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación del campo title.
  // TODO: 2 - Validar description: 10 a 500 caracteres, obligatorio. // Tarea de consigna 6.
  body("description") // Selecciona el campo description del body.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .notEmpty() // Verifica que la descripción no esté vacía.
    .withMessage("La descripción es obligatoria") // Mensaje si falta la descripción.
    .isLength({ min: 10, max: 500 }) // Valida que la longitud esté entre 10 y 500 caracteres.
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"), // Mensaje si la longitud es inválida.
  // TODO: 3 - Validar level: valores permitidos, opcional. // Tarea de consigna 6.
  body("level") // Selecciona el campo level del body.
    .optional() // Indica que el nivel es opcional.
    .isIn(COURSE_LEVELS) // Verifica que el valor esté dentro de los niveles permitidos.
    .withMessage("El nivel proporcionado no es válido"), // Mensaje si el nivel no es permitido.
  // TODO: 4 - Validar price: número mayor o igual a 0, opcional. // Tarea de consigna 6.
  body("price") // Selecciona el campo price del body.
    .optional() // Indica que el precio es opcional.
    .isFloat({ min: 0 }) // Verifica que sea un número mayor o igual a 0.
    .withMessage("El precio debe ser un número mayor o igual a 0"), // Mensaje si el precio es inválido.
  // TODO: 5 - Validar schedule.day: valores permitidos, obligatorio. // Tarea de consigna 6.
  body("schedule.day") // Selecciona el campo day dentro de schedule.
    .notEmpty() // Verifica que el día no esté vacío.
    .withMessage("El día del horario es obligatorio") // Mensaje si falta el día.
    .isIn(COURSE_DAYS) // Verifica que el valor esté dentro de los días permitidos.
    .withMessage("El día del horario no es válido"), // Mensaje si el día no es permitido.
  // TODO: 6 - Validar schedule.startTime: fecha válida (Date), obligatoria. // Tarea de consigna 6.
  body("schedule.startTime") // Selecciona el campo startTime dentro de schedule.
    .notEmpty() // Verifica que la hora de inicio no esté vacía.
    .withMessage("La hora de inicio es obligatoria") // Mensaje si falta la hora de inicio.
    .isISO8601() // Verifica que sea una fecha válida en formato ISO 8601.
    .withMessage("La hora de inicio debe ser una fecha válida") // Mensaje si la fecha es inválida.
    .toDate(), // Convierte el valor a objeto Date.
  // TODO: 7 - Validar schedule.endTime: fecha válida, obligatoria y posterior a startTime. // Tarea de consigna 6.
  body("schedule.endTime") // Selecciona el campo endTime dentro de schedule.
    .notEmpty() // Verifica que la hora de fin no esté vacía.
    .withMessage("La hora de fin es obligatoria") // Mensaje si falta la hora de fin.
    .isISO8601() // Verifica que sea una fecha válida en formato ISO 8601.
    .withMessage("La hora de fin debe ser una fecha válida") // Mensaje si la fecha es inválida.
    .toDate() // Convierte el valor a objeto Date.
    .custom((value, { req }) => { // Agrega validación personalizada para comparar horas.
      // Obtiene la hora de inicio desde el cuerpo de la petición. // Recupera el valor a comparar.
      const startTime = new Date(req.body.schedule?.startTime); // Convierte la hora de inicio a Date.
      // Obtiene la hora de fin recibida en la validación. // Convierte el valor actual a Date.
      const endTime = new Date(value); // Crea objeto Date con la hora de fin.
      // Verifica que la hora de fin sea posterior a la hora de inicio. // Aplica la regla de negocio.
      if (endTime <= startTime) { // Comprueba si la hora de fin no es posterior.
        throw new Error("La hora de fin debe ser posterior a la hora de inicio"); // Lanza error de validación.
      } // Cierra la condición de comparación.
      // Retorna true si la hora de fin es válida. // Confirma que la validación pasó.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación del campo schedule.endTime.
  // TODO: 8 - Validar teacher: ID válido, obligatorio, debe existir y estar activo (deletedAt null). // Tarea de consigna 6.
  body("teacher") // Selecciona el campo teacher del body.
    .notEmpty() // Verifica que el docente no esté vacío.
    .withMessage("El docente es obligatorio") // Mensaje si falta el docente.
    .isMongoId() // Verifica que sea un ObjectId válido de MongoDB.
    .withMessage("El ID del docente no es válido") // Mensaje si el ID es inválido.
    .custom(async (value) => { // Agrega validación personalizada para verificar existencia y estado.
      // Busca el usuario docente por su ID y que no esté eliminado lógicamente. // Consulta docente activo.
      const user = await UserModel.findOne({ _id: value, deletedAt: null }); // Ejecuta búsqueda con filtro de activo.
      // Si no existe o no está activo, lanza un error. // Rechaza docentes inexistentes o eliminados.
      if (!user) { // Comprueba si no se encontró un docente válido.
        throw new Error("El docente no existe o no está activo"); // Lanza error de validación.
      } // Cierra la condición de docente inválido.
      // Retorna true si el docente es válido. // Confirma que la validación pasó.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación del campo teacher.
  // TODO: 9 - Validar topics: array de IDs válidos, opcional. // Tarea de consigna 6.
  body("topics") // Selecciona el campo topics del body.
    .optional() // Indica que los tópicos son opcionales.
    .isArray() // Verifica que el valor sea un arreglo.
    .withMessage("Los tópicos deben enviarse como un arreglo"), // Mensaje si no es un arreglo.
  // Valida cada elemento del arreglo topics como un ObjectId válido. // Aplica regla a todos los IDs.
  body("topics.*") // Selecciona cada elemento dentro del arreglo topics.
    .isMongoId() // Verifica que cada elemento sea un ObjectId válido.
    .withMessage("Cada tópico debe ser un ID válido") // Mensaje si algún ID es inválido.
    .custom(async (value) => { // Agrega validación personalizada para verificar existencia del tópico.
      // Busca el tópico por su identificador. // Consulta la existencia del tópico.
      const topic = await TopicModel.findById(value); // Ejecuta búsqueda por ID.
      // Si el tópico no existe, lanza un error. // Rechaza referencias inexistentes.
      if (!topic) { // Comprueba si no se encontró el tópico.
        throw new Error("Uno o más tópicos no existen"); // Lanza error de validación.
      } // Cierra la condición de tópico inexistente.
      // Retorna true si el tópico existe. // Confirma que la validación pasó.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación de cada tópico.
]; // Cierra el arreglo de validaciones para crear cursos.

// Define las validaciones para la actualización de un curso. // Exporta el arreglo de middlewares de validación.
export const updateCourseValidation = [ // Inicia el arreglo de validaciones para actualizar cursos.
  // TODO: 10 - Validar con isMongoId() el ID recibido por parámetro. // Tarea de consigna 6.
  param("id") // Selecciona el parámetro id de la ruta.
    .isMongoId() // Verifica que sea un ObjectId válido de MongoDB.
    .withMessage("El ID del curso no es válido"), // Mensaje si el ID es inválido.
  // TODO: 11 - Validar title opcional con unicidad excluyendo el propio curso. // Tarea de consigna 6.
  body("title") // Selecciona el campo title del body.
    .optional() // Indica que el título es opcional en la actualización.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .isLength({ min: 3, max: 100 }) // Valida longitud entre 3 y 100 caracteres si se envía.
    .withMessage("El título debe tener entre 3 y 100 caracteres") // Mensaje si la longitud es inválida.
    .custom(async (value, { req }) => { // Agrega validación personalizada de unicidad excluyendo el curso actual.
      // Busca otro curso con el mismo título excluyendo el que se edita. // Evita duplicados al actualizar.
      const existing = await CourseModel.findOne({ // Consulta por título.
        title: value, // Filtra por el título recibido.
        _id: { $ne: req.params.id }, // Excluye el curso actual de la búsqueda.
      }); // Ejecuta la búsqueda.
      // Si existe otro curso con ese título, rechaza la validación. // Garantiza unicidad.
      if (existing) { // Comprueba si se encontró un duplicado.
        throw new Error("El título del curso ya existe"); // Lanza error de unicidad.
      } // Cierra la condición de duplicado.
      // Retorna true si no hay conflictos de unicidad. // Confirma que el título es válido.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación del campo title.
  // TODO: 12 - Validar description opcional. // Tarea de consigna 6.
  body("description") // Selecciona el campo description del body.
    .optional() // Indica que la descripción es opcional.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .isLength({ min: 10, max: 500 }) // Valida longitud entre 10 y 500 caracteres si se envía.
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"), // Mensaje si la longitud es inválida.
  // TODO: 13 - Validar level opcional. // Tarea de consigna 6.
  body("level") // Selecciona el campo level del body.
    .optional() // Indica que el nivel es opcional.
    .isIn(COURSE_LEVELS) // Verifica que el valor esté dentro de los niveles permitidos.
    .withMessage("El nivel proporcionado no es válido"), // Mensaje si el nivel no es permitido.
  // TODO: 14 - Validar price opcional. // Tarea de consigna 6.
  body("price") // Selecciona el campo price del body.
    .optional() // Indica que el precio es opcional.
    .isFloat({ min: 0 }) // Verifica que sea un número mayor o igual a 0.
    .withMessage("El precio debe ser un número mayor o igual a 0"), // Mensaje si el precio es inválido.
  // TODO: 15 - Validar schedule.day opcional. // Tarea de consigna 6.
  body("schedule.day") // Selecciona el campo day dentro de schedule.
    .optional() // Indica que el día es opcional en la actualización.
    .isIn(COURSE_DAYS) // Verifica que el valor esté dentro de los días permitidos.
    .withMessage("El día del horario no es válido"), // Mensaje si el día no es permitido.
  // TODO: 16 - Validar schedule.startTime opcional. // Tarea de consigna 6.
  body("schedule.startTime") // Selecciona el campo startTime dentro de schedule.
    .optional() // Indica que la hora de inicio es opcional.
    .isISO8601() // Verifica que sea una fecha válida en formato ISO 8601.
    .withMessage("La hora de inicio debe ser una fecha válida") // Mensaje si la fecha es inválida.
    .toDate(), // Convierte el valor a objeto Date.
  // TODO: 17 - Validar schedule.endTime opcional y posterior a startTime cuando corresponda. // Tarea de consigna 6.
  body("schedule.endTime") // Selecciona el campo endTime dentro de schedule.
    .optional() // Indica que la hora de fin es opcional.
    .isISO8601() // Verifica que sea una fecha válida en formato ISO 8601.
    .withMessage("La hora de fin debe ser una fecha válida") // Mensaje si la fecha es inválida.
    .toDate() // Convierte el valor a objeto Date.
    .custom(async (value, { req }) => { // Agrega validación personalizada para comparar horas en actualización.
      // Obtiene el curso actual para comparar con valores existentes si es necesario. // Permite validar actualizaciones parciales.
      const course = await CourseModel.findById(req.params.id); // Busca el curso que se está actualizando.
      // Determina la hora de inicio a comparar usando el nuevo valor o el existente. // Soporta actualización parcial del horario.
      const startTime = req.body.schedule?.startTime // Verifica si se envió una nueva hora de inicio.
        ? new Date(req.body.schedule.startTime) // Usa la nueva hora de inicio enviada.
        : course?.schedule?.startTime; // Usa la hora de inicio almacenada si no se envía una nueva.
      // Convierte la hora de fin recibida a objeto Date. // Prepara el valor para la comparación.
      const endTime = new Date(value); // Crea objeto Date con la hora de fin.
      // Verifica que ambas horas existan y que fin sea posterior a inicio. // Aplica la regla de negocio.
      if (startTime && endTime <= new Date(startTime)) { // Comprueba si la hora de fin no es posterior.
        throw new Error("La hora de fin debe ser posterior a la hora de inicio"); // Lanza error de validación.
      } // Cierra la condición de comparación.
      // Retorna true si la validación es correcta. // Confirma que la hora de fin es válida.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación del campo schedule.endTime.
  // TODO: 18 - Validar teacher opcional, existente y activo. // Tarea de consigna 6.
  body("teacher") // Selecciona el campo teacher del body.
    .optional() // Indica que el docente es opcional en la actualización.
    .isMongoId() // Verifica que sea un ObjectId válido de MongoDB.
    .withMessage("El ID del docente no es válido") // Mensaje si el ID es inválido.
    .custom(async (value) => { // Agrega validación personalizada para verificar existencia y estado.
      // Busca el usuario docente por su ID y que no esté eliminado lógicamente. // Consulta docente activo.
      const user = await UserModel.findOne({ _id: value, deletedAt: null }); // Ejecuta búsqueda con filtro de activo.
      // Si no existe o no está activo, lanza un error. // Rechaza docentes inexistentes o eliminados.
      if (!user) { // Comprueba si no se encontró un docente válido.
        throw new Error("El docente no existe o no está activo"); // Lanza error de validación.
      } // Cierra la condición de docente inválido.
      // Retorna true si el docente es válido. // Confirma que la validación pasó.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación del campo teacher.
  // TODO: 19 - Validar topics opcional como array de IDs válidos y existentes. // Tarea de consigna 6.
  body("topics") // Selecciona el campo topics del body.
    .optional() // Indica que los tópicos son opcionales.
    .isArray() // Verifica que el valor sea un arreglo.
    .withMessage("Los tópicos deben enviarse como un arreglo"), // Mensaje si no es un arreglo.
  // Valida cada elemento del arreglo topics en la actualización. // Aplica reglas a todos los IDs enviados.
  body("topics.*") // Selecciona cada elemento dentro del arreglo topics.
    .optional() // Permite manejar arreglos vacíos o elementos opcionales según contexto.
    .isMongoId() // Verifica que cada elemento sea un ObjectId válido.
    .withMessage("Cada tópico debe ser un ID válido") // Mensaje si algún ID es inválido.
    .custom(async (value) => { // Agrega validación personalizada para verificar existencia del tópico.
      // Busca el tópico por su identificador. // Consulta la existencia del tópico.
      const topic = await TopicModel.findById(value); // Ejecuta búsqueda por ID.
      // Si el tópico no existe, lanza un error. // Rechaza referencias inexistentes.
      if (!topic) { // Comprueba si no se encontró el tópico.
        throw new Error("Uno o más tópicos no existen"); // Lanza error de validación.
      } // Cierra la condición de tópico inexistente.
      // Retorna true si el tópico existe. // Confirma que la validación pasó.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación de cada tópico.
]; // Cierra el arreglo de validaciones para actualizar cursos.

// Define la validación para operaciones que solo requieren un ID de curso válido. // Exporta arreglo para getById y delete.
export const courseIdValidation = [ // Inicia el arreglo de validación de ID.
  // Valida el parámetro id recibido en la URL. // Asegura formato correcto de ObjectId.
  param("id") // Selecciona el parámetro id de la ruta.
    .isMongoId() // Verifica que sea un Mongo ObjectId válido.
    .withMessage("El ID del curso no es válido"), // Mensaje si el ID es inválido.
]; // Cierra el arreglo de validación de ID.
