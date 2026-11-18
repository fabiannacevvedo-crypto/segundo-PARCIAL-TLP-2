// ! ARCHIVO BASE: no modificar // Indica que este archivo es base y no debe modificarse según las consignas del examen.
// Importa Router desde express para definir las rutas del recurso. // Permite crear un enrutador modular.
import { Router } from "express"; // Extrae la función Router del paquete express.
// Importa los controladores de cursos para asociarlos a las rutas. // Conecta rutas con lógica de negocio.
import { // Inicia la importación de funciones del controlador.
  createCourse, // Controlador para crear cursos.
  getAllCourses, // Controlador para listar cursos.
  getCourseById, // Controlador para obtener un curso por ID.
  updateCourse, // Controlador para actualizar cursos.
  deleteCourse, // Controlador para eliminar cursos.
} from "../controllers/courses.controller.js"; // Especifica la ruta del controlador de cursos.
// Importa las validaciones de cursos definidas con express-validator. // Reglas de validación para las solicitudes.
import { // Inicia la importación de validaciones.
  createCourseValidation, // Validaciones para la creación de cursos.
  updateCourseValidation, // Validaciones para la actualización de cursos.
  courseIdValidation, // Validación para rutas que requieren ID.
} from "../middlewares/validations/course.validation.js"; // Especifica la ruta del archivo de validaciones.
// Importa el middleware que procesa los resultados de validación. // Maneja errores de validación.
import { validateResult } from "../middlewares/validator.middleware.js"; // Carga el middleware validador.

// Crea una instancia del enrutador de Express. // Objeto que contendrá las rutas de cursos.
export const courseRouter = Router(); // Inicializa y exporta el router de cursos.

// Define la ruta POST para crear un nuevo curso. // Endpoint de creación.
courseRouter.post( // Registra una ruta POST en el router.
  "/courses", // Especifica la ruta del endpoint.
  createCourseValidation, // Aplica las validaciones de creación.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  createCourse // Ejecuta el controlador de creación.
); // Cierra la definición de la ruta POST.

// Define la ruta GET para obtener todos los cursos. // Endpoint de listado.
courseRouter.get( // Registra una ruta GET en el router.
  "/courses", // Especifica la ruta del endpoint.
  getAllCourses // Ejecuta el controlador de listado.
); // Cierra la definición de la ruta GET.

// Define la ruta GET para obtener un curso por su ID. // Endpoint de detalle.
courseRouter.get( // Registra una ruta GET en el router.
  "/courses/:id", // Especifica la ruta con parámetro id.
  courseIdValidation, // Aplica la validación del parámetro id.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  getCourseById // Ejecuta el controlador de obtención por ID.
); // Cierra la definición de la ruta GET por ID.

// Define la ruta PUT para actualizar un curso por su ID. // Endpoint de actualización.
courseRouter.put( // Registra una ruta PUT en el router.
  "/courses/:id", // Especifica la ruta con parámetro id.
  updateCourseValidation, // Aplica las validaciones de actualización.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  updateCourse // Ejecuta el controlador de actualización.
); // Cierra la definición de la ruta PUT.

// Define la ruta DELETE para eliminar un curso por su ID. // Endpoint de eliminación.
courseRouter.delete( // Registra una ruta DELETE en el router.
  "/courses/:id", // Especifica la ruta con parámetro id.
  courseIdValidation, // Aplica la validación del parámetro id.
  validateResult, // Ejecuta el middleware que verifica errores de validación.
  deleteCourse // Ejecuta el controlador de eliminación.
); // Cierra la definición de la ruta DELETE.
