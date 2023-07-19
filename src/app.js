import express from "express";
import router from "./routes/index.routes.js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(router);

dotenv.config();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));