// ! ARCHIVO BASE: no modificar (excepto eliminación en cascada en delete) // Base provista; se completa la cascada solicitada.
// * ARCHIVO A COMPLETAR // Contiene la tarea de eliminación en cascada en el método delete.
// Importa matchedData para obtener únicamente los datos validados. // Asegura uso de datos limpios en el controlador.
import { matchedData } from "express-validator"; // Extrae la función matchedData de express-validator.
// Importa el modelo Topic para realizar operaciones sobre tópicos. // Permite consultas y modificaciones en la colección.
import { TopicModel } from "../models/topic.model.js"; // Carga el modelo de tópicos.
// Importa el modelo Course para aplicar la eliminación en cascada. // Permite actualizar cursos que referencian el tópico.
import { CourseModel } from "../models/course.model.js"; // Carga el modelo de cursos.

// Controlador para crear un nuevo tópico. // Maneja la solicitud POST de creación.
export const createTopic = async (req, res) => { // Define y exporta la función controladora createTopic.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Usa matchedData para trabajar solo con datos permitidos.
    const data = matchedData(req); // Extrae los campos validados del request.
    // Crea una nueva instancia del modelo Topic con los datos recibidos. // Prepara el documento a guardar.
    const topic = new TopicModel(data); // Instancia el modelo con los datos validados.
    // Guarda el nuevo tópico en la base de datos. // Persiste el documento en MongoDB.
    await topic.save(); // Ejecuta la operación de guardado asíncrona.
    // Responde con estado 201 y el tópico creado. // Informa éxito en la creación.
    return res.status(201).json({ // Envía respuesta JSON con código 201.
      message: "Tópico creado correctamente", // Mensaje descriptivo de éxito.
      data: topic, // Incluye el documento creado en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la creación.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al crear el tópico", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función createTopic.

// Controlador para obtener todos los tópicos. // Maneja la solicitud GET de listado.
export const getAllTopics = async (req, res) => { // Define y exporta la función controladora getAllTopics.
  try { // Inicia bloque try para capturar errores.
    // Busca todos los tópicos en la base de datos. // Recupera los documentos de la colección.
    const topics = await TopicModel.find(); // Ejecuta la consulta para obtener todos los tópicos.
    // Responde con estado 200 y la lista de tópicos. // Devuelve el listado solicitado.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Tópicos obtenidos correctamente", // Mensaje descriptivo de éxito.
      data: topics, // Incluye el arreglo de tópicos en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la consulta.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al obtener los tópicos", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función getAllTopics.

// Controlador para obtener un tópico por su ID. // Maneja la solicitud GET de detalle.
export const getTopicById = async (req, res) => { // Define y exporta la función controladora getTopicById.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Extrae el id validado de los parámetros.
    const { id } = matchedData(req); // Desestructura el identificador validado.
    // Busca el tópico por su identificador e incluye los cursos relacionados. // Usa populate del virtual courses.
    const topic = await TopicModel.findById(id).populate("courses"); // Ejecuta búsqueda por ID con populate.
    // Verifica si el tópico existe en la base de datos. // Comprueba el resultado de la búsqueda.
    if (!topic) { // Evalúa si no se encontró el documento.
      // Responde con estado 404 si el tópico no existe. // Informa que el recurso no fue encontrado.
      return res.status(404).json({ // Envía respuesta JSON con código 404.
        message: "Tópico no encontrado", // Mensaje descriptivo del resultado.
      }); // Cierra el objeto de respuesta.
    } // Cierra la condición de tópico inexistente.
    // Responde con estado 200 y el tópico encontrado. // Devuelve el recurso solicitado.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Tópico obtenido correctamente", // Mensaje descriptivo de éxito.
      data: topic, // Incluye el tópico encontrado en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la consulta.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al obtener el tópico", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función getTopicById.

// Controlador para actualizar un tópico existente. // Maneja la solicitud PUT/PATCH de edición.
export const updateTopic = async (req, res) => { // Define y exporta la función controladora updateTopic.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Incluye id y campos a actualizar.
    const data = matchedData(req); // Extrae todos los datos validados.
    // Separa el id del resto de los datos a actualizar. // Permite buscar y modificar el documento.
    const { id, ...updateData } = data; // Desestructura id y agrupa el resto en updateData.
    // Busca el tópico por su identificador. // Localiza el documento a modificar.
    const topic = await TopicModel.findById(id); // Ejecuta búsqueda por ID.
    // Verifica si el tópico existe antes de editarlo. // Cumple verificación de existencia previa.
    if (!topic) { // Evalúa si no se encontró el documento.
      // Responde con estado 404 si el tópico no existe. // Informa que el recurso no fue encontrado.
      return res.status(404).json({ // Envía respuesta JSON con código 404.
        message: "Tópico no encontrado", // Mensaje descriptivo del resultado.
      }); // Cierra el objeto de respuesta.
    } // Cierra la condición de tópico inexistente.
    // Asigna manualmente los campos recibidos al documento encontrado. // Modifica el documento según lo solicitado.
    Object.assign(topic, updateData); // Copia las propiedades actualizadas al documento.
    // Guarda los cambios realizados en la base de datos. // Persiste la actualización de forma manual.
    await topic.save(); // Ejecuta la operación de guardado.
    // Responde con estado 200 y el tópico actualizado. // Devuelve el recurso modificado.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Tópico actualizado correctamente", // Mensaje descriptivo de éxito.
      data: topic, // Incluye el tópico actualizado en la respuesta.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la actualización.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al actualizar el tópico", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función updateTopic.

// Controlador para eliminar un tópico. // Maneja la solicitud DELETE.
export const deleteTopic = async (req, res) => { // Define y exporta la función controladora deleteTopic.
  try { // Inicia bloque try para capturar errores.
    // Obtiene los datos validados desde la solicitud. // Extrae el id validado de los parámetros.
    const { id } = matchedData(req); // Desestructura el identificador validado.
    // Busca el tópico por su identificador. // Localiza el documento a eliminar.
    const topic = await TopicModel.findById(id); // Ejecuta búsqueda por ID.
    // Verifica si el tópico existe antes de eliminarlo. // Cumple verificación de existencia previa.
    if (!topic) { // Evalúa si no se encontró el documento.
      // Responde con estado 404 si el tópico no existe. // Informa que el recurso no fue encontrado.
      return res.status(404).json({ // Envía respuesta JSON con código 404.
        message: "Tópico no encontrado", // Mensaje descriptivo del resultado.
      }); // Cierra el objeto de respuesta.
    } // Cierra la condición de tópico inexistente.
    // Elimina el tópico de la base de datos. // Remueve el documento de la colección.
    await TopicModel.findByIdAndDelete(id); // Ejecuta la eliminación del tópico por ID.
    // TODO: 1 (Consigna 4) - Quitar el tópico del array topics de todos los cursos que lo referencian. // Tarea de cascada.
    // Busca todos los cursos que contienen el tópico en su array topics. // Identifica cursos afectados por la eliminación.
    const courses = await CourseModel.find({ topics: id }); // Consulta cursos que referencian el tópico eliminado.
    // Recorre cada curso encontrado para actualizar su array de tópicos. // Aplica la cascada de forma manual.
    for (const course of courses) { // Itera sobre la lista de cursos afectados.
      // Filtra el array topics para quitar el id del tópico eliminado. // Remueve la referencia al tópico.
      course.topics = course.topics.filter( // Crea un nuevo arreglo sin el tópico eliminado.
        (topicId) => topicId.toString() !== id.toString() // Compara ids como cadenas para excluir el eliminado.
      ); // Cierra la función de filtrado.
      // Guarda el curso actualizado en la base de datos. // Persiste el cambio en cada curso afectado.
      await course.save(); // Ejecuta el guardado manual del curso modificado.
    } // Cierra el bucle de actualización de cursos.
    // Responde con estado 200 confirmando la eliminación. // Informa éxito en la operación.
    return res.status(200).json({ // Envía respuesta JSON con código 200.
      message: "Tópico eliminado correctamente", // Mensaje descriptivo de éxito.
    }); // Cierra el objeto de respuesta.
  } catch (error) { // Captura errores ocurridos durante la eliminación.
    // Responde con estado 500 ante un error interno. // Informa fallo del servidor.
    return res.status(500).json({ // Envía respuesta JSON con código 500.
      message: "Error al eliminar el tópico", // Mensaje descriptivo del error.
      error: error.message, // Detalle del error ocurrido.
    }); // Cierra el objeto de respuesta.
  } // Cierra el bloque catch.
}; // Cierra la función deleteTopic.
