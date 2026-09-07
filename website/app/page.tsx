import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Process from "@/components/Process";
import Proof from "@/components/Proof";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        {/* Hero + bandeau outils — voir components/Hero.tsx */}

        <Problem />

        <Services />

        <Proof />

        <Process />

        {/* Témoignages — retours clients (cabinets, bureaux d'études, agences) */}

        {/* FAQ — questions fréquentes des dirigeants de petites structures */}

        <Contact />
      </main>
      <Footer />
    </>
  );
}
