import { LoggerRepo } from "@/types/repositories/logger";
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { AssumeRoleCommand, STSClient } from "@aws-sdk/client-sts";

export class CloudWatchLogger implements LoggerRepo {
  private cloudWatchLogger: CloudWatchLogsClient;

  constructor() {
    this.init();
  }

  private async init() {
    const sts = new STSClient({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const data = await sts.send(
      new AssumeRoleCommand({
        RoleArn: "arn:aws:iam::208430473767:role/photo_scorer_role",
        RoleSessionName: "test_photo_scorer",
      })
    );

    if (!data.Credentials?.AccessKeyId || !data.Credentials?.SecretAccessKey) {
      return;
    }

    this.cloudWatchLogger = new CloudWatchLogsClient({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken,
      },
    });
  }

  info(message: string) {
    this.cloudWatchLogger.send(
      new PutLogEventsCommand({
        logGroupName: "photo_scorer",
        logEvents: [
          {
            message,
            timestamp: Date.now(),
          },
        ],
        logStreamName: "1",
      })
    );
  }
}
