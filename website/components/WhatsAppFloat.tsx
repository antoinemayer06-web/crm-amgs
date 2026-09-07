"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/links";

// Bulle WhatsApp flottante, présente sur toutes les pages (montée depuis
// app/layout.tsx). Apparaît avec un léger délai, puis pulse doucement en
// boucle pour attirer l'œil sans être agaçante.
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-white shadow-md"
          >
            Discuter sur WhatsApp
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter sur WhatsApp"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </motion.a>
    </motion.div>
  );
}
