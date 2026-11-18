// ! ARCHIVO BASE: no modificar // Indica que este archivo es base y no debe modificarse según las consignas del examen.
// Importa mongoose para gestionar la conexión y los modelos con MongoDB. // Trae la librería ODM Mongoose.
import mongoose from "mongoose"; // Ejecuta la importación del módulo mongoose.

// Función asíncrona encargada de iniciar la conexión a la base de datos. // Declara y exporta la función startDB.
export const startDB = async () => { // Abre la definición de la función flecha asíncrona exportada.
  try { // Inicia un bloque try para capturar errores de conexión.
    // Obtiene la URI de conexión desde las variables de entorno. // Lee MONGODB_URI definida en el archivo .env.
    const uri = process.env.MONGODB_URI; // Asigna la cadena de conexión a la constante uri.
    // Conecta Mongoose a la base de datos usando la URI obtenida. // Realiza la conexión asíncrona a MongoDB.
    await mongoose.connect(uri); // Espera a que se establezca la conexión con MongoDB.
    // Muestra un mensaje en consola indicando que la conexión fue exitosa. // Informa al desarrollador del estado.
    console.log("Conexión a la base de datos establecida correctamente"); // Imprime confirmación de conexión.
  } catch (error) { // Captura cualquier error ocurrido durante la conexión.
    // Muestra en consola el error producido al intentar conectar. // Facilita el diagnóstico de problemas.
    console.error("Error al conectar con la base de datos:", error.message); // Imprime el mensaje de error.
    // Finaliza el proceso con código de error si no se pudo conectar. // Evita que la app funcione sin BD.
    process.exit(1); // Termina la ejecución del proceso con estado de fallo.
  } // Cierra el bloque catch.
}; // Cierra la definición de la función startDB.
