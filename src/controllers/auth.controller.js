import bcrypt from "bcrypt";
import { generateToken, loginService } from "../services/auth.service.js";
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email);

    if (!user) {
      return res.status(404).send({ message: "Usuário ou senha incorretos." });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid || !user) {
      return res.status(400).send({ message: "Usuário ou senha incorretos." });
    }

    const token = generateToken(user.id);

    return res.send({token});

  } catch (err) {
    res.status(500).send(err.message);
  }
};

export { login };
