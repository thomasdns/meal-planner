/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { legalConfig, legalDocumentDate, legalDocumentVersion } from "@/lib/legal";

export const metadata = { title: "Mentions légales" };

export default function LegalNoticePage() {
  return (
    <LegalPage
      eyebrow={`Version ${legalDocumentVersion} - ${legalDocumentDate}`}
      title="Mentions légales"
      description="Informations relatives à l'éditeur, à l'hébergement et à l'utilisation de Meal Planner."
    >
      <LegalSection title="1. Identification du site">
        <p><strong className="text-slate-950">Nom du site :</strong> Meal Planner</p>
        <p><strong className="text-slate-950">URL :</strong>{" "}<a className="text-emerald-700 underline" href={legalConfig.siteUrl}>{legalConfig.siteUrl}</a></p>
        <p><strong className="text-slate-950">Type de site :</strong> Application web gratuite de planification de repas.</p>
      </LegalSection>

      <LegalSection title="2. Informations légales">
        <p><strong className="text-slate-950">Propriétaire et éditeur :</strong> {legalConfig.publisherName}</p>
        <p><strong className="text-slate-950">Email :</strong>{" "}<a className="text-emerald-700 underline" href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</a></p>
        <p><strong className="text-slate-950">Localisation :</strong> {legalConfig.publisherAddress}</p>
        <p><strong className="text-slate-950">Statut :</strong> {legalConfig.publisherStatus}</p>
        <p><strong className="text-slate-950">Directeur de la publication :</strong> {legalConfig.publicationDirector}</p>
      </LegalSection>

      <LegalSection title="3. Hébergement">
        <p>Le site est hébergé par {legalConfig.hostName}, {legalConfig.hostAddress}. Le site de l'hébergeur est accessible à l'adresse <a className="text-emerald-700 underline" href={legalConfig.hostUrl} rel="noreferrer" target="_blank">{legalConfig.hostUrl}</a>.</p>
        <p>Les données applicatives sont stockées dans une base PostgreSQL exploitée par Neon dans la région configurée pour le projet.</p>
      </LegalSection>

      <LegalSection title="4. Responsabilités">
        <p>L'éditeur s'efforce de maintenir le site accessible et de fournir un service fiable. Il ne peut toutefois garantir l'absence d'interruption, d'erreur ou de perte liée à une opération de maintenance, à une mise à jour ou à un événement indépendant de sa volonté.</p>
        <p>L'utilisateur reste responsable des recettes, ingrédients, quantités, informations nutritionnelles et indications relatives aux allergies qu'il saisit. Meal Planner ne remplace pas l'avis d'un professionnel de santé.</p>
      </LegalSection>

      <LegalSection title="5. Propriété intellectuelle">
        <p>La structure, l'interface, les textes et les éléments graphiques propres à Meal Planner sont protégés par les règles applicables à la propriété intellectuelle. Toute reproduction ou adaptation non autorisée est interdite.</p>
        <p>L'utilisateur conserve ses droits sur les recettes et contenus qu'il ajoute. Il autorise uniquement leur traitement technique afin de fournir les fonctionnalités du service.</p>
      </LegalSection>

      <LegalSection title="6. Accès au site">
        <p>L'accès à certaines fonctionnalités nécessite la création d'un compte avec une adresse email valide. L'utilisateur doit préserver la confidentialité de son mot de passe et ne pas tenter de contourner les dispositifs de sécurité. L'accès peut être suspendu en cas d'abus, de risque pour le service ou d'atteinte aux droits d'un tiers.</p>
      </LegalSection>

      <LegalSection title="7. Liens externes">
        <p>Le site peut contenir des liens vers des services externes. L'éditeur ne contrôle ni leur disponibilité, ni leur contenu, ni leurs pratiques de confidentialité et ne peut être tenu responsable de leur utilisation.</p>
      </LegalSection>

      <LegalSection title="8. Données personnelles et cookies">
        <p>Meal Planner traite les données nécessaires aux comptes et aux fonctionnalités de planification. Vercel Analytics fournit des statistiques techniques filtrées, tandis que Google Analytics est chargé uniquement après le consentement du visiteur.</p>
        <p>Les finalités, durées de conservation, prestataires et modalités de gestion du consentement sont détaillées dans la <Link className="text-emerald-700 underline" href="/politique-de-confidentialite">politique de confidentialité</Link>.</p>
      </LegalSection>

      <LegalSection title="9. Loi applicable">
        <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les juridictions compétentes sont déterminées conformément aux règles légales applicables.</p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>Pour toute question relative au site, vous pouvez contacter l'éditeur à l'adresse <a className="text-emerald-700 underline" href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</a>.</p>
        <p className="text-sm text-slate-500">Dernière mise à jour : {legalDocumentDate}</p>
      </LegalSection>
    </LegalPage>
  );
}
