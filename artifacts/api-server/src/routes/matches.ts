import { Router, type IRouter } from "express";
import {
  ListMatchesQueryParams,
  ListMatchesResponse,
} from "@workspace/api-zod";
import { getMatches } from "../lib/football/service";

const router: IRouter = Router();

router.get("/matches", async (req, res): Promise<void> => {
  const rawDate = typeof req.query.date === "string" ? req.query.date : "";
  const parsed = ListMatchesQueryParams.safeParse({
    date: new Date(`${rawDate}T00:00:00.000Z`),
  });

  if (!parsed.success || !/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    res.status(400).json({ error: "Date must use YYYY-MM-DD format." });
    return;
  }

  const result = await getMatches(rawDate);
  res.json(ListMatchesResponse.parse(result));
});

export default router;
