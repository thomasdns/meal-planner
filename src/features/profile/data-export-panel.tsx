export function DataExportPanel() {
  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold">Tes donnees</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Telecharge une copie Excel de ton profil, tes recettes, ingredients,
          categories et repas planifies. Les mots de passe, sessions et jetons
          de securite sont exclus.
        </p>
      </div>
      <a
        href="/api/account/export"
        download
        className="button-secondary"
      >
        Exporter mes donnees Excel
      </a>
    </section>
  );
}
