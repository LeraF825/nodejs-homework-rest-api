import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks/index.js";

const contactShema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
})

contactShema.post("save",handleSaveError);
const Contact = model('contact', contactShema);
export default Contact;