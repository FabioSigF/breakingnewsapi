import { Router } from "express";
const router = Router();

import swaggerUi from "swagger-ui-express";
import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 
const swaggerDocument = require("../swagger.json")


router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

export default router;
