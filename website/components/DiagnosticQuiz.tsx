"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, Check, Loader2 } from "lucide-react";
import { buttonHover, fadeInUp } from "@/lib/animations";
import { CALENDLY_URL } from "@/lib/links";
import { trackEvent } from "@/lib/track";
import {
  ADMIN_BURDEN_REACTIONS,
  buildDiagnosticSummary,
  computeLevel,
  computeScore,
  LEVELS,
  painPointsReaction,
  QUIZ_QUESTIONS,
  readableAnswers,
  RESULT_CONTENT,
  SELF_FIX_REACTIONS,
  TIME_LOST_DISCLAIMER,
  TIME_LOST_REACTIONS,
  TIMELINE_REACTIONS,
  TOOLS_REACTIONS,
  type Answers,
} from "@/lib/diagnostic";

type Phase = "question" | "result" | "submitted";
type FormStatus = "idle" | "submitting" | "error";

const inputClasses =
  "w-full rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary";

function reactionFor(question: (typeof QUIZ_QUESTIONS)[number], answers: Answers): string | null {
  switch (question.id) {
    case "tools":
      return TOOLS_REACTIONS[answers.tools ?? ""] ?? null;
    case "time-lost":
      return TIME_LOST_REACTIONS[answers["time-lost"] ?? ""] ?? null;
    case "self-fix":
      return SELF_FIX_REACTIONS[answers["self-fix"] ?? ""] ?? null;
    case "admin-burden":
      return ADMIN_BURDEN_REACTIONS[answers["admin-burden"] ?? ""] ?? null;
    case "pain-points":
      return painPointsReaction(answers["pain-points"]?.length ?? 0);
    case "timeline":
      return TIMELINE_REACTIONS[answers.timeline ?? ""] ?? null;
    default:
      return null;
  }
}

export default function DiagnosticQuiz() {
  const [phase, setPhase] = useState<Phase>("question");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[questionIndex];
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const hasAnswer =
    currentQuestion?.type === "multi"
      ? (answers["pain-points"]?.length ?? 0) > 0
      : Boolean(currentQuestion && answers[currentQuestion.id]);

  const reaction = currentQuestion && hasAnswer ? reactionFor(currentQuestion, answers) : null;

  const level = phase === "result" || phase === "submitted" ? computeLevel(answers) : null;
  const levelConfig = level ? LEVELS[level] : null;
  const resultContent = level ? RESULT_CONTENT[level] : null;
  const diagnosticSummary =
    phase === "result" || phase === "submitted" ? buildDiagnosticSummary(answers) : null;

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
      const res = await fetch("/api/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: data.get("name"),
          email: data.get("email"),
          telephone: data.get("phone"),
          honeypot: data.get("company"),
          reponses: readableAnswers(answers),
          score: computeScore(answers),
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "send_failed");
      setPhase("submitted");
    } catch (err) {
      console.error("[diagnostic] envoi au CRM échoué:", err instanceof Error ? err.message : err);
      setFormStatus("error");
    }
  }

  const emailForm = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <input type="text" name="name" required placeholder="Votre nom" className={inputClasses} />
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
        whileHover={formStatus === "submitting" ? undefined : buttonHover}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {formStatus === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        Envoyer à notre équipe
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
    </form>
  );

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
              {phase === "question" && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex min-h-[36rem] flex-col sm:min-h-[34rem]"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
                    Question {questionIndex + 1} / {totalQuestions}
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-bold text-foreground sm:text-2xl">
                    {currentQuestion.question}
                  </h2>

                  <div className="mt-6 flex flex-col gap-3">
                    {currentQuestion.options.map((option) => {
                      const selected =
                        currentQuestion.type === "multi"
                          ? (answers["pain-points"] ?? []).includes(option.value)
                          : answers[currentQuestion.id] === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            if (currentQuestion.type === "multi") {
                              setAnswers((prev) => {
                                const current = prev["pain-points"] ?? [];
                                const next = current.includes(option.value)
                                  ? current.filter((v) => v !== option.value)
                                  : [...current, option.value];
                                return { ...prev, "pain-points": next };
                              });
                            } else {
                              setAnswers((prev) => ({
                                ...prev,
                                [currentQuestion.id]: option.value,
                              }));
                            }
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl border px-5 py-3.5 text-left text-sm font-medium transition-colors ${
                            selected
                              ? "border-primary bg-primary/10 text-primary-dark"
                              : "border-border bg-surface text-foreground/80 hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          {currentQuestion.type === "multi" && (
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : "border-border bg-background"
                              }`}
                            >
                              {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                          )}
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  {reaction && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 border-l-2 border-primary/40 pl-3"
                    >
                      <p className="text-sm text-muted">{reaction}</p>
                      {currentQuestion.id === "time-lost" && (
                        <p className="mt-1 text-xs text-muted/70">{TIME_LOST_DISCLAIMER}</p>
                      )}
                    </motion.div>
                  )}

                  <motion.button
                    type="button"
                    disabled={!hasAnswer}
                    whileHover={hasAnswer ? buttonHover : undefined}
                    onClick={goNext}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
                  >
                    {isLastQuestion ? "Voir mon résultat" : "Suivant"}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}

              {phase === "result" && level && levelConfig && resultContent && (
                <motion.div
                  key="result"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <span
                    className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${levelConfig.badgeClasses}`}
                  >
                    {levelConfig.label}
                  </span>

                  <h2 className="mx-auto mt-5 max-w-md font-heading text-2xl font-black text-foreground sm:text-3xl">
                    {resultContent.title}
                  </h2>
                  <div className="mx-auto mt-5 max-w-md rounded-xl border border-border bg-surface px-5 py-4 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-dark">
                      Votre diagnostic
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                      {diagnosticSummary}
                    </p>
                  </div>

                  <div className="mx-auto mt-8 max-w-xs">
                    {!showLeadForm ? (
                      <motion.button
                        type="button"
                        whileHover={buttonHover}
                        onClick={() => setShowLeadForm(true)}
                        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                      >
                        Envoyer à notre équipe
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    ) : (
                      emailForm
                    )}
                  </div>
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
                  <h3 className="font-heading text-xl font-bold text-foreground">Merci !</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Vos coordonnées ont été transmises à notre équipe, qui vous recontacte
                    rapidement.
                  </p>
                  <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">
                    Si vous préférez ne pas attendre, vous pouvez aussi réserver un appel
                    directement :
                  </p>
                  <motion.a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={buttonHover}
                    onClick={() => trackEvent("clic_calendly")}
                    className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    <Calendar className="h-4 w-4" />
                    Réserver mon appel
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
