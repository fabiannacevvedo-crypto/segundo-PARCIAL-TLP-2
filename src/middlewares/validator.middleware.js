// ! ARCHIVO BASE: no modificar // Indica que este archivo es base y no debe modificarse según las consignas del examen.
// Importa validationResult para obtener los errores de validación de express-validator. // Permite leer resultados de validaciones.
import { validationResult } from "express-validator"; // Extrae la función validationResult del paquete express-validator.

// Middleware que verifica si existen errores de validación en la petición. // Define y exporta el middleware validador.
export const validateResult = (req, res, next) => { // Declara la función middleware con req, res y next.
  // Obtiene el resultado de las validaciones ejecutadas previamente en la ruta. // Recopila errores asociados a la solicitud.
  const errors = validationResult(req); // Ejecuta validationResult sobre la petición actual.
  // Verifica si el resultado contiene algún error. // Comprueba si la validación falló.
  if (!errors.isEmpty()) { // Evalúa si el arreglo de errores no está vacío.
    // Responde con estado 400 y la lista de errores encontrados. // Devuelve errores de validación al cliente.
    return res.status(400).json({ errors: errors.array() }); // Envía respuesta JSON con código 400 y detalles.
  } // Cierra la condición de errores presentes.
  // Continúa con el siguiente middleware o controlador si no hay errores. // Pasa el control al siguiente handler.
  return next(); // Llama a next para seguir con la cadena de middlewares.
}; // Cierra la definición del middleware validateResult.
