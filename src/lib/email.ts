import "server-only";

import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type SmtpError = Error & {
  code?: string;
  command?: string;
  responseCode?: number;
};

type SmtpSendResult = {
  messageId?: string;
  accepted?: unknown[];
  rejected?: unknown[];
};

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
  const from = process.env.EMAIL_FROM;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
  const useTestTransport =
    process.env.SMTP_TEST_MODE === "true" &&
    process.env.VERCEL_ENV !== "production";

  if (useTestTransport) {
    console.info(
      JSON.stringify({
        event: "smtp_email_test_delivered",
        recipient: maskEmailAddress(to),
      }),
    );

    return {
      delivered: true,
    };
  }

  if (!from || !host || !user || !password) {
    const missingVariables = [
      ["EMAIL_FROM", from],
      ["SMTP_HOST", host],
      ["SMTP_USER", user],
      ["SMTP_PASSWORD", password],
    ]
      .filter(([, value]) => !value)
      .map(([name]) => name);

    console.error(
      JSON.stringify({
        event: "smtp_config_incomplete",
        recipient: maskEmailAddress(to),
        missingVariables,
      }),
    );

    return {
      delivered: false,
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    auth: {
      user,
      pass: password,
    },
  });

  try {
    const info = (await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })) as SmtpSendResult;

    console.info(
      JSON.stringify({
        event: "smtp_email_sent",
        recipient: maskEmailAddress(to),
        messageId: info.messageId,
        acceptedCount: Array.isArray(info.accepted) ? info.accepted.length : 0,
        rejectedCount: Array.isArray(info.rejected) ? info.rejected.length : 0,
      }),
    );
  } catch (error) {
    const smtpError = normalizeSmtpError(error);

    console.error(
      JSON.stringify({
        event: "smtp_email_failed",
        recipient: maskEmailAddress(to),
        error: smtpError,
      }),
    );

    return {
      delivered: false,
    };
  }

  return {
    delivered: true,
  };
}

function maskEmailAddress(email: string) {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return "invalid-email";
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
}

function normalizeSmtpError(error: unknown) {
  if (!(error instanceof Error)) {
    return {
      name: "UnknownError",
      message: "Unknown SMTP error",
    };
  }

  const smtpError = error as SmtpError;

  return {
    name: smtpError.name,
    message: smtpError.message,
    code: smtpError.code,
    command: smtpError.command,
    responseCode: smtpError.responseCode,
  };
}

export async function sendEmailVerificationEmail(email: string, url: string) {
  return sendEmail({
    to: email,
    subject: "Verifie ton email Meal Planner",
    text: `Bienvenue sur Meal Planner. Verifie ton email avec ce lien : ${url}`,
    html: `
      <main>
        <h1>Bienvenue sur Meal Planner</h1>
        <p>Confirme ton adresse email pour securiser ton compte.</p>
        <p><a href="${url}">Verifier mon email</a></p>
      </main>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, url: string) {
  return sendEmail({
    to: email,
    subject: "Reinitialisation de ton mot de passe Meal Planner",
    text: `Pour changer ton mot de passe, ouvre ce lien : ${url}`,
    html: `
      <main>
        <h1>Reinitialisation du mot de passe</h1>
        <p>Ouvre ce lien pour choisir un nouveau mot de passe.</p>
        <p><a href="${url}">Changer mon mot de passe</a></p>
      </main>
    `,
  });
}
