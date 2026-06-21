import "server-only";

export const legalDocumentVersion = "1.4";
export const legalDocumentDate = "21 juin 2026";

export const legalConfig = {
  publisherName:
    process.env.LEGAL_PUBLISHER_NAME ?? "Thomas Das Neves",
  publisherStatus:
    process.env.LEGAL_PUBLISHER_STATUS ?? "Particulier, personne physique",
  publisherAddress:
    process.env.LEGAL_PUBLISHER_ADDRESS ?? "France",
  privacyEmail:
    process.env.LEGAL_PRIVACY_EMAIL ?? "menuhebdo@gmail.com",
  publicationDirector:
    process.env.LEGAL_PUBLICATION_DIRECTOR ??
    process.env.LEGAL_PUBLISHER_NAME ??
    "Thomas Das Neves",
  hostName: process.env.LEGAL_HOST_NAME ?? "Vercel Inc.",
  hostAddress:
    process.env.LEGAL_HOST_ADDRESS ??
    "440 N Barranca Ave #4133, Covina, CA 91723, Etats-Unis",
  hostUrl: process.env.LEGAL_HOST_URL ?? "https://vercel.com",
  siteUrl:
    process.env.LEGAL_SITE_URL ?? "https://mon-menu-hebdo.vercel.app/",
} as const;
