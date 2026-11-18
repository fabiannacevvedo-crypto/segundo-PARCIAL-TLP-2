// * ARCHIVO A COMPLETAR // Indica que este archivo contiene partes a completar según las consignas.
// Importa Schema y model desde mongoose para definir el esquema y el modelo. // Herramientas base de Mongoose.
import { Schema, model } from "mongoose"; // Extrae las utilidades necesarias de la librería mongoose.

// Define los valores permitidos para el nivel del curso. // Arreglo utilizado en la validación del campo level.
export const COURSE_LEVELS = ["beginner", "intermediate", "advanced"]; // Exporta los niveles válidos del curso.
// Define los valores permitidos para los días del horario. // Arreglo utilizado en la validación del campo schedule.day.
export const COURSE_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]; // Exporta los días válidos del horario.

// Define el esquema embebido para el horario del curso (relación 1:1 embebida). // Subdocumento Schedule dentro de Course.
const scheduleSchema = new Schema( // Crea un nuevo esquema de Mongoose para el horario.
  { // Abre la definición de campos del esquema de horario.
    // TODO: 5 - Definir schedule.day (String, enum con COURSE_DAYS, obligatorio). // Tarea de consigna 2.
    day: { // Define el campo día del horario.
      type: String, // Establece el tipo de dato como cadena de texto.
      enum: COURSE_DAYS, // Restringe los valores a los días permitidos.
      required: true, // Indica que el día es obligatorio.
    }, // Cierra la definición del campo day.
    // TODO: 6 - Definir schedule.startTime (Date, obligatorio). // Tarea de consigna 2.
    startTime: { // Define el campo hora de inicio.
      type: Date, // Establece el tipo de dato como fecha/hora.
      required: true, // Indica que la hora de inicio es obligatoria.
    }, // Cierra la definición del campo startTime.
    // TODO: 7 - Definir schedule.endTime (Date, obligatorio). // Tarea de consigna 2.
    endTime: { // Define el campo hora de fin.
      type: Date, // Establece el tipo de dato como fecha/hora.
      required: true, // Indica que la hora de fin es obligatoria.
    }, // Cierra la definición del campo endTime.
  }, // Cierra el objeto de campos del esquema de horario.
  { _id: false } // Desactiva la generación automática de _id para el subdocumento embebido.
); // Cierra la creación del esquema de horario.

// Define el esquema principal del curso. // Estructura del documento Course en la colección.
const courseSchema = new Schema( // Crea un nuevo esquema de Mongoose para cursos.
  { // Abre la definición de campos del esquema de curso.
    // TODO: 1 - Definir la propiedad title (String, único, obligatorio, 3 a 100 caracteres). // Tarea de consigna 2.
    title: { // Define el campo título del curso.
      type: String, // Establece el tipo de dato como cadena de texto.
      unique: true, // Exige que el título sea único en la colección.
      required: true, // Indica que el título es obligatorio.
      minlength: 3, // Establece la longitud mínima en 3 caracteres.
      maxlength: 100, // Establece la longitud máxima en 100 caracteres.
      trim: true, // Elimina espacios en blanco al inicio y al final.
    }, // Cierra la definición del campo title.
    // TODO: 2 - Definir la propiedad description (String, obligatorio, 10 a 500 caracteres). // Tarea de consigna 2.
    description: { // Define el campo descripción del curso.
      type: String, // Establece el tipo de dato como cadena de texto.
      required: true, // Indica que la descripción es obligatoria.
      minlength: 10, // Establece la longitud mínima en 10 caracteres.
      maxlength: 500, // Establece la longitud máxima en 500 caracteres.
      trim: true, // Elimina espacios en blanco al inicio y al final.
    }, // Cierra la definición del campo description.
    // TODO: 3 - Definir la propiedad level (String, enum COURSE_LEVELS, default beginner). // Tarea de consigna 2.
    level: { // Define el campo nivel del curso.
      type: String, // Establece el tipo de dato como cadena de texto.
      enum: COURSE_LEVELS, // Restringe los valores a los niveles permitidos.
      default: "beginner", // Establece beginner como valor por defecto.
    }, // Cierra la definición del campo level.
    // TODO: 4 - Definir la propiedad price (Number, mínimo 0, default 0). // Tarea de consigna 2.
    price: { // Define el campo precio del curso.
      type: Number, // Establece el tipo de dato como numérico.
      min: 0, // Establece el valor mínimo permitido en 0.
      default: 0, // Establece 0 como valor por defecto.
    }, // Cierra la definición del campo price.
    // TODO: 5-7 - Definir la propiedad schedule (documento embebido 1:1 con day, startTime, endTime). // Tarea de consigna 2.
    schedule: { // Define el campo horario embebido del curso.
      type: scheduleSchema, // Usa el esquema de horario como tipo del subdocumento.
      required: true, // Indica que el horario es obligatorio.
    }, // Cierra la definición del campo schedule.
    // TODO: 8 - Definir la propiedad teacher (ObjectId, obligatorio, ref User). // Tarea de consigna 2.
    teacher: { // Define el campo docente del curso.
      type: Schema.Types.ObjectId, // Establece el tipo como identificador de MongoDB.
      ref: "User", // Indica que referencia al modelo User.
      required: true, // Indica que el docente es obligatorio.
    }, // Cierra la definición del campo teacher.
    // TODO: 9 - Definir la propiedad topics (array de ObjectId, ref Topic). // Tarea de consigna 2.
    topics: [ // Define el campo de tópicos como arreglo de referencias.
      { // Abre la definición del tipo de cada elemento del arreglo.
        type: Schema.Types.ObjectId, // Establece el tipo como identificador de MongoDB.
        ref: "Topic", // Indica que cada elemento referencia al modelo Topic.
      }, // Cierra la definición del elemento del arreglo.
    ], // Cierra el arreglo de tópicos.
  }, // Cierra el objeto de campos del esquema de curso.
  { // Abre el objeto de opciones del esquema.
    timestamps: true, // Habilita createdAt y updatedAt automáticamente.
    versionKey: false, // Desactiva el campo __v de versionado.
  } // Cierra el objeto de opciones del esquema.
); // Cierra la creación del esquema de curso.

// Exporta el modelo Course basado en el esquema definido. // Permite usar el modelo en controladores y validaciones.
export const CourseModel = model("Course", courseSchema); // Crea y exporta el modelo con nombre Course.
