import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Home, Lock, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, Zap, Target, Shield, Search,
  FileText, Handshake, Award, BookOpen, ArrowRight, GraduationCap,
} from "lucide-react";
import type { TrackerData } from "@/hooks/use-tracker-data";
import { STEP_MICROLEARNING, type MicrolearningEntry } from "@/lib/microlearning-content";

/* ═══════════════════════════════════════════════════════════
   LEARNING CONTENT PER PHASE
   ═══════════════════════════════════════════════════════════ */

interface PhaseLearn {
  essentials: string[];
  deepDive: {
    buttonLabel: string;
    title: string;
    sections: { heading: string; body: string }[];
  };
}

const PHASE_LEARNING: Record<number, PhaseLearn> = {
  1: {
    essentials: [
      "Tu capacidad de compra depende de tus ingresos, ahorros y deudas actuales",
      "Los precios varían mucho según la zona — conocerlos te evita perder tiempo",
      "Existen ayudas públicas que mucha gente desconoce y que podrían aplicarse a tu caso",
      "No necesitas tener todo el dinero — se trata de saber si tu objetivo es alcanzable",
    ],
    deepDive: {
      buttonLabel: "Ver cómo calcular tu capacidad real",
      title: "¿Cómo saber si puedes comprar?",
      sections: [
        {
          heading: "La regla del 30-35%",
          body: "Los bancos suelen aprobar hipotecas cuya cuota no supere el 30-35% de tus ingresos netos mensuales. Si ganas 2.000€/mes, tu cuota máxima sería de unos 600-700€. Este es tu punto de partida.",
        },
        {
          heading: "Ahorros necesarios",
          body: "Normalmente necesitas tener ahorrado al menos el 20% del precio de la vivienda (entrada) más un 10-12% adicional para impuestos y gastos. En una vivienda de 200.000€, eso serían unos 60.000-64.000€.",
        },
        {
          heading: "Las ayudas pueden cambiar la ecuación",
          body: "Dependiendo de tu edad, ingresos y comunidad autónoma, puedes acceder a avales públicos, subvenciones o deducciones fiscales que reducen significativamente la cantidad que necesitas ahorrar.",
        },
      ],
    },
  },
  2: {
    essentials: [
      "Tu perfil financiero es lo primero que mira el banco para aprobar una hipoteca",
      "Reducir deudas antes de pedir una hipoteca mejora tus condiciones",
      "Ahorrar de forma constante es más importante que ahorrar mucho de golpe",
      "Cada euro que reduces en deudas mejora directamente tu capacidad hipotecaria",
    ],
    deepDive: {
      buttonLabel: "Ver cómo preparar tu perfil financiero",
      title: "Preparar tu perfil para el banco",
      sections: [
        {
          heading: "¿Qué mira el banco?",
          body: "El banco analiza: estabilidad laboral (contrato fijo vs temporal), antigüedad en el empleo, ratio de endeudamiento (deudas/ingresos), historial de ahorro constante y la existencia de otros préstamos activos.",
        },
        {
          heading: "Cómo reducir deudas de forma inteligente",
          body: "Prioriza eliminar préstamos pequeños primero (método bola de nieve) o los de mayor interés (método avalancha). Cancela tarjetas de crédito con saldo pendiente. Cada deuda eliminada suma a tu capacidad hipotecaria.",
        },
        {
          heading: "Construir la entrada paso a paso",
          body: "Automatiza una transferencia mensual a una cuenta de ahorro separada. Incluso 200-300€/mes se acumulan: en 3 años tendrás 7.200-10.800€. Lo importante es la constancia, no la cantidad.",
        },
      ],
    },
  },
  3: {
    essentials: [
      "El banco normalmente financia hasta el 80% de la vivienda",
      "En algunos casos puedes conseguir financiación del 90% o incluso el 100%",
      "Cuanto más te financian, menos entrada necesitas ahorrar",
      "Los avales (públicos o familiares) pueden cubrir lo que el banco no financia",
    ],
    deepDive: {
      buttonLabel: "Ver cómo conseguir más financiación",
      title: "Opciones de financiación avanzada",
      sections: [
        {
          heading: "De 80% a 90%: ¿cómo se consigue?",
          body: "Algunos bancos ofrecen financiación al 90% si tienes un perfil muy sólido: contrato fijo, antigüedad laboral, sin deudas y un buen historial de ahorro. Un broker hipotecario puede ayudarte a encontrar estas ofertas.",
        },
        {
          heading: "Financiación al 100%: ¿es posible?",
          body: "Sí, en casos especiales: viviendas de bancos (activos inmobiliarios), programas públicos para jóvenes con aval del ICO, o si aportas un aval familiar con una propiedad libre de cargas.",
        },
        {
          heading: "El rol de los avales",
          body: "Un aval público (como el del ICO para jóvenes) puede cubrir hasta el 20% de la vivienda. Un aval familiar funciona de forma similar pero usando una propiedad de un familiar como garantía adicional. Ambos pueden reducir tu entrada a prácticamente 0€.",
        },
      ],
    },
  },
  4: {
    essentials: [
      "Define tu presupuesto máximo ANTES de buscar — te ahorrará mucho tiempo",
      "No te enamores de la primera vivienda que veas — compara siempre",
      "Las visitas presenciales revelan problemas que las fotos nunca muestran",
      "Buscar con criterio claro es mucho más eficiente que visitar todo lo que aparece",
    ],
    deepDive: {
      buttonLabel: "Ver consejos para buscar bien",
      title: "Cómo buscar vivienda de forma inteligente",
      sections: [
        {
          heading: "Define tus criterios clave",
          body: "Antes de buscar, establece: presupuesto máximo, zona(s) preferida(s), tamaño mínimo, número de habitaciones y si aceptas reforma. Esto filtra el 80% de anuncios irrelevantes.",
        },
        {
          heading: "Qué mirar en las visitas",
          body: "Revisa: orientación y luz natural, estado de instalaciones (fontanería, electricidad), humedad en techos y paredes, ruido del barrio, estado de zonas comunes y la comunidad de vecinos. Pregunta siempre por derramas pendientes.",
        },
        {
          heading: "Negociar el precio",
          body: "El precio publicado casi nunca es el precio final. Investiga precios de venta reales (no de anuncio) en la zona. Un margen de negociación del 5-10% es habitual, especialmente si la vivienda lleva tiempo en el mercado.",
        },
      ],
    },
  },
  5: {
    essentials: [
      "La preaprobación te dice exactamente cuánto te presta el banco",
      "Comparar al menos 3-4 hipotecas puede ahorrarte miles de euros",
      "La diferencia entre hipotecas puede suponer 10.000-30.000€ en el total",
      "Negociar las condiciones es normal y esperado — no te cortes",
    ],
    deepDive: {
      buttonLabel: "Ver cómo comparar hipotecas",
      title: "Conseguir la mejor hipoteca",
      sections: [
        {
          heading: "¿Qué es la preaprobación?",
          body: "Es un documento del banco que confirma cuánto te prestarían y en qué condiciones aproximadas. No es vinculante pero te da mucha fuerza negociadora con los vendedores y te evita sorpresas.",
        },
        {
          heading: "Fija vs variable vs mixta",
          body: "Tipo fijo: cuota estable siempre (más seguridad). Tipo variable: cuota varía con el Euríbor (puede subir o bajar). Mixta: fija los primeros años, variable después. En momentos de tipos altos, la fija da más tranquilidad.",
        },
        {
          heading: "Más allá del tipo de interés",
          body: "Compara también: comisión de apertura, productos vinculados (seguros, nómina), comisión por amortización anticipada, y el TAE (que incluye todos los costes). Un broker hipotecario puede negociar por ti gratis.",
        },
      ],
    },
  },
  6: {
    essentials: [
      "La reserva asegura que nadie más se lleve la vivienda mientras preparas todo",
      "Las arras son tu compromiso formal — a partir de ahí es prácticamente tuya",
      "La firma de hipoteca es el último paso — después de esto, las llaves son tuyas",
      "Todo el proceso desde reserva hasta firma puede durar entre 1 y 3 meses",
    ],
    deepDive: {
      buttonLabel: "Ver los pasos finales en detalle",
      title: "Los últimos pasos de la compra",
      sections: [
        {
          heading: "La reserva (señal)",
          body: "Normalmente entre 1.000€ y 5.000€ que se descuentan del precio final. Demuestra tu interés serio. Si te echas atrás, puedes perderla. Si se echa atrás el vendedor, te la devuelve duplicada.",
        },
        {
          heading: "El contrato de arras",
          body: "Es un contrato privado donde se fija el precio, las condiciones y el plazo para la firma. Normalmente pagas el 10% del precio como señal. Si incumples, pierdes esa cantidad. Si incumple el vendedor, te devuelve el doble.",
        },
        {
          heading: "La firma ante notario",
          body: "Se firma la escritura de compraventa y la hipoteca el mismo día ante notario. Necesitarás tu DNI, la preaprobación del banco y los justificantes de pago. Después, solo queda inscribir en el Registro de la Propiedad. ¡Y ya tienes tu casa!",
        },
      ],
    },
  },
};

