import express from "express";
import Contact from "../../models/Contact.js";
import Joi from "joi";
import upload from "../../middlewares/upload.js";
import fs from 'fs/promises';
import path from 'path';

const contactsRouter = express.Router();
const avatarPath = path.resolve('public','avatars');

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
  })
})

contactsRouter.get('/', async (req, res, next) => {
  try{
    const result = await Contact.find();
    res.json(result)
  }
  catch (error){
next(error)
  }
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try{
const {contactId} = req.params;
const result = await Contact.findOne({_id:contactId});
if(!result){
  return res.status(404).json({
    message: `Contact with id=${contactId} not found`
  })
}
res.json(result);
  }
  catch(error){
next(error)
  } 
})

contactsRouter.post('/', upload.single('avatarURL'), async (req, res, next) => {
  try{
const {error} = contactAddSchema.validate(req.body);
if(error){
  return res.status(400).json({message: error.message})
}
const result = await Contact.create({ ...req.body, avatarURL, owner });
res.status(201).json(result);
  }
  catch(error){
    next(error);
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
 try{
  const {contactId} = req.params;
const result = await Contact.findByIdAndDelete({_id:contactId});
res.json(result)
 }
 catch(error){
  next(error);
 }
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  try{
    const {error} = contactAddSchema.validate(req.body);
    if(error){
      return res.status(400).json({message: error.message})
    }
    const {contactId} = req.params;
    const {name, email, phone, favorite} = req.body;
    const result = await Contact.findByIdAndUpdate({_id:contactId},req.body,{new:true});
    if(!result){
      return res.status(404).json({
        message: `Contact with id=${contactId} not found`
      })
    }
    res.json(result);
      }
      catch(error){
        next(error);
      }
})

contactsRouter.patch('/:contactId/favorite', async (req, res, next) => {
try{
  const {contactId} = req.params;
  const {favorite} = req.body;
  if(favorite){
    return res.status(400).json({message: error.message})
  }
  const result = await Contact.findByIdAndUpdate({_id:contactId},req.body,{new:true});
  if(!result){
    return res.status(404).json({
      message: `Contact with id=${contactId} not found`
    })
  }
  res.json(result);
}
catch(error){
  next(error);
}
})

export default contactsRouter;
