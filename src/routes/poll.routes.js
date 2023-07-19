import { Router } from "express"
import { pollSchema } from "../schemas/pollSchemas.js"
import { schemaValidation } from "../middleWares/schemaValidation.js"
import {
    createPoll,
    getAllPolls,
    getChoicesByPollId,
    getPollResult
} from "../controllers/poll.controller.js"

const pollRouter = Router()

pollRouter.post("/poll", schemaValidation(pollSchema), createPoll);
pollRouter.get("/poll", getAllPolls);
pollRouter.get("/poll/:id/choice", getChoicesByPollId);
pollRouter.get("/poll/:id/result", getPollResult);
export default pollRouter