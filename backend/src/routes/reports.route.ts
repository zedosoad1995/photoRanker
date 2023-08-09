import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { createOne, deleteOne, getMany } from "@/controllers/reports.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createReportSchema } from "@/schemas/report/createReport";
import { checkAdmin } from "@/middlewares/checkAdmin";
import { validateQuery } from "@/middlewares/validateQuery";
import { getManyReportsSchema } from "@/schemas/report/query/getManyReports";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkAdmin,
  checkProfileCompleted,
  checkEmailVerified,
  validateQuery(getManyReportsSchema),
  getMany
);

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
