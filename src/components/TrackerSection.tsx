import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/housing-data";
import {
  Target, Compass, Map, ArrowRight, Trophy, CheckCircle2,
  Circle, Sparkles, TrendingUp, Star,
} from "lucide-react";
import type { TrackerData } from "@/hooks/use-tracker-data";

interface TrackerSectionProps {
  tracker: TrackerData;
  userId: string;
  currentSavings: number;
  savingsTarget: number;
}

const TrackerSection = ({ tracker, userId, currentSavings, savingsTarget }: TrackerSectionProps) => {
  const { phases, steps, milestones, userMilestones, trackerState, stepProgress, toggleStep } = tracker;

  const progressPercent = savingsTarget > 0 ? Math.min(100, Math.round((currentSavings / savingsTarget) * 100)) : 0;
  const remaining = Math.max(0, savingsTarget - currentSavings);

  const currentPhase = phases.find(p => p.id === trackerState?.current_phase_id);
  const currentPhaseSteps = steps.filter(s => s.phase_id === currentPhase?.id);
  const completedStepIds = new Set(stepProgress.filter(s => s.completed).map(s => s.step_id));

  // Find next uncompleted step in current phase
  const nextStep = currentPhaseSteps.find(s => !completedStepIds.has(s.id));

  // Check and award milestones automatically
  useEffect(() => {
    if (!userId || milestones.length === 0) return;
    const achievedIds = new Set(userMilestones.map(m => m.milestone_id));
    const newMilestones = milestones.filter(m =>
      progressPercent >= m.percentage_required && !achievedIds.has(m.id)
    );
    if (newMilestones.length === 0) return;
    const insert = async () => {
      for (const m of newMilestones) {
        await supabase.from("user_milestones").upsert(
          { user_id: userId, milestone_id: m.id },
          { onConflict: "user_id,milestone_id" }
        );
      }
      tracker.refreshMilestones();
    };
    insert();
  }, [progressPercent, milestones, userMilestones, userId]);

  const achievedMilestoneIds = new Set(userMilestones.map(m => m.milestone_id));

  return (
    <div className="space-y-6">
      {/* Section 1 — Focus Now */}
      {currentPhase && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="glow-card bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Tu foco ahora</p>
                  <h3 className="text-xl font-extrabold mb-1">{currentPhase.name}</h3>
                  {nextStep && (
                    <div className="flex items-center gap-2 mt-2 mb-3">
                      <Star className="h-4 w-4 text-warning" />
                      <span className="text-sm font-bold">Paso clave: {nextStep.title}</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {trackerState?.focus_message || currentPhase.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section 2 — Savings Progress */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="glow-card border-2 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Tu progreso hacia tu primera vivienda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">{progressPercent}% completado</span>
                <span className="text-muted-foreground">Meta: {formatCurrency(savingsTarget)}</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-primary/10">
                <p className="text-xs text-muted-foreground font-semibold mb-1">Ahorrado</p>
                <p className="text-base font-extrabold">{formatCurrency(currentSavings)}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-xs text-muted-foreground font-semibold mb-1">Objetivo</p>
                <p className="text-base font-extrabold">{formatCurrency(savingsTarget)}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-xs text-muted-foreground font-semibold mb-1">Te falta</p>
                <p className="text-base font-extrabold">{formatCurrency(remaining)}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              {progressPercent >= 100
                ? "🎉 ¡Felicidades! Has alcanzado tu objetivo de ahorro."
                : progressPercent >= 50
                  ? "¡Vas por muy buen camino! Ya has superado la mitad de tu objetivo."
                  : progressPercent >= 10
                    ? "Ya has avanzado una parte importante del camino hacia tu primera vivienda."
                    : "Cada euro que ahorras te acerca un paso más a tu hogar. ¡Tú puedes!"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 3 — Journey Timeline */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Tu camino hacia la vivienda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {phases.map((phase, phaseIdx) => {
                const phaseSteps = steps.filter(s => s.phase_id === phase.id);
                const isCurrent = phase.id === trackerState?.current_phase_id;
                const currentOrderIdx = currentPhase?.order_index ?? 0;
                const isPast = phase.order_index < currentOrderIdx;
                const phaseCompletedCount = phaseSteps.filter(s => completedStepIds.has(s.id)).length;
                const allComplete = phaseSteps.length > 0 && phaseCompletedCount === phaseSteps.length;

                return (
                  <div key={phase.id} className="relative">
                    {/* Connector line */}
                    {phaseIdx < phases.length - 1 && (
                      <div className={`absolute left-5 top-10 w-0.5 h-full -mb-4 ${isPast || allComplete ? "bg-primary" : "bg-border"}`} />
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold z-10 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : isPast || allComplete
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {isPast || allComplete ? <CheckCircle2 className="h-5 w-5" /> : phase.order_index}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold text-sm ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                            {phase.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              Fase actual
                            </span>
                          )}
                        </div>
                        {(isCurrent || isPast) && phaseSteps.length > 0 && (
                          <div className="mt-2 space-y-1.5 ml-1">
                            {phaseSteps.map(step => {
                              const isCompleted = completedStepIds.has(step.id);
                              return (
                                <label
                                  key={step.id}
                                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                                >
                                  <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={(checked) => toggleStep(step.id, !!checked)}
                                    className="shrink-0"
                                  />
                                  <span className={`text-sm ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                    {step.title}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 4 — Next Recommended Step */}
      {nextStep && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="glow-card border-l-4 border-l-warning">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-warning/15 flex items-center justify-center shrink-0">
                  <ArrowRight className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Próximo paso recomendado</p>
                  <h4 className="font-bold text-base mb-1">{nextStep.title}</h4>
                  <p className="text-sm text-muted-foreground">{nextStep.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section 5 — Milestones */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Hitos alcanzados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map(milestone => {
                const achieved = achievedMilestoneIds.has(milestone.id);
                return (
                  <div
                    key={milestone.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      achieved ? "bg-primary/10" : "bg-muted/50"
                    }`}
                  >
                    {achieved ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${achieved ? "text-foreground" : "text-muted-foreground"}`}>
                        {milestone.percentage_required}% — {milestone.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{milestone.description}</p>
                    </div>
                    {achieved && <Sparkles className="h-4 w-4 text-warning shrink-0" />}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground italic mt-4">
              Cada paso cuenta. Ya estás avanzando hacia tu objetivo. 💪
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TrackerSection;
