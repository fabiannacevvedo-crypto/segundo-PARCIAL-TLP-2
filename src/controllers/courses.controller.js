// * ARCHIVO A COMPLETAR // Indica que este archivo contiene las tareas a resolver según las consignas.
// Importa matchedData para obtener únicamente los datos validados. // Asegura uso de datos limpios en el controlador.
import { matchedData } from "express-validator"; // Extrae la función matchedData de express-validator.
// Importa el modelo Course para realizar operaciones sobre cursos. // Permite consultas y modificaciones en la colección.
import { CourseModel } from "../models/course.model.js"; // Carga el modelo de cursos.

// Controlador para crear un nuevo curso. // Maneja la solicitud POST de creación.
export const createCourse = async (req, res) => { // Define y exporta la función controladora createCourse.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Usa matchedData para trabajar solo con datos permitidos.
    const data = matchedData(req); // Extrae los campos validados del request.
    // TODO: 1 - Crear un curso con su teacher y sus topics. // Tarea de consigna 5.
    // Crea una nueva instancia del modelo Course con los datos validados. // Prepara el documento incluyendo docente y tópicos.
    const course = new CourseModel(data); // Instancia el modelo con teacher y topics incluidos en data.
    // Guarda el nuevo curso en la base de datos. // Persiste el documento en MongoDB.
    await course.save(); // Ejecuta la operación de guardado asíncrona.
    // Responde con estado 201 y el curso creado. // Informa éxito en la creación.
    return res.status(201).json({ // Envía respuesta JSON con código 201.
      message: "Curso creado correctamente", // Mensaje descriptivo de éxito.
      data: course, // Incluye el documento creado en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la creación.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al crear el curso", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función createCourse.

// Controlador para obtener todos los cursos. // Maneja la solicitud GET de listado.
export const getAllCourses = async (req, res) => { // Define y exporta la función controladora getAllCourses.
  try { // Inicia bloque try para capturar errores.
    // TODO: 2 - Listar todos los cursos con populate de teacher y topics. // Tarea de consigna 5.
    // Busca todos los cursos y popula las referencias de docente y tópicos. // Recupera datos relacionados.
    const courses = await CourseModel.find() // Inicia la consulta para obtener todos los cursos.
      .populate("teacher") // Rellena el campo teacher con los datos del usuario docente.
      .populate("topics"); // Rellena el campo topics con los datos de los tópicos asociados.
    // Responde con estado 200 y la lista de cursos. // Devuelve el listado solicitado.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Cursos obtenidos correctamente", // Mensaje descriptivo de éxito.
      data: courses, // Incluye el arreglo de cursos en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la consulta.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al obtener los cursos", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función getAllCourses.

// Controlador para obtener un curso por su ID. // Maneja la solicitud GET de detalle.
export const getCourseById = async (req, res) => { // Define y exporta la función controladora getCourseById.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Extrae el id validado de los parámetros.
    const { id } = matchedData(req); // Desestructura el identificador validado.
    // TODO: 3 - Obtener un curso con populate de teacher y topics. // Tarea de consigna 5.
    // Busca el curso por su identificador y popula docente y tópicos. // Recupera el curso con sus relaciones.
    const course = await CourseModel.findById(id) // Inicia la búsqueda por ID.
      .populate("teacher") // Rellena el campo teacher con los datos del docente.
      .populate("topics"); // Rellena el campo topics con los datos de los tópicos.
    // Verifica si el curso existe en la base de datos. // Comprueba el resultado de la búsqueda.
    if (!course) { // Evalúa si no se encontró el documento.
      // Responde con estado 404 si el curso no existe. // Informa que el recurso no fue encontrado.
      return res.status(404).json({ // Envía respuesta JSON con código 404.
        message: "Curso no encontrado", // Mensaje descriptivo del resultado.
      }); // Cierra el objeto de respuesta.
    } // Cierra la condición de curso inexistente.
    // Responde con estado 200 y el curso encontrado. // Devuelve el recurso solicitado.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Curso obtenido correctamente", // Mensaje descriptivo de éxito.
      data: course, // Incluye el curso encontrado en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la consulta.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al obtener el curso", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función getCourseById.

// Controlador para actualizar un curso existente. // Maneja la solicitud PUT de edición.
export const updateCourse = async (req, res) => { // Define y exporta la función controladora updateCourse.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Incluye id y campos a actualizar.
    const data = matchedData(req); // Extrae todos los datos validados.
    // Separa el id del resto de los datos a actualizar. // Permite buscar y modificar el documento.
    const { id, ...updateData } = data; // Desestructura id y agrupa el resto en updateData.
    // TODO: 4 - Editar un curso y sus topics: buscar el curso, asignar los datos recibidos y guardarlo. // Tarea de consigna 5.
    // Busca el curso por su identificador. // Localiza el documento a modificar.
    const course = await CourseModel.findById(id); // Ejecuta búsqueda por ID.
    // Verifica si el curso existe antes de editarlo. // Cumple verificación de existencia previa.
    if (!course) { // Evalúa si no se encontró el documento.
      // Responde con estado 404 si el curso no existe. // Informa que el recurso no fue encontrado.
      return res.status(404).json({ // Envía respuesta JSON con código 404.
        message: "Curso no encontrado", // Mensaje descriptivo del resultado.
      }); // Cierra el objeto de respuesta.
    } // Cierra la condición de curso inexistente.
    // Asigna manualmente los campos recibidos al documento encontrado. // Modifica el curso incluyendo sus tópicos.
    Object.assign(course, updateData); // Copia las propiedades actualizadas al documento del curso.
    // Guarda los cambios realizados en la base de datos. // Persiste la actualización de forma manual.
    await course.save(); // Ejecuta la operación de guardado.
    // Responde con estado 200 y el curso actualizado. // Devuelve el recurso modificado.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Curso actualizado correctamente", // Mensaje descriptivo de éxito.
      data: course, // Incluye el curso actualizado en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la actualización.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al actualizar el curso", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función updateCourse.

// Controlador para eliminar un curso. // Maneja la solicitud DELETE.
export const deleteCourse = async (req, res) => { // Define y exporta la función controladora deleteCourse.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Extrae el id validado de los parámetros.
    const { id } = matchedData(req); // Desestructura el identificador validado.
    // TODO: 5 - Eliminar un curso. // Tarea de consigna 5.
    // Busca el curso por su identificador. // Localiza el documento a eliminar.
    const course = await CourseModel.findById(id); // Ejecuta búsqueda por ID.
    // Verifica si el curso existe antes de eliminarlo. // Cumple verificación de existencia previa.
    if (!course) { // Evalúa si no se encontró el documento.
      // Responde con estado 404 si el curso no existe. // Informa que el recurso no fue encontrado.
      return res.status(404).json({ // Envía respuesta JSON con código 404.
        message: "Curso no encontrado", // Mensaje descriptivo del resultado.
      }); // Cierra el objeto de respuesta.
    } // Cierra la condición de curso inexistente.
    // Elimina el curso de la base de datos. // Remueve el documento de la colección.
    await CourseModel.findByIdAndDelete(id); // Ejecuta la eliminación del curso por ID.
    // Responde con estado 200 confirmando la eliminación. // Informa éxito en la operación.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Curso eliminado correctamente", // Mensaje descriptivo de éxito.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la eliminación.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al eliminar el curso", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función deleteCourse.