/* ── Completion micro-rewards (toasts) ── */
const STEP_REWARDS: Record<string, string> = {
  "Calcular cuánto puedes permitirte": "✔️ Ya sabes cuánto puedes gastar",
  "Estimar precio de vivienda": "✔️ Tienes una referencia de precios real",
  "Identificar ayudas públicas": "✔️ Estás aprovechando ventajas que mucha gente ignora",
  "Revisar perfil financiero": "✔️ Tu perfil financiero está bajo control",
  "Reducir deudas": "✔️ Estás mejorando tu capacidad hipotecaria",
  "Construir la entrada": "✔️ Cada euro cuenta. Estás construyendo tu futuro",
  "Elige tu financiación 80/90/100": "✔️ Ya entiendes las opciones que tienes",
  "Explorar aval público": "✔️ Conoces una herramienta que puede acelerar tu compra",
  "Explorar aval familiar": "✔️ Has explorado todas las opciones de aval",
  "Definir presupuesto real": "✔️ Tienes un presupuesto realista y claro",
  "Buscar viviendas": "✔️ Ya estás buscando con criterio",
  "Visitar propiedades": "✔️ Estás conociendo viviendas de verdad",
  "Pedir preaprobación": "✔️ Los bancos ya saben que vas en serio",
  "Comparar hipotecas": "✔️ Estás evitando un error muy común",
  "Negociar condiciones": "✔️ Esto te acerca a conseguir tu hipoteca",
  "Reservar vivienda": "✔️ Tu vivienda está reservada",
  "Firmar contrato de arras": "✔️ El compromiso está firmado",
  "Firma de hipoteca": "🎉 ¡Enhorabuena! ¡Las llaves son tuyas!",
};

