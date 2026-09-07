"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons";
import { buttonHover } from "@/lib/animations";
import { WHATSAPP_URL } from "@/lib/links";
import { NAV_LINKS } from "@/lib/nav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Referme le menu mobile si l'écran repasse en desktop.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/80 py-2 shadow-md backdrop-blur-md"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="AM Growth Solutions — accueil">
          <Image
            src="/brand/logo.png"
            alt="AM Growth Solutions"
            width={40}
            height={40}
            priority
            className={`w-auto transition-all duration-300 ${
              scrolled ? "h-8" : "h-10"
            }`}
          />
          <span
            className={`font-heading text-sm font-extrabold tracking-tight transition-colors duration-300 sm:text-base ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            AM Growth Solutions
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-foreground/80 hover:text-primary"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={buttonHover}
            aria-label="Discuter sur WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent-light text-accent-light transition-colors hover:bg-accent-light hover:text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={buttonHover}
            className="inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-ink/20 transition-colors hover:bg-primary-dark"
          >
            Prendre rendez-vous
          </motion.a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className={`h-0.5 w-6 rounded-full transition-colors duration-300 ${
              scrolled ? "bg-foreground" : "bg-white"
            }`}
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className={`h-0.5 w-6 rounded-full transition-colors duration-300 ${
              scrolled ? "bg-foreground" : "bg-white"
            }`}
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className={`h-0.5 w-6 rounded-full transition-colors duration-300 ${
              scrolled ? "bg-foreground" : "bg-white"
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-border bg-surface/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-full border-2 border-accent px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Prendre rendez-vous
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
