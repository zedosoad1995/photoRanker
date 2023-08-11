export interface IReport {
  id: string;
  pictureId: string;
  userReportingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReportRes {
  report: IReport;
}