/* ── Unlocked insight on checkbox complete ── */
const STEP_INSIGHTS: Record<string, string> = {
  "Calcular cuánto puedes permitirte": "El banco suele permitir una cuota de hasta el 30-35% de tu sueldo neto.",
  "Estimar precio de vivienda": "Conocer los precios reales de tu zona te evita perder tiempo.",
  "Identificar ayudas públicas": "Muchas personas no aprovechan ayudas a las que tienen derecho.",
  "Revisar perfil financiero": "Un perfil financiero claro es lo que los bancos miran primero.",
  "Reducir deudas": "Cada deuda que reduces mejora directamente tu capacidad hipotecaria.",
  "Construir la entrada": "No necesitas el 100% del dinero de golpe. Con constancia, se construye sola.",
  "Entender financiación 80/90/100": "Existen opciones de financiación al 90% o 100% que pueden cambiar tu horizonte.",
  "Explorar aval público": "Los avales públicos pueden cubrir hasta el 20% que el banco no financia.",
  "Explorar aval familiar": "Un aval familiar bien gestionado puede adelantar tu compra varios años.",
  "Definir presupuesto real": "Tener un presupuesto claro te da confianza para negociar sin miedo.",
  "Buscar viviendas": "Buscar con criterio claro es mucho más eficiente.",
  "Visitar propiedades": "Las visitas presenciales revelan cosas que las fotos nunca muestran.",
  "Pedir preaprobación": "Con una preaprobación, los vendedores te toman mucho más en serio.",
  "Comparar hipotecas": "La diferencia entre hipotecas puede suponer miles de euros.",
  "Negociar condiciones": "Negociar puede ahorrarte entre 5.000€ y 20.000€.",
  "Reservar vivienda": "La reserva asegura que nadie más se lleve tu vivienda.",
  "Firmar contrato de arras": "Las arras son tu compromiso formal.",
  "Firma de hipoteca": "¡El último paso! Después de esto, las llaves son tuyas.",
};

