import { Router } from "express"
import { createChoice, voteOnChoice } from "../controllers/choice.controllers.js";

const choiceRouter = Router()

choiceRouter.post("/choice", createChoice);
choiceRouter.post("/choice/:id/vote", voteOnChoice);

export default choiceRouter