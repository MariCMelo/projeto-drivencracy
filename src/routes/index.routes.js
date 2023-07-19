import { Router } from "express"
import choiceRouter from "./choice.routes.js"
import pollRouter from "./poll.routes.js"

const router = Router()

router.use(pollRouter)
router.use(choiceRouter)

export default router