"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons";
import { buttonHover } from "@/lib/animations";
import { WHATSAPP_URL } from "@/lib/links";
import { NAV_ITEMS } from "@/lib/nav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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

  const linkClass =
    "whitespace-nowrap text-sm font-medium text-white/80 transition-colors hover:text-white";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* border et rounded-full toujours présents (même à l'état transparent
          "non scrollé") : seules leur couleur/opacité changent au scroll.
          Ça évite un saut brutal de largeur de bordure / rayon d'angle qui
          produisait un flash de rectangle blanc pendant la transition. */}
      <div
        className={`mx-auto flex items-center justify-between gap-2 rounded-full border backdrop-blur-md transition-all duration-300 sm:gap-4 ${
          scrolled
            ? "mx-6 mt-3 max-w-5xl border-white/10 bg-[#0d0d0d]/95 px-3 py-2 shadow-lg shadow-black/30 sm:mx-auto sm:px-6 sm:py-2.5"
            : "max-w-6xl border-transparent bg-transparent px-6 py-4 shadow-none sm:px-6 lg:px-8"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="AM Growth Solutions — accueil"
        >
          <Image
            src="/brand/logo.png"
            alt="Logo AM Growth Solutions, automatisation PME à La Réunion"
            width={40}
            height={40}
            priority
            className={`w-auto transition-all duration-300 ${
              scrolled ? "h-8" : "h-10"
            }`}
          />
          <span
            className={`whitespace-nowrap font-heading font-extrabold tracking-tight text-white transition-all duration-300 ${
              scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            AM Growth Solutions
          </span>
        </Link>

        <nav
          className={`hidden items-center md:flex ${
            scrolled ? "gap-5" : "gap-7"
          }`}
        >
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-lg"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <motion.div whileHover={buttonHover}>
            <Link
              href="/contact"
              className="inline-block whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-white/90"
            >
              Prendre rendez-vous
            </Link>
          </motion.div>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={buttonHover}
            aria-label="Discuter sur WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-accent shadow-sm transition-colors hover:bg-accent hover:text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
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
            className="h-0.5 w-6 rounded-full bg-white"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="h-0.5 w-6 rounded-full bg-white"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 rounded-full bg-white"
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
            <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto px-4 py-4 sm:px-6">
              {NAV_ITEMS.flatMap((item) => item.children ?? [item]).map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-2 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background hover:text-primary"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Prendre rendez-vous
              </Link>
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
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