/* ── Mission icons ── */
const PHASE_ICONS: Record<number, React.ReactNode> = {
  1: <Target className="h-5 w-5" />,
  2: <Shield className="h-5 w-5" />,
  3: <Zap className="h-5 w-5" />,
  4: <Search className="h-5 w-5" />,
  5: <FileText className="h-5 w-5" />,
  6: <Handshake className="h-5 w-5" />,
};

/* ── Helpers ── */
function getGlobalMessage(percent: number): string {
  if (percent >= 100) return "🏡 ¡Lo has conseguido! Tu camino está completo.";
  if (percent >= 75) return "¡Estás muy cerca! La recta final de tu camino.";
  if (percent >= 50) return "Muchos se quedan aquí — tú ya estás avanzando.";
  if (percent >= 25) return "Ya has recorrido una parte importante del camino.";
  if (percent > 0) return "Buen comienzo. Cada paso te acerca a tu casa.";
  return "Tu camino empieza aquí. ¡Vamos a ello!";
}

function getMissionFeedback(completedCount: number, totalCount: number): string {
  if (completedCount === totalCount && totalCount > 0) return "¡Misión completada! 🎉";
  if (completedCount >= Math.ceil(totalCount / 2)) return "¡Vas por muy buen camino! 👏";
  if (completedCount > 0) return "Buen comienzo 👏";
  return "";
}

/* ── Component ── */
interface JourneyPathProps {
  tracker: TrackerData;
  userId: string;
}

