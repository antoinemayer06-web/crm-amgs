"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { buttonHover, fadeInUp } from "@/lib/animations";
import { CHECKLIST } from "@/lib/checklist";

type Status = "idle" | "submitting" | "revealed";

export default function LeadMagnet() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    const honeypot = new FormData(form).get("company");

    // La checklist s'affiche dans tous les cas dès que l'email est valide
    // côté navigateur : la promesse faite au visiteur ne doit pas dépendre
    // de la config email côté serveur (voir app/api/contact/route.ts).
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "lead-magnet", email, honeypot }),
    }).catch(() => {
      // Best-effort : une notification manquée ne doit pas bloquer l'accès
      // à la checklist déjà promise au visiteur.
    });

    setStatus("revealed");
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
        Ressource gratuite
      </p>
      <h3 className="mt-2 font-heading text-xl font-bold text-foreground">
        {CHECKLIST.title}
      </h3>

      {status !== "revealed" ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Laissez votre email pour la recevoir immédiatement.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="vous@entreprise.com"
              className="flex-1 rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
            <motion.button
              type="submit"
              disabled={status === "submitting"}
              whileHover={status === "submitting" ? undefined : buttonHover}
              className="shrink-0 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              Recevoir la checklist
            </motion.button>
          </form>
        </>
      ) : (
        <motion.ul
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-5 space-y-3"
        >
          {CHECKLIST.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
              <span className="text-sm leading-relaxed text-foreground/80">
                {item}
              </span>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
