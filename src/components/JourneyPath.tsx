import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Home, Lock, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, Zap, TrendingUp, Target, Shield, Search,
  FileText, Handshake, Award,
} from "lucide-react";
import type { TrackerData } from "@/hooks/use-tracker-data";

/* ── Micro-education unlocks per step (by step title keyword) ── */
const STEP_INSIGHTS: Record<string, string> = {
  "Calcular cuánto puedes permitirte": "El banco suele permitir una cuota de hasta el 30-35% de tu sueldo neto. Ahora ya sabes dónde está tu límite.",
  "Estimar precio de vivienda": "Conocer los precios reales de tu zona te evita perder tiempo con viviendas fuera de tu alcance.",
  "Identificar ayudas públicas": "Muchas personas no aprovechan ayudas a las que tienen derecho. Tú ya estás un paso por delante.",
  "Revisar perfil financiero": "Un perfil financiero claro es lo que los bancos miran primero. Ya lo tienes controlado.",
  "Reducir deudas": "Cada deuda que reduces mejora directamente tu capacidad hipotecaria.",
  "Construir la entrada": "No necesitas el 100% del dinero de golpe. Con constancia mensual, la entrada se construye sola.",
  "Entender financiación 80/90/100": "Saber que existen opciones de financiación al 90% o 100% puede cambiar completamente tu horizonte.",
  "Explorar aval público": "Los avales públicos pueden cubrir hasta el 20% que el banco no financia. Es una ventaja enorme.",
  "Explorar aval familiar": "Un aval familiar bien gestionado puede adelantar tu compra varios años.",
  "Definir presupuesto real": "Tener un presupuesto claro te da confianza para negociar sin miedo.",
  "Buscar viviendas": "Buscar con criterio claro es mucho más eficiente que visitar todo lo que aparece.",
  "Visitar propiedades": "Las visitas presenciales revelan cosas que las fotos nunca muestran.",
  "Pedir preaprobación": "Con una preaprobación, los vendedores te toman mucho más en serio.",
  "Comparar hipotecas": "La diferencia entre hipotecas puede suponer miles de euros a lo largo de los años.",
  "Negociar condiciones": "Negociar puede ahorrarte entre 5.000€ y 20.000€ en el total de tu hipoteca.",
  "Reservar vivienda": "La reserva asegura que nadie más se lleve tu vivienda mientras preparas la compra.",
  "Firmar contrato de arras": "Las arras son tu compromiso formal. A partir de aquí, la vivienda es prácticamente tuya.",
  "Firma de hipoteca": "¡El último paso! Después de esto, las llaves son tuyas.",
};

/* ── Completion micro-rewards (toasts) ── */
const STEP_REWARDS: Record<string, string> = {
  "Calcular cuánto puedes permitirte": "✔️ Ya sabes cuánto puedes gastar",
  "Estimar precio de vivienda": "✔️ Tienes una referencia de precios real",
  "Identificar ayudas públicas": "✔️ Estás aprovechando ventajas que mucha gente ignora",
  "Revisar perfil financiero": "✔️ Tu perfil financiero está bajo control",
  "Reducir deudas": "✔️ Estás mejorando tu capacidad hipotecaria",
  "Construir la entrada": "✔️ Cada euro cuenta. Estás construyendo tu futuro",
  "Entender financiación 80/90/100": "✔️ Ya entiendes las opciones que tienes",
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

/* ── Mission icons ── */
const PHASE_ICONS: Record<number, React.ReactNode> = {
  1: <Target className="h-5 w-5" />,
  2: <Shield className="h-5 w-5" />,
  3: <Zap className="h-5 w-5" />,
  4: <Search className="h-5 w-5" />,
  5: <FileText className="h-5 w-5" />,
  6: <Handshake className="h-5 w-5" />,
};

/* ── Emotional progress messages ── */
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

/* ── Props ── */
interface JourneyPathProps {
  tracker: TrackerData;
  userId: string;
}

const JourneyPath = ({ tracker, userId }: JourneyPathProps) => {
  const { phases, steps, stepProgress, toggleStep, trackerState } = tracker;
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [unlockedInsight, setUnlockedInsight] = useState<{ title: string; text: string } | null>(null);

  const completedStepIds = new Set(stepProgress.filter(s => s.completed).map(s => s.step_id));
  const totalSteps = steps.length;
  const completedTotal = completedStepIds.size;
  const globalPercent = totalSteps > 0 ? Math.round((completedTotal / totalSteps) * 100) : 0;

  const currentPhase = phases.find(p => p.id === trackerState?.current_phase_id);
  const currentOrderIdx = currentPhase?.order_index ?? 1;

  // Auto-expand current phase on mount
  useEffect(() => {
    if (currentPhase && !expandedPhase) setExpandedPhase(currentPhase.id);
  }, [currentPhase]);

  const handleToggleStep = useCallback(async (stepId: string, checked: boolean, stepTitle: string) => {
    await toggleStep(stepId, checked);

    if (checked) {
      // Show micro-reward toast
      const reward = STEP_REWARDS[stepTitle] || "✔️ Un paso más completado";
      toast.success(reward, { duration: 2500 });

      // Show micro-education insight
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
    // Current and past phases are unlocked
    if (phase.order_index <= currentOrderIdx) return true;
    // Next phase after current is unlocked
    if (phase.order_index === currentOrderIdx + 1) return true;
    // A phase is unlocked if the previous phase is fully completed
    const prevPhase = phases.find(p => p.order_index === phase.order_index - 1);
    if (prevPhase) {
      const prevSteps = steps.filter(s => s.phase_id === prevPhase.id);
      const allPrevDone = prevSteps.length > 0 && prevSteps.every(s => completedStepIds.has(s.id));
      if (allPrevDone) return true;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* ── Global Progress ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glow-card border-2 border-primary/30 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-extrabold">Tu camino hacia tu casa</h2>
                <p className="text-sm text-muted-foreground">{getGlobalMessage(globalPercent)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-extrabold text-primary">{globalPercent}%</p>
              </div>
            </div>
            <Progress value={globalPercent} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTotal} de {totalSteps} pasos completados
            </p>
          </CardContent>
        </Card>
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
                  {/* Status icon */}
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

                  {/* Content */}
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

                    {/* Block progress */}
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

                  {/* Expand/collapse */}
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

              {/* Expanded Steps */}
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
                      <div className="space-y-1.5 ml-14">
                        {phaseSteps.map(step => {
                          const isCompleted = completedStepIds.has(step.id);
                          return (
                            <label
                              key={step.id}
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
                          );
                        })}
                      </div>

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
