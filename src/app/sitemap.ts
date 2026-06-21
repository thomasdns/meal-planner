import type { MetadataRoute } from "next";

import { legalConfig, legalDocumentDate } from "@/lib/legal";

const publicRoutes = [
  "",
  "/mentions-legales",
  "/politique-de-confidentialite",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = frenchLegalDateToIsoDate(legalDocumentDate);

  return publicRoutes.map((route) => ({
    url: `${legalConfig.siteUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.4,
  }));
}

function frenchLegalDateToIsoDate(value: string) {
  const [day, month, year] = value.split(" ");
  const monthIndex = [
    "janvier",
    "fevrier",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "aout",
    "septembre",
    "octobre",
    "novembre",
    "decembre",
  ].indexOf(month ?? "");

  if (!day || !year || monthIndex === -1) {
    return new Date();
  }

  return new Date(Date.UTC(Number(year), monthIndex, Number(day)));
}
