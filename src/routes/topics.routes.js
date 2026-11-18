// ! ARCHIVO BASE: no modificar // Indica que este archivo es base y no debe modificarse según las consignas del examen.
// Importa Router desde express para definir las rutas del recurso. // Permite crear un enrutador modular.
import { Router } from "express"; // Extrae la función Router del paquete express.
// Importa los controladores de tópicos para asociarlos a las rutas. // Conecta rutas con lógica de negocio.
import { // Inicia la importación de funciones del controlador.
  createTopic, // Controlador para crear tópicos.
  getAllTopics, // Controlador para listar tópicos.
  getTopicById, // Controlador para obtener un tópico por ID.
  updateTopic, // Controlador para actualizar tópicos.
  deleteTopic, // Controlador para eliminar tópicos.
} from "../controllers/topics.controller.js"; // Especifica la ruta del controlador de tópicos.
// Importa las validaciones de tópicos definidas con express-validator. // Reglas de validación para las solicitudes.
import { // Inicia la importación de validaciones.
  createTopicValidation, // Validaciones para la creación de tópicos.
  updateTopicValidation, // Validaciones para la actualización de tópicos.
  topicIdValidation, // Validación para rutas que requieren ID.
} from "../middlewares/validations/topic.validation.js"; // Especifica la ruta del archivo de validaciones.
// Importa el middleware que procesa los resultados de validación. // Maneja errores de validación.
import { validateResult } from "../middlewares/validator.middleware.js"; // Carga el middleware validador.

// Crea una instancia del enrutador de Express. // Objeto que contendrá las rutas de tópicos.
export const topicRouter = Router(); // Inicializa y exporta el router de tópicos.

// Define la ruta POST para crear un nuevo tópico. // Endpoint de creación.
topicRouter.post( // Registra una ruta POST en el router.
  "/topics", // Especifica la ruta del endpoint.
  createTopicValidation, // Aplica las validaciones de creación.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  createTopic // Ejecuta el controlador de creación.
); // Cierra la definición de la ruta POST.

// Define la ruta GET para obtener todos los tópicos. // Endpoint de listado.
topicRouter.get( // Registra una ruta GET en el router.
  "/topics", // Especifica la ruta del endpoint.
  getAllTopics // Ejecuta el controlador de listado.
); // Cierra la definición de la ruta GET.

// Define la ruta GET para obtener un tópico por su ID. // Endpoint de detalle.
topicRouter.get( // Registra una ruta GET en el router.
  "/topics/:id", // Especifica la ruta con parámetro id.
  topicIdValidation, // Aplica la validación del parámetro id.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  getTopicById // Ejecuta el controlador de obtención por ID.
); // Cierra la definición de la ruta GET por ID.

// Define la ruta PUT para actualizar un tópico por su ID. // Endpoint de actualización.
topicRouter.put( // Registra una ruta PUT en el router.
  "/topics/:id", // Especifica la ruta con parámetro id.
  updateTopicValidation, // Aplica las validaciones de actualización.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  updateTopic // Ejecuta el controlador de actualización.
); // Cierra la definición de la ruta PUT.

// Define la ruta DELETE para eliminar un tópico por su ID. // Endpoint de eliminación.
topicRouter.delete( // Registra una ruta DELETE en el router.
  "/topics/:id", // Especifica la ruta con parámetro id.
  topicIdValidation, // Aplica la validación del parámetro id.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  deleteTopic // Ejecuta el controlador de eliminación.
); // Cierra la definición de la ruta DELETE.
