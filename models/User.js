import { Schema, model } from "mongoose";
import { handleSaveError, allowUpdateValidate } from "./hooks/index.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
      },
      email: {
        type: String,
        match: emailRegexp,
        required: [true, 'Email is required'],
        unique: true,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: String,
      avatarURL: {
        type: String,
      },
})
userSchema.pre("findOneAndUpdate", allowUpdateValidate);
userSchema.post("save",handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);
const User = model('users', userSchema);
export default User;