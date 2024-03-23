import User from "../models/User.js";
import jwt from "jsonwebtoken";
const loginService = (email) =>
  User.findOne({ email: email }).select("+password");
//select("+password") pede para trazer o password, pois ele não virá normalmente devido ao select.

//Guardar a sessão do usuário
const generateToken = (id) =>
  jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 });

export { loginService, generateToken };