const JourneyPath = ({ tracker, userId }: JourneyPathProps) => {
  const { phases, steps, stepProgress, toggleStep, trackerState } = tracker;
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [unlockedInsight, setUnlockedInsight] = useState<{ title: string; text: string } | null>(null);
  const [deepDivePhase, setDeepDivePhase] = useState<number | null>(null);
  const [microlearnModal, setMicrolearnModal] = useState<MicrolearningEntry | null>(null);

  // Track which steps have been "learned" — persisted in localStorage
  const [learnedSteps, setLearnedSteps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`learned_steps_${userId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const markAsLearned = useCallback((stepTitle: string) => {
    setLearnedSteps(prev => {
      const next = new Set(prev);
      next.add(stepTitle);
      localStorage.setItem(`learned_steps_${userId}`, JSON.stringify([...next]));
      return next;
    });
    toast.success("✔️ Ya entiendes este paso", { duration: 2000 });
  }, [userId]);

  const completedStepIds = new Set(stepProgress.filter(s => s.completed).map(s => s.step_id));
  const totalSteps = steps.length;
  const completedTotal = completedStepIds.size;
  const globalPercent = totalSteps > 0 ? Math.round((completedTotal / totalSteps) * 100) : 0;

  const currentPhase = phases.find(p => p.id === trackerState?.current_phase_id);
  const currentOrderIdx = currentPhase?.order_index ?? 1;

  useEffect(() => {
    if (currentPhase && !expandedPhase) setExpandedPhase(currentPhase.id);
  }, [currentPhase]);

  const handleToggleStep = useCallback(async (stepId: string, checked: boolean, stepTitle: string) => {
    await toggleStep(stepId, checked);
    if (checked) {
      const reward = STEP_REWARDS[stepTitle] || "✔️ Un paso más completado";
      toast.success(reward, { duration: 2500 });
      const insight = STEP_INSIGHTS[stepTitle];
      if (insight) {
        setTimeout(() => {
          setUnlockedInsight({ title: stepTitle, text: insight });
          setTimeout(() => setUnlockedInsight(null), 5000);
        }, 800);
      }
    }
  }, [toggleStep]);

  const isMissionUnlocked = (phase: typeof phases[0]) => {
    if (phase.order_index <= currentOrderIdx) return true;
    if (phase.order_index === currentOrderIdx + 1) return true;
    const prevPhase = phases.find(p => p.order_index === phase.order_index - 1);
    if (prevPhase) {
      const prevSteps = steps.filter(s => s.phase_id === prevPhase.id);
      const allPrevDone = prevSteps.length > 0 && prevSteps.every(s => completedStepIds.has(s.id));
      if (allPrevDone) return true;
    }
    return false;
  };

  const activeDeepDive = deepDivePhase !== null ? PHASE_LEARNING[deepDivePhase] : null;

  return (
    <div className="space-y-6">
      {/* ── Global Progress ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-5 sm:gap-8">
            {/* Circular progress */}
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - globalPercent / 100)}`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-extrabold text-primary leading-none">{globalPercent}%</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1">Tu camino hacia tu casa</h2>
              <p className="text-sm text-muted-foreground mb-2">{getGlobalMessage(globalPercent)}</p>
              <p className="text-xs text-muted-foreground">
                {completedTotal} de {totalSteps} pasos completados
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Unlocked Insight Overlay ── */}
      <AnimatePresence>
        {unlockedInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50"
          >
            <Card className="border-primary/30 bg-card shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-warning/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-warning mb-1">
                      💡 Lo que acabas de aprender
                    </p>
                    <p className="text-sm text-foreground">{unlockedInsight.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Deep Dive Modal ── */}
      <Dialog open={deepDivePhase !== null} onOpenChange={(open) => !open && setDeepDivePhase(null)}>
        {activeDeepDive && (
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {activeDeepDive.deepDive.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Información detallada para que tomes mejores decisiones
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              {activeDeepDive.deepDive.sections.map((section, i) => (
                <div key={i}>
                  <h4 className="font-bold text-sm text-foreground mb-1.5">{section.heading}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Microlearning Modal ── */}
      <Dialog open={microlearnModal !== null} onOpenChange={(open) => !open && setMicrolearnModal(null)}>
        {microlearnModal && (
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {microlearnModal.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Aprende lo esencial sobre este paso
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              {microlearnModal.sections.map((section, i) => (
                <div key={i}>
                  <h4 className="font-bold text-sm text-foreground mb-1.5">{section.heading}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.body}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Mission Blocks ── */}
      {phases.map((phase, idx) => {
        const phaseSteps = steps.filter(s => s.phase_id === phase.id);
        const phaseCompletedCount = phaseSteps.filter(s => completedStepIds.has(s.id)).length;
        const phaseTotal = phaseSteps.length;
        const phasePercent = phaseTotal > 0 ? Math.round((phaseCompletedCount / phaseTotal) * 100) : 0;
        const allComplete = phaseTotal > 0 && phaseCompletedCount === phaseTotal;
        const isCurrent = phase.id === trackerState?.current_phase_id;
        const unlocked = isMissionUnlocked(phase);
        const isExpanded = expandedPhase === phase.id;
        const feedback = getMissionFeedback(phaseCompletedCount, phaseTotal);
        const isAidsMission = phase.order_index === 3;
        const learning = PHASE_LEARNING[phase.order_index];

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
          >
            <Card
              className={`glow-card transition-all duration-300 ${
                !unlocked ? "opacity-50 blur-[1px]" : ""
              } ${isCurrent ? "border-2 border-primary/40 ring-2 ring-primary/10" : ""} ${
                allComplete ? "border-success/30 bg-success/[0.03]" : ""
              } ${isAidsMission && unlocked ? "border-warning/30" : ""}`}
            >
              {/* Mission Header */}
              <button
                onClick={() => unlocked && setExpandedPhase(isExpanded ? null : phase.id)}
                disabled={!unlocked}
                className="w-full text-left p-5 pb-3"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    allComplete
                      ? "bg-success/15 text-success"
                      : isCurrent
                        ? "bg-primary/20 text-primary"
                        : unlocked
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/60 text-muted-foreground/50"
                  }`}>
                    {!unlocked ? (
                      <Lock className="h-5 w-5" />
                    ) : allComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      PHASE_ICONS[phase.order_index] || <Target className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className={`font-bold text-base ${unlocked ? "text-foreground" : "text-muted-foreground/60"}`}>
                        {phase.name}
                      </h3>
                      {isCurrent && !allComplete && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          En progreso
                        </span>
                      )}
                      {allComplete && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-success/20 text-success px-2 py-0.5 rounded-full">
                          Completada
                        </span>
                      )}
                      {isAidsMission && unlocked && !allComplete && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                          💡 Puede acelerar tu compra
                        </span>
                      )}
                    </div>

                    {!unlocked && (
                      <p className="text-xs text-muted-foreground/50 mt-1">
                        🔒 Se desbloquea cuando completes el paso anterior
                      </p>
                    )}

                    {unlocked && feedback && (
                      <p className="text-xs text-muted-foreground mt-0.5">{feedback}</p>
                    )}

                    {unlocked && phaseTotal > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <Progress value={phasePercent} className="h-1.5 flex-1" />
                          <span className="text-xs font-semibold text-muted-foreground">{phaseCompletedCount}/{phaseTotal}</span>
                        </div>
                        {!allComplete && phaseCompletedCount > 0 && (
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Te {phaseTotal - phaseCompletedCount === 1 ? "queda" : "quedan"} {phaseTotal - phaseCompletedCount} paso{phaseTotal - phaseCompletedCount !== 1 ? "s" : ""} para completar esta fase
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {unlocked && (
                    <div className="shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Content: Actions + Learning */}
              <AnimatePresence>
                {isExpanded && unlocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1">
                      {/* ── 1. Actions (checklist) ── */}
                      <div className="space-y-1.5 ml-14">
                        {phaseSteps.map(step => {
                          const isCompleted = completedStepIds.has(step.id);
                          const microlearn = STEP_MICROLEARNING[step.title];
                          const isLearned = learnedSteps.has(step.title);
                          return (
                            <div key={step.id} className="space-y-1">
                              <label
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group"
                              >
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={(checked) => handleToggleStep(step.id, !!checked, step.title)}
                                  className="shrink-0 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className={`text-sm font-medium block ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                    {step.title}
                                  </span>
                                  {step.description && (
                                    <span className="text-xs text-muted-foreground block mt-0.5">
                                      {step.description}
                                    </span>
                                  )}
                                </div>
                                {isCompleted && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                  </motion.div>
                                )}
                              </label>

                              {/* Microlearning button or learned badge */}
                              {microlearn && (
                                <div className="ml-10 pl-2">
                                  {isLearned ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMicrolearnModal(microlearn);
                                      }}
                                      className="inline-flex items-center gap-1.5 text-xs text-success font-medium hover:underline transition-colors cursor-pointer"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Ya entiendes este paso
                                      <span className="text-muted-foreground ml-1">· Repasar</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMicrolearnModal(microlearn);
                                        markAsLearned(step.title);
                                      }}
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
                                    >
                                      <GraduationCap className="h-3.5 w-3.5" />
                                      Aprende sobre esta sección
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* ── 2. Essential Learning (always visible) ── */}
                      {learning && (
                        <div className="mt-4 ml-14 p-4 rounded-xl bg-muted/50 border border-border/50">
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="h-4 w-4 text-primary shrink-0" />
                            <p className="text-xs uppercase tracking-widest font-bold text-primary">
                              🧠 Aprende lo esencial
                            </p>
                          </div>
                          <ul className="space-y-2">
                            {learning.essentials.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-primary mt-0.5 shrink-0">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          {/* ── 3. Deep Dive button ── */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeepDivePhase(phase.order_index);
                            }}
                            className="mt-3 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 rounded-full px-4 gap-1.5"
                          >
                            <Search className="h-3.5 w-3.5" />
                            {learning.deepDive.buttonLabel}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      )}

                      {/* Mission complete message */}
                      {allComplete && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 ml-14 p-3 rounded-xl bg-success/10 border border-success/20"
                        >
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-success shrink-0" />
                            <p className="text-sm font-semibold text-success">Un paso más cerca de tu casa 🏡</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        );
      })}

      {/* ── Bottom encouragement ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <p className="text-sm text-muted-foreground italic">
          Con constancia en tu ahorro, tu objetivo está cada vez más cerca. 💪
        </p>
      </motion.div>
    </div>
  );
};

export default JourneyPath;
