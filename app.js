// ! ARCHIVO BASE: no modificar // Indica que este archivo es base y no debe modificarse según las consignas del examen.
// Importa express para crear la aplicación del servidor. // Framework web utilizado para la API REST.
import express from "express"; // Carga el módulo express.
// Importa dotenv/config para cargar las variables de entorno desde .env. // Habilita el uso de process.env.
import "dotenv/config"; // Ejecuta la configuración automática de dotenv.
// Importa la función para iniciar la conexión a la base de datos. // Conecta la aplicación con MongoDB.
import { startDB } from "./src/config/database.js"; // Carga la función de conexión a la base de datos.
// Importa el router de tópicos para registrar sus rutas. // Incluye los endpoints de tópicos.
import { topicRouter } from "./src/routes/topics.routes.js"; // Carga el enrutador de tópicos.
// Importa el router de cursos para registrar sus rutas. // Incluye los endpoints de cursos.
import { courseRouter } from "./src/routes/courses.routes.js"; // Carga el enrutador de cursos.

// Crea la instancia principal de la aplicación Express. // Objeto que representa el servidor.
const app = express(); // Inicializa la aplicación.
// Define el puerto del servidor usando la variable de entorno o un valor por defecto. // Configura el puerto de escucha.
const PORT = process.env.PORT || 3000; // Asigna el puerto desde entorno o usa 3000.

// Registra el middleware para parsear cuerpos JSON en las solicitudes. // Permite recibir datos JSON en req.body.
app.use(express.json()); // Habilita el parseo de JSON entrante.

// Registra las rutas de la API bajo el prefijo /api. // Monta los routers de tópicos y cursos.
app.use("/api", topicRouter); // Asocia las rutas de tópicos al prefijo /api.
app.use("/api", courseRouter); // Asocia las rutas de cursos al prefijo /api.

// Inicia el servidor y la conexión a la base de datos. // Levanta la aplicación en el puerto configurado.
app.listen(PORT, async () => { // Comienza a escuchar peticiones en el puerto definido.
  // Inicia la conexión con la base de datos MongoDB. // Establece la conexión antes de operar.
  await startDB(); // Espera a que la base de datos se conecte correctamente.
  // Muestra un mensaje indicando que el servidor está en ejecución. // Informa el puerto activo.
  console.log(`Servidor corriendo en el puerto ${PORT}`); // Imprime confirmación en consola.
}); // Cierra la función callback del servidor.
