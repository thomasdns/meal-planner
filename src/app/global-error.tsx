"use client";

type GlobalErrorProps = {
  unstable_retry: () => void;
};

export default function GlobalError({ unstable_retry }: GlobalErrorProps) {
  return (
    <html lang="fr">
      <body>
        <main style={{ maxWidth: 560, margin: "15vh auto", padding: 24 }}>
          <h1>Meal Planner est momentanement indisponible</h1>
          <p>Une erreur a ete enregistree. Reessaie dans quelques instants.</p>
          <button type="button" onClick={() => unstable_retry()}>
            Reessayer
          </button>
        </main>
      </body>
    </html>
  );
}
