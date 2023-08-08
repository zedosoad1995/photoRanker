import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { createOne, deleteOne } from "@/controllers/reports.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createReportSchema } from "@/schemas/report/createReport";
import { checkAdmin } from "@/middlewares/checkAdmin";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  validateForm(createReportSchema),
  createOne
);

router.delete(
  "/:reportId",
  checkAuth,
  checkAdmin,
  checkProfileCompleted,
  checkEmailVerified,
  deleteOne
);

export default router;
