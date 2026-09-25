"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { buttonHover, fadeInUp } from "@/lib/animations";
import {
  computeLevel,
  LEVELS,
  PAIN_POINT_DETAIL,
  QUIZ_QUESTIONS,
  readableAnswers,
  type Answers,
} from "@/lib/diagnostic";

type Phase = "start" | "question" | "result" | "submitted";
type FormStatus = "idle" | "submitting" | "error";

const inputClasses =
  "w-full rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary";

export default function DiagnosticQuiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[questionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const level =
    phase === "result" || phase === "submitted" ? computeLevel(answers) : null;
  const levelConfig = level ? LEVELS[level] : null;
  const painPoint = answers["pain-point"]
    ? PAIN_POINT_DETAIL[answers["pain-point"]]
    : undefined;

  function goNext() {
    if (isLastQuestion) {
      setPhase("result");
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");

    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          honeypot: data.get("company"),
          levelLabel: levelConfig?.label,
          personalizedPhrase: painPoint?.phrase,
          serviceLabel: painPoint?.serviceLabel,
          serviceHref: painPoint?.serviceHref,
          answers: readableAnswers(answers),
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "send_failed");
      setPhase("submitted");
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          {phase === "question" && (
            <div className="h-1.5 w-full bg-border">
              <motion.div
                className="h-full bg-primary"
                animate={{
                  width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          )}

          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {phase === "start" && (
                <motion.div
                  key="start"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <p className="text-sm text-muted">
                    6 questions rapides, réponses en un clic.
                  </p>
                  <motion.button
                    type="button"
                    whileHover={buttonHover}
                    onClick={() => setPhase("question")}
                    className="mt-6 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    Commencer
                  </motion.button>
                </motion.div>
              )}

              {phase === "question" && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
                    Question {questionIndex + 1} / {totalQuestions}
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-bold text-foreground sm:text-2xl">
                    {currentQuestion.question}
                  </h2>

                  <div className="mt-6 flex flex-col gap-3">
                    {currentQuestion.options.map((option) => {
                      const selected = currentAnswer === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [currentQuestion.id]: option.value,
                            }))
                          }
                          className={`w-full rounded-xl border px-5 py-3.5 text-left text-sm font-medium transition-colors ${
                            selected
                              ? "border-primary bg-primary/10 text-primary-dark"
                              : "border-border bg-surface text-foreground/80 hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  <motion.button
                    type="button"
                    disabled={!currentAnswer}
                    whileHover={currentAnswer ? buttonHover : undefined}
                    onClick={goNext}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
                  >
                    {isLastQuestion ? "Voir mon résultat" : "Suivant"}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}

              {phase === "result" && level && levelConfig && (
                <motion.div
                  key="result"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <span
                      className={`inline-flex rounded-full border px-4 py-1.5 text-sm font-bold ${levelConfig.badgeClasses}`}
                    >
                      {levelConfig.label}
                    </span>
                    {painPoint && (
                      <>
                        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
                          {painPoint.phrase}
                        </p>
                        <Link
                          href={painPoint.serviceHref}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark transition hover:gap-2.5"
                        >
                          Voir : {painPoint.serviceLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </>
                    )}
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mt-10 border-t border-border pt-8"
                  >
                    <h3 className="text-center font-heading text-lg font-bold text-foreground">
                      Recevez votre diagnostic détaillé par email
                    </h3>
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex flex-col gap-3">
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Votre nom"
                        className={inputClasses}
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="vous@entreprise.com"
                        className={inputClasses}
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Téléphone (optionnel)"
                        className={inputClasses}
                      />
                      <motion.button
                        type="submit"
                        disabled={formStatus === "submitting"}
                        whileHover={
                          formStatus === "submitting" ? undefined : buttonHover
                        }
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                      >
                        {formStatus === "submitting" && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Recevoir mon diagnostic
                      </motion.button>
                      {formStatus === "error" && (
                        <p className="text-center text-sm text-red-600">
                          Une erreur est survenue. Réessayez, ou{" "}
                          <Link href="/contact" className="underline">
                            contactez-nous directement
                          </Link>
                          .
                        </p>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {phase === "submitted" && (
                <motion.div
                  key="submitted"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center text-center"
                >
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Merci !
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Vous allez recevoir votre diagnostic détaillé par email.
                    On peut aussi en discuter directement.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-primary-dark active:scale-[0.98]"
                  >
                    Prendre rendez-vous
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
