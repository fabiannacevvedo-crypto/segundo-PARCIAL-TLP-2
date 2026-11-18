// * ARCHIVO A COMPLETAR // Indica que este archivo contiene partes a completar según las consignas.
// Importa Schema y model desde mongoose para definir el esquema y el modelo. // Herramientas base de Mongoose.
import { Schema, model } from "mongoose"; // Extrae las utilidades necesarias de la librería mongoose.

// Define el esquema embebido para el perfil del usuario (relación 1:1 embebida). // Subdocumento que forma parte del usuario.
const profileSchema = new Schema( // Crea un nuevo esquema de Mongoose para el perfil.
  { // Abre la definición de campos del esquema de perfil.
    firstName: { // Define el campo nombre dentro del perfil.
      type: String, // Establece el tipo de dato como cadena de texto.
      required: true, // Indica que el nombre es obligatorio.
      trim: true, // Elimina espacios en blanco al inicio y al final.
    }, // Cierra la definición del campo firstName.
    lastName: { // Define el campo apellido dentro del perfil.
      type: String, // Establece el tipo de dato como cadena de texto.
      required: true, // Indica que el apellido es obligatorio.
      trim: true, // Elimina espacios en blanco al inicio y al final.
    }, // Cierra la definición del campo lastName.
    bio: { // Define el campo biografía dentro del perfil.
      type: String, // Establece el tipo de dato como cadena de texto.
      trim: true, // Elimina espacios en blanco al inicio y al final.
      default: "", // Asigna cadena vacía como valor por defecto.
    }, // Cierra la definición del campo bio.
  }, // Cierra el objeto de campos del perfil.
  { _id: false } // Desactiva la generación automática de _id para el subdocumento embebido.
); // Cierra la creación del esquema de perfil.

// Define el esquema principal del usuario. // Estructura del documento User en la colección.
const userSchema = new Schema( // Crea un nuevo esquema de Mongoose para usuarios.
  { // Abre la definición de campos del esquema de usuario.
    username: { // Define el campo nombre de usuario.
      type: String, // Establece el tipo de dato como cadena de texto.
      required: true, // Indica que el nombre de usuario es obligatorio.
      unique: true, // Exige que el nombre de usuario sea único en la colección.
      trim: true, // Elimina espacios en blanco al inicio y al final.
    }, // Cierra la definición del campo username.
    email: { // Define el campo correo electrónico.
      type: String, // Establece el tipo de dato como cadena de texto.
      required: true, // Indica que el correo es obligatorio.
      unique: true, // Exige que el correo sea único en la colección.
      trim: true, // Elimina espacios en blanco al inicio y al final.
      lowercase: true, // Convierte el correo a minúsculas automáticamente.
    }, // Cierra la definición del campo email.
    password: { // Define el campo contraseña del usuario.
      type: String, // Establece el tipo de dato como cadena de texto.
      required: true, // Indica que la contraseña es obligatoria.
    }, // Cierra la definición del campo password.
    profile: { // Define el campo de perfil embebido (relación 1:1 embebida).
      type: profileSchema, // Usa el esquema de perfil como tipo del subdocumento.
      required: true, // Indica que el perfil es obligatorio.
    }, // Cierra la definición del campo profile.
    // TODO: 1 - Agregar el campo deletedAt (Date, con null como valor por defecto) para la eliminación lógica. // Tarea de consigna 3.
    deletedAt: { // Define el campo para marcar eliminación lógica.
      type: Date, // Establece el tipo de dato como fecha.
      default: null, // Asigna null por defecto para indicar que no está eliminado.
    }, // Cierra la definición del campo deletedAt.
  }, // Cierra el objeto de campos del esquema de usuario.
  { // Abre el objeto de opciones del esquema.
    timestamps: true, // Habilita createdAt y updatedAt automáticamente.
    versionKey: false, // Desactiva el campo __v de versionado.
    // TODO: 3 - Configurar toJSON y toObject con { virtuals: true } en el esquema. // Tarea de consigna 3.
    toJSON: { virtuals: true }, // Incluye campos virtuales al convertir el documento a JSON.
    toObject: { virtuals: true }, // Incluye campos virtuales al convertir el documento a objeto plano.
  } // Cierra el objeto de opciones del esquema.
); // Cierra la creación del esquema de usuario.

// TODO: 2 - Definir el virtual populate courses (ref Course, localField _id, foreignField teacher). // Tarea de consigna 3.
userSchema.virtual("courses", { // Declara un campo virtual llamado courses en el esquema de usuario.
  ref: "Course", // Indica que la relación apunta al modelo Course.
  localField: "_id", // Usa el _id del usuario como campo local de comparación.
  foreignField: "teacher", // Busca cursos cuyo campo teacher coincida con el _id del usuario.
}); // Cierra la definición del virtual populate.

// Exporta el modelo User basado en el esquema definido. // Permite usar el modelo en controladores y validaciones.
export const UserModel = model("User", userSchema); // Crea y exporta el modelo con nombre User.
