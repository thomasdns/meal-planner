"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        void signOut({ callbackUrl: "/auth/sign-in" });
      }}
      className="button-secondary px-3"
    >
      {isPending ? "Deconnexion..." : "Se deconnecter"}
    </button>
  );
}
