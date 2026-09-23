import { Router, type IRouter } from "express";
import healthRouter from "./health";
import matchesRouter from "./matches";
import operationsRouter from "./operations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(matchesRouter);
router.use(operationsRouter);

export default router;
