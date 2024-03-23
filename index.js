import express from "express";
import dotEnv from "dotenv";
import connectDb from "./src/database/db.js";

import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/news.route.js";
import swaggerRoute from "./src/routes/swagger.route.js";

dotEnv.config();

const app = express();
const port = process.env.PORT || 3000; //todo servidor possui uma porta padrão. Ou seja, será essa porta padrão do servidor ou a porta 3000.

connectDb();

app.use(express.json()); //habilita aplicação para enviar e receber json
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/doc", swaggerRoute);

app.listen(port);
