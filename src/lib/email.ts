import "server-only";

import { SMTPClient } from "emailjs";

import { logError, logEvent } from "@/lib/logger";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type SmtpError = Error & {
  code?: string;
  smtp?: string;
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
    await logEvent("info", "smtp_email_test_delivered", {
      recipient: maskEmailAddress(to),
    });

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

    await logEvent(
      "error",
      "smtp_config_incomplete",
      {
        recipient: maskEmailAddress(to),
        missingVariables,
      },
    );

    return {
      delivered: false,
    };
  }

  const client = new SMTPClient({
    host,
    port,
    ssl: secure,
    tls: secure ? false : true,
    timeout: 15_000,
    user,
    password,
  });

  try {
    await client.sendAsync({
      from,
      to,
      subject,
      text,
      attachment: [{ data: html, alternative: true }],
    });

    await logEvent("info", "smtp_email_sent", {
      recipient: maskEmailAddress(to),
    });
  } catch (error) {
    const smtpError = normalizeSmtpError(error);

    await logError(
      "smtp_email_failed",
      error,
      {
        recipient: maskEmailAddress(to),
        smtpCode: smtpError.code,
        smtpResponse: smtpError.smtp,
      },
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
    smtp: smtpError.smtp,
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
