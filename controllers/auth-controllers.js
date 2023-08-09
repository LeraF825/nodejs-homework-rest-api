import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import jimp from "jimp";

dotenv.config();
const {JWT_SECRET} = process.env;
const avatarDir = path.resolve("public", "avatars");

const register = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    const avatarURL = gravatar.url(email, { s: "250" });
    if(user) {
        throw HttpError(409, "Email in use");
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body,avatarURL, password: hashPassword});
    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    })
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});
    await User.findOneAndUpdate(user._id, {token});

    res.json({
        token,
    })
}
const getCurrent = (req, res) => {
    const { email, subscription } = req.user;
  
    res.json({ email, subscription });
  };

const logout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Logout success"
    })
}

const changeAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);
  const avatar = await jimp.read(tempUpload);
  await avatar.resize(250, 250);
  await avatar.writeAsync(tempUpload);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });

}
export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    changeAvatar: ctrlWrapper(changeAvatar),
  };
