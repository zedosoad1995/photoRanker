export interface MailRepo<T = any> {
  sendEmail: (options: T) => Promise<any>;
}
