import "server-only";

import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
  const from = process.env.EMAIL_FROM;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD?.replace(/\s/g, "");

  if (!from || !host || !user || !password) {
    console.info(
      [
        "Email delivery skipped because SMTP configuration is incomplete.",
        `To: ${to}`,
        `Subject: ${subject}`,
        text,
      ].join("\n"),
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
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Email delivery failed:", error);

    return {
      delivered: false,
    };
  }

  console.info(`Email delivered to ${to} with subject "${subject}".`);

  return {
    delivered: true,
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
