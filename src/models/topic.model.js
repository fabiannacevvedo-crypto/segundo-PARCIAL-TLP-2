// * ARCHIVO A COMPLETAR // Indica que este archivo contiene partes a completar según las consignas.
// Importa Schema y model desde mongoose para definir el esquema y el modelo. // Herramientas base de Mongoose.
import { Schema, model } from "mongoose"; // Extrae las utilidades necesarias de la librería mongoose.

// Define el esquema del tópico. // Estructura del documento Topic en la colección.
const topicSchema = new Schema( // Crea un nuevo esquema de Mongoose para tópicos.
  { // Abre la definición de campos del esquema de tópico.
    // TODO: 1 - Definir la propiedad name (String, único, obligatorio, 2 a 50 caracteres). // Tarea de consigna 2.
    name: { // Define el campo nombre del tópico.
      type: String, // Establece el tipo de dato como cadena de texto.
      unique: true, // Exige que el nombre sea único en la colección.
      required: true, // Indica que el nombre es obligatorio.
      minlength: 2, // Establece la longitud mínima en 2 caracteres.
      maxlength: 50, // Establece la longitud máxima en 50 caracteres.
      trim: true, // Elimina espacios en blanco al inicio y al final.
    }, // Cierra la definición del campo name.
    // TODO: 2 - Definir la propiedad description (String, opcional, máximo 200 caracteres). // Tarea de consigna 2.
    description: { // Define el campo descripción del tópico.
      type: String, // Establece el tipo de dato como cadena de texto.
      maxlength: 200, // Establece la longitud máxima en 200 caracteres.
      trim: true, // Elimina espacios en blanco al inicio y al final.
    }, // Cierra la definición del campo description.
  }, // Cierra el objeto de campos del esquema de tópico.
  { // Abre el objeto de opciones del esquema.
    timestamps: true, // Habilita createdAt y updatedAt automáticamente.
    versionKey: false, // Desactiva el campo __v de versionado.
    // TODO: 4 - Configurar toJSON y toObject con { virtuals: true } en el esquema. // Tarea de consigna 3.
    toJSON: { virtuals: true }, // Incluye campos virtuales al convertir el documento a JSON.
    toObject: { virtuals: true }, // Incluye campos virtuales al convertir el documento a objeto plano.
  } // Cierra el objeto de opciones del esquema.
); // Cierra la creación del esquema de tópico.

// TODO: 3 - Definir el virtual populate courses que devuelva los cursos que incluyen el tópico en su array topics. // Tarea de consigna 3.
topicSchema.virtual("courses", { // Declara un campo virtual llamado courses en el esquema de tópico.
  ref: "Course", // Indica que la relación apunta al modelo Course.
  localField: "_id", // Usa el _id del tópico como campo local de comparación.
  foreignField: "topics", // Busca cursos cuyo array topics contenga el _id del tópico.
}); // Cierra la definición del virtual populate.

// Exporta el modelo Topic basado en el esquema definido. // Permite usar el modelo en controladores y validaciones.
export const TopicModel = model("Topic", topicSchema); // Crea y exporta el modelo con nombre Topic.
