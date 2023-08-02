import express from "express";
import contactsService from "../../models/contacts.js";
import Joi from "joi";

const contactsRouter = express.Router();
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
    const result = await contactsService.listContacts();
    res.json(result)
  }
  catch (error){
next(error)
  }
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try{
const {contactId} = req.params;
const result = await contactsService.getContactById(contactId);
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

contactsRouter.post('/', async (req, res, next) => {
  try{
const {error} = contactAddSchema.validate(req.body);
if(error){
  return res.status(400).json({message: error.message})
}
const {name, email, phone} = req.body;
const result = await contactsService.addContact({name, email, phone});
res.json(result);
  }
  catch(error){
    next(error);
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
 try{
  const {contactId} = req.params;
const result = await contactsService.removeContact(contactId);
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
    const {name, email, phone} = req.body;
    const result = await contactsService.updateContact(contactId,{name, email, phone});
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
