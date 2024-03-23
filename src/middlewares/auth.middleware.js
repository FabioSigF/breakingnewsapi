import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userService from "../services/user.service.js";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.sendStatus(401);
    }

    const [schema, token] = authorization.split(" ");

    if (!schema && !token) {
      return res.sendStatus(401);
    }

    if (schema !== "Bearer") {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_JWT, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Token inválido." });
      }
      const user = await userService.findByIdService(decoded.id);

      if (!user || !user.id) {
        return res.status(401).send({ message: "Token inválido." });
      }

      req.userId = user.id;
      return next();
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
