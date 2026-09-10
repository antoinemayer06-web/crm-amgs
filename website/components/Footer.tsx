import Image from "next/image";
import Link from "next/link";
import { LinkedInIcon, WhatsAppIcon } from "@/components/icons";
import { CONTACT_EMAIL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/links";
import { FOOTER_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/logo.png"
              alt="Logo AM Growth Solutions, automatisation PME à La Réunion"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-heading text-sm font-extrabold tracking-tight text-foreground">
              AM Growth Solutions
            </span>
          </Link>

          <div className="flex flex-col items-center gap-4 sm:items-start">
            <nav className="grid grid-cols-2 gap-2 text-center sm:flex sm:flex-col sm:items-center md:items-start md:text-left">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© 2026 AM Growth Solutions — Antoine Mayer</p>
          <Link href="/mentions-legales" className="hover:text-primary">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
