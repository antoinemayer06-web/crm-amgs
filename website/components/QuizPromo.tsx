"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

// Encart de mise en avant du quiz /diagnostic, placé entre "Vos
// symptômes" et "Notre remède" — le bouton pulse en continu pour attirer
// l'œil, sans dépendre d'un survol.
export default function QuizPromo() {
  return (
    <section className="bg-background px-4 pb-4 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center sm:p-10"
      >
        <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          Obtenez un diagnostic rapide, on vous recontacte rapidement.
        </h3>

        <motion.div
          className="mt-6 inline-block"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            href="/diagnostic"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-primary-dark to-ink px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
          >
            Faire le quiz
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
