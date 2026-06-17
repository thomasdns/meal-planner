declare module "nodemailer" {
  export type SendMailOptions = {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  };

  export type Transporter = {
    sendMail(options: SendMailOptions): Promise<unknown>;
  };

  export type TransportOptions = {
    host: string;
    port: number;
    secure: boolean;
    connectionTimeout?: number;
    greetingTimeout?: number;
    socketTimeout?: number;
    auth: {
      user: string;
      pass: string;
    };
  };

  export function createTransport(options: TransportOptions): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}
