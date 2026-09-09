"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { buttonHover } from "@/lib/animations";
import { CALENDLY_URL, WHATSAPP_URL } from "@/lib/links";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          honeypot: data.get("company"),
        }),
      });

      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-background p-8 text-center">
        <p className="font-heading text-lg font-bold text-foreground">
          Message envoyé !
        </p>
        <p className="mt-2 text-sm text-muted">
          Je vous réponds sous 24-48h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot anti-spam — masqué visuellement, les bots le remplissent */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-foreground/80"
          >
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-foreground/80"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          Téléphone <span className="text-muted">(optionnel)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          Votre besoin
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Quels outils utilisez-vous, et qu'est-ce qui vous fait perdre du temps ?"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-border bg-background p-4 text-sm text-foreground/80">
          <p className="font-semibold">
            Le message n&apos;a pas pu être envoyé.
          </p>
          <p className="mt-1 text-muted">
            Contactez-moi directement en attendant :
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2"
            >
              WhatsApp
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Calendly
            </a>
          </div>
        </div>
      )}

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileHover={status === "submitting" ? undefined : buttonHover}
        className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Envoi..." : "Envoyer le message"}
      </motion.button>
    </form>
  );
}
