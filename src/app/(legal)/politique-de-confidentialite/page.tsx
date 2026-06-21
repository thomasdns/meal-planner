/* eslint-disable react/no-unescaped-entities */
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { CookiePreferencesButton } from "@/components/privacy/cookie-preferences-button";
import { legalConfig, legalDocumentDate, legalDocumentVersion } from "@/lib/legal";

export const metadata = { title: "Politique de confidentialité" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow={`Version ${legalDocumentVersion} - ${legalDocumentDate}`}
      title="Politique de confidentialité"
      description="Cette politique explique comment Meal Planner collecte, utilise, conserve et protège les données personnelles."
    >
      <LegalSection title="1. Responsable du traitement des données">
        <p><strong className="text-slate-950">Responsable :</strong> {legalConfig.publisherName}</p>
        <p><strong className="text-slate-950">Email :</strong>{" "}<a className="text-emerald-700 underline" href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</a></p>
        <p><strong className="text-slate-950">Localisation :</strong> {legalConfig.publisherAddress}</p>
      </LegalSection>

      <LegalSection title="2. Objet de la politique de confidentialité">
        <p>Cette politique décrit les traitements réalisés lorsque vous consultez Meal Planner ou utilisez ses services, notamment la gestion du compte, des recettes, des catégories, du planning hebdomadaire et de la liste de courses.</p>
      </LegalSection>

      <LegalSection title="3. Données collectées">
        <h3 className="text-lg font-semibold text-slate-950">3.1 Compte et authentification</h3>
        <p>Lors de la création d'un compte, Meal Planner traite le nom affiché, l'adresse email, le mot de passe sous forme hachée, la date de création et l'état de vérification de l'adresse email. Ces données sont nécessaires à la fourniture et à la sécurisation du service.</p>
        <h3 className="text-lg font-semibold text-slate-950">3.2 Contenus enregistrés</h3>
        <p>Les recettes, catégories, ingrédients, étapes de préparation, temps de réalisation, repas planifiés et éléments de la liste de courses sont enregistrés pour fournir les fonctionnalités demandées. Ces contenus restent associés au compte qui les a créés.</p>
        <h3 className="text-lg font-semibold text-slate-950">3.3 Données techniques et mesure d'audience</h3>
        <p>Des informations techniques limitées peuvent être traitées pour sécuriser le service, limiter les abus et diagnostiquer les erreurs. Après consentement, Google Analytics 4 peut traiter les pages consultées, le défilement, les clics sortants, les téléchargements, le début et l'envoi d'un formulaire, le type d'appareil, le navigateur, le système d'exploitation et une localisation géographique approximative. Le contenu saisi dans les formulaires n'est pas destiné à Google Analytics. La recherche interne automatique et la mesure vidéo doivent rester désactivées tant qu'elles ne répondent pas à un besoin documenté. Les paramètres d'URL sont supprimés, les routes contenant un identifiant de recette ou d'utilisateur sont généralisées et les pages de confirmation email ou de réinitialisation sont exclues.</p>
      </LegalSection>

      <LegalSection title="4. Finalités et bases légales">
        <p>Les données du compte et les contenus enregistrés sont traités afin d'exécuter le service demandé par l'utilisateur. Les journaux techniques et les mécanismes de limitation des tentatives reposent sur l'intérêt légitime de sécuriser l'application. L'envoi des emails de vérification et de réinitialisation est nécessaire à la gestion sécurisée du compte. Google Analytics repose exclusivement sur le consentement.</p>
      </LegalSection>

      <LegalSection title="5. Durée de conservation des données">
        <p>Le compte et ses contenus sont conservés pendant son utilisation, puis supprimés lorsque l'utilisateur demande la suppression du compte. Les sauvegardes chiffrées et les journaux techniques sont conservés pendant une durée maximale de trente jours.</p>
        <p>Les liens de réinitialisation du mot de passe expirent après trente minutes et les liens de vérification d'email après vingt-quatre heures. Le choix relatif aux cookies est mémorisé pendant six mois. Les données Google Analytics sont conservées selon la durée configurée dans la propriété, actuellement prévue pour une durée courte de deux mois.</p>
      </LegalSection>

      <LegalSection title="6. Partage des données avec les prestataires">
        <h3 className="text-lg font-semibold text-slate-950">6.1 Vercel</h3>
        <p>Vercel héberge et déploie l'application et fournit les journaux techniques nécessaires à son exploitation. Vercel est un prestataire américain et peut encadrer les transferts internationaux par ses garanties contractuelles.</p>
        <h3 className="text-lg font-semibold text-slate-950">6.2 Neon</h3>
        <p>Neon fournit la base de données PostgreSQL et ses mécanismes de sauvegarde. La base de production du projet est configurée dans la région de Londres, au Royaume-Uni.</p>
        <h3 className="text-lg font-semibold text-slate-950">6.3 Upstash</h3>
        <p>Upstash fournit le stockage Redis utilisé pour limiter les tentatives et protéger l'application contre les abus. La localisation dépend de la région configurée dans le compte Upstash.</p>
        <h3 className="text-lg font-semibold text-slate-950">6.4 Google</h3>
        <p>Google fournit l'envoi des emails transactionnels via Gmail SMTP et, après consentement, la mesure d'audience Google Analytics 4 au moyen de la balise gtag.js. Les signaux Google et la personnalisation publicitaire sont désactivés par l'application. Certains traitements peuvent être réalisés hors de l'Union européenne selon les garanties proposées par Google.</p>
      </LegalSection>

      <LegalSection title="7. Sécurité des données">
        <p>Meal Planner utilise HTTPS, le hachage des mots de passe, la vérification des adresses email, des contrôles d'accès par utilisateur, un rôle administrateur, des jetons temporaires et une limitation des tentatives. Les journaux sont conçus pour éviter l'enregistrement volontaire des mots de passe, jetons et contenus sensibles.</p>
      </LegalSection>

      <LegalSection id="cookies" title="8. Cookies et technologies de suivi">
        <p>Les cookies nécessaires assurent la connexion, la protection contre les requêtes frauduleuses et la sécurité de la session. Le choix enregistré sous le nom analytics-consent mémorise pendant six mois la valeur accepted ou refused pour la mesure d'audience. Une date d'expiration technique distincte permet de redemander ce choix à l'issue de cette période.</p>
        <p>Google Analytics utilise notamment les cookies _ga et _ga_* uniquement après acceptation. Le refus n'empêche pas d'utiliser l'application. Aucun nom, email, contenu de recette, valeur saisie dans un formulaire, jeton de sécurité ou identifiant interne n'est volontairement envoyé à Google Analytics. La collecte User-ID et la collecte de données fournies par les utilisateurs sont désactivées.</p>
      </LegalSection>

      <LegalSection title="9. Gestion du consentement">
        <p>Lors de la première visite, le bandeau permet d'accepter ou de refuser Google Analytics avec des choix présentés de manière équivalente. Le consentement peut être retiré à tout moment depuis le pied de page. Le retrait désactive le suivi pour la navigation en cours et supprime les cookies Google Analytics accessibles depuis le site.</p>
        <CookiePreferencesButton />
      </LegalSection>

      <LegalSection title="10. Vos droits">
        <p>Conformément au RGPD et à la loi française, vous pouvez demander l'accès, la rectification, l'effacement, la limitation, l'opposition ou la portabilité de vos données lorsque ces droits s'appliquent. Le profil permet également de modifier les informations, d'exporter les données au format Excel et de supprimer le compte, sous réserve de la protection du compte administrateur.</p>
        <p>Pour exercer un droit, contactez <a className="text-emerald-700 underline" href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</a>. Une réponse sera apportée dans le délai légal applicable.</p>
      </LegalSection>

      <LegalSection title="11. Réclamation auprès de la CNIL">
        <p>Si vous estimez que le traitement de vos données ne respecte pas vos droits, vous pouvez saisir la Commission nationale de l'informatique et des libertés, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, ou consulter <a className="text-emerald-700 underline" href="https://www.cnil.fr" rel="noreferrer" target="_blank">www.cnil.fr</a>.</p>
      </LegalSection>

      <LegalSection title="12. Données des mineurs">
        <p>Meal Planner n'est pas destiné aux mineurs de moins de quinze ans et ne collecte pas sciemment leurs données sans l'autorisation requise. Toute situation signalée sera examinée afin de supprimer les données concernées lorsque cela est nécessaire.</p>
      </LegalSection>

      <LegalSection title="13. Modifications et contact">
        <p>Cette politique peut évoluer lors de l'ajout d'un fournisseur, d'une nouvelle collecte ou d'une modification importante du service. La date de mise à jour est affichée sur cette page. Pour toute question, contactez <a className="text-emerald-700 underline" href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</a>.</p>
        <p className="text-sm text-slate-500">Dernière mise à jour : {legalDocumentDate}</p>
      </LegalSection>
    </LegalPage>
  );
}
