//O papel do service é se conectar com o banco
import User from "../models/User.js";

const createService = (body) => User.create(body);
const findAllService = () => User.find();
const findByIdService = (id) => User.findById(id);
const updateByIdService = (
  id,
  name,
  username,
  email,
  password,
  avatar,
  background
) =>
  User.findByIdAndUpdate(
    { _id: id },
    { name, username, email, password, avatar, background }
  );

export default {
  createService,
  findAllService,
  findByIdService,
  updateByIdService,
};
