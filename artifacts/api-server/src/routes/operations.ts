import { Router, type IRouter } from "express";
import {
  GetOperationsSummaryResponse,
  ListProviderHealthResponse,
} from "@workspace/api-zod";
import {
  getOperationsSummary,
  listProviderHealth,
} from "../lib/football/service";

const router: IRouter = Router();

router.get("/operations/provider-health", (_req, res): void => {
  res.json(ListProviderHealthResponse.parse(listProviderHealth()));
});

router.get("/operations/summary", (_req, res): void => {
  res.json(GetOperationsSummaryResponse.parse(getOperationsSummary()));
});

export default router;
