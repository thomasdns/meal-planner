import "server-only";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info(
      [
        "Email delivery skipped because RESEND_API_KEY or EMAIL_FROM is missing.",
        `To: ${to}`,
        `Subject: ${subject}`,
        text,
      ].join("\n"),
    );

    return {
      delivered: false,
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email delivery failed: ${response.status} ${body}`);
  }

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
