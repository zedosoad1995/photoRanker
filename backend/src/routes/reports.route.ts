import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { createOne } from "@/controllers/reports.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createReportSchema } from "@/schemas/report/createReport";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  validateForm(createReportSchema),
  createOne
);

export default router;
