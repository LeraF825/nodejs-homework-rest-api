import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

const userRegisterSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription:Joi.string().required(),
})
const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export default { 
    userRegisterSchema,
     userLoginSchema 
    };