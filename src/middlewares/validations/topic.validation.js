// ! ARCHIVO BASE: no modificar // Indica que este archivo es base y no debe modificarse según las consignas del examen.
// Importa body y param desde express-validator para definir reglas de validación. // Herramientas para validar cuerpo y parámetros.
import { body, param } from "express-validator"; // Extrae los constructores de validación necesarios.
// Importa el modelo Topic para verificar existencia y unicidad cuando corresponda. // Permite consultas a la colección de tópicos.
import { TopicModel } from "../../models/topic.model.js"; // Carga el modelo de tópicos desde la carpeta de modelos.

// Define las validaciones para la creación de un tópico. // Exporta el arreglo de middlewares de validación.
export const createTopicValidation = [ // Inicia el arreglo de validaciones para crear tópicos.
  // Valida el campo name del cuerpo de la petición. // Aplica reglas al nombre del tópico.
  body("name") // Selecciona el campo name del body.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .notEmpty() // Verifica que el campo no esté vacío.
    .withMessage("El nombre es obligatorio") // Mensaje si falta el nombre.
    .isLength({ min: 2, max: 50 }) // Valida que la longitud esté entre 2 y 50 caracteres.
    .withMessage("El nombre debe tener entre 2 y 50 caracteres") // Mensaje si la longitud es inválida.
    .custom(async (value) => { // Agrega validación personalizada para verificar unicidad.
      // Busca si ya existe un tópico con el mismo nombre. // Consulta la base de datos por nombre.
      const existing = await TopicModel.findOne({ name: value }); // Ejecuta búsqueda por nombre exacto.
      // Si existe, lanza un error para rechazar la validación. // Evita nombres duplicados.
      if (existing) { // Comprueba si se encontró un documento existente.
        throw new Error("El nombre del tópico ya existe"); // Lanza error de unicidad.
      } // Cierra la condición de existencia.
      // Retorna true si la validación pasa correctamente. // Confirma que el nombre es válido.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación personalizada del nombre.
  // Valida el campo description del cuerpo de la petición. // Aplica reglas a la descripción opcional.
  body("description") // Selecciona el campo description del body.
    .optional() // Indica que el campo es opcional.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .isLength({ max: 200 }) // Valida que la longitud máxima sea de 200 caracteres.
    .withMessage("La descripción no debe superar los 200 caracteres"), // Mensaje si excede el máximo.
]; // Cierra el arreglo de validaciones para crear tópicos.

// Define las validaciones para la actualización de un tópico. // Exporta el arreglo de middlewares de validación.
export const updateTopicValidation = [ // Inicia el arreglo de validaciones para actualizar tópicos.
  // Valida el parámetro id recibido en la URL. // Asegura que el identificador sea un ObjectId válido.
  param("id") // Selecciona el parámetro id de la ruta.
    .isMongoId() // Verifica que tenga formato de Mongo ObjectId.
    .withMessage("El ID proporcionado no es válido"), // Mensaje si el ID es inválido.
  // Valida el campo name cuando se envía en la actualización. // Aplica reglas opcionales al nombre.
  body("name") // Selecciona el campo name del body.
    .optional() // Permite que el nombre no se envíe.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .isLength({ min: 2, max: 50 }) // Valida longitud entre 2 y 50 caracteres si se envía.
    .withMessage("El nombre debe tener entre 2 y 50 caracteres") // Mensaje si la longitud es inválida.
    .custom(async (value, { req }) => { // Agrega validación personalizada de unicidad excluyendo el propio tópico.
      // Busca otro tópico con el mismo nombre excluyendo el actual. // Evita duplicados al editar.
      const existing = await TopicModel.findOne({ // Consulta por nombre.
        name: value, // Filtra por el nombre recibido.
        _id: { $ne: req.params.id }, // Excluye el documento que se está editando.
      }); // Ejecuta la búsqueda.
      // Si existe otro tópico con ese nombre, rechaza la validación. // Garantiza unicidad.
      if (existing) { // Comprueba si se encontró un duplicado.
        throw new Error("El nombre del tópico ya existe"); // Lanza error de unicidad.
      } // Cierra la condición de duplicado.
      // Retorna true si no hay conflictos de unicidad. // Confirma que el nombre es válido.
      return true; // Indica éxito en la validación personalizada.
    }), // Cierra la validación personalizada del nombre.
  // Valida el campo description cuando se envía en la actualización. // Aplica reglas opcionales a la descripción.
  body("description") // Selecciona el campo description del body.
    .optional() // Permite que la descripción no se envíe.
    .trim() // Elimina espacios en blanco al inicio y al final.
    .isLength({ max: 200 }) // Valida longitud máxima de 200 caracteres.
    .withMessage("La descripción no debe superar los 200 caracteres"), // Mensaje si excede el máximo.
]; // Cierra el arreglo de validaciones para actualizar tópicos.

// Define la validación para operaciones que solo requieren un ID válido. // Exporta arreglo para getById y delete.
export const topicIdValidation = [ // Inicia el arreglo de validación de ID.
  // Valida el parámetro id recibido en la URL. // Asegura formato correcto de ObjectId.
  param("id") // Selecciona el parámetro id de la ruta.
    .isMongoId() // Verifica que sea un Mongo ObjectId válido.
    .withMessage("El ID proporcionado no es válido"), // Mensaje si el ID es inválido.
]; // Cierra el arreglo de validación de ID.
