import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type AffordabilityResult, formatCurrency } from "@/lib/housing-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Timer, Euro, Target, TrendingUp, Sparkles, ArrowRight,
  Building, Lightbulb, Shield, CheckCircle2, Compass, Star,
  Map, Trophy, Zap, Home,
} from "lucide-react";
import HousingAidsSection from "@/components/HousingAidsSection";
import { type EligibleAid, type AidsImpactSummary } from "@/lib/housing-aids";
import type { TrackerData } from "@/hooks/use-tracker-data";

interface DashboardProps {
  result: AffordabilityResult;
  eligibleAids: EligibleAid[];
  aidsImpact: AidsImpactSummary | null;
  aidsEnabled: boolean;
  onToggleAids: (enabled: boolean) => void;
  trackerData?: TrackerData;
}

// Compute a readiness score from 0–100
function computeReadinessScore(result: AffordabilityResult): number {
  let score = 0;
  // Savings progress: up to 40 points
  const savingsPct = Math.min(result.savingsProgress, 100);
  score += (savingsPct / 100) * 40;
  // DTI health: up to 25 points (lower is better, <35% is excellent)
  const dtiScore = result.debtToIncomeRatio <= 35
    ? 25
    : result.debtToIncomeRatio <= 45
      ? 15
      : 5;
  score += dtiScore;
  // Affordability ratio: up to 25 points
  const affordPct = Math.min(result.affordabilityRatio, 100);
  score += (affordPct / 100) * 25;
  // Monthly savings habit: up to 10 points
  const savingsRatio = result.totalMonthlyIncome > 0
    ? (result.totalMonthlySavings / result.totalMonthlyIncome) * 100
    : 0;
  score += Math.min(savingsRatio / 30, 1) * 10;
  return Math.round(Math.min(score, 100));
}

function getReadinessLabel(score: number): { label: string; color: string; message: string } {
  if (score >= 80) return { label: "Excelente", color: "text-success", message: "Estás muy bien preparado. Tu objetivo está al alcance." };
  if (score >= 60) return { label: "Buen camino", color: "text-primary", message: "Estás en buen camino. Algunos ajustes pueden acercarte más rápido." };
  if (score >= 40) return { label: "Avanzando", color: "text-warning", message: "Vas avanzando paso a paso. La constancia es tu mejor aliada." };
  return { label: "Empezando", color: "text-muted-foreground", message: "Tu camino hacia la compra ya comenzó. Cada paso cuenta." };
}

function getNextBestAction(result: AffordabilityResult): { title: string; description: string; impact: string } {
  const years = result.yearsToSave;
  if (result.canAfford) {
    return {
      title: "Solicitar preaprobación hipotecaria",
      description: "Contacta con 2-3 bancos para obtener una preaprobación. Esto te da poder de negociación al buscar vivienda.",
      impact: "Puedes empezar a buscar vivienda ya",
    };
  }
  if (years <= 2) {
    return {
      title: "Preparar tu documentación hipotecaria",
      description: "Reúne tus últimas nóminas, declaración de la renta y vida laboral. Estar preparado acelera el proceso.",
      impact: "Esto podría adelantar tu compra varios meses",
    };
  }
  if (years <= 5) {
    return {
      title: `Aumentar tu ahorro mensual en ${formatCurrency(200)}`,
      description: "Un pequeño incremento mensual tiene un efecto acumulativo enorme a lo largo del tiempo.",
      impact: "Esto podría adelantar tu compra aproximadamente 1 año",
    };
  }
  return {
    title: "Construir una estrategia financiera sólida",
    description: "Revisa tus gastos fijos, reduce deudas y automatiza tu ahorro mensual. La base financiera es clave.",
    impact: "Cada euro optimizado acelera tu objetivo",
  };
}

const propertyTypeLabels: Record<string, string> = {
  apartamento: "Apartamento", casa: "Casa", "obra-nueva": "Obra nueva", "segunda-mano": "Segunda mano",
};
const zoneLabels: Record<string, string> = {
  centro: "Centro", metropolitana: "Área metropolitana", periferia: "Periferia",
};

const Dashboard = ({ result, eligibleAids, aidsImpact, aidsEnabled, onToggleAids, trackerData }: DashboardProps) => {
  const {
    city, preferences, estimatedPrice, totalUpfront, requiredDownPayment, taxesAndFees,
    reformCostEstimate, savingsGap, yearsToSave, monthsToSave, maxHomePrice, canAfford,
    monthlyMortgagePayment, savingsProgress, bankOptions, optimizationTips,
    isYoungBuyer, debtToIncomeRatio, totalMonthlyIncome, totalSavings,
    totalMonthlySavings, totalMonthlyDebts, numBuyers, mortgagePercent, pricePerSqm, sqm,
  } = result;

  const displayTotalUpfront = aidsEnabled && aidsImpact ? aidsImpact.adjustedTotalUpfront : totalUpfront;
  const displaySavingsGap = Math.max(0, displayTotalUpfront - totalSavings);
  const displaySavingsProgress = displayTotalUpfront > 0 ? Math.min(100, Math.round((totalSavings / displayTotalUpfront) * 100)) : 100;
  const displayCanAfford = maxHomePrice >= (estimatedPrice + reformCostEstimate) && totalSavings >= displayTotalUpfront;
  const displayYearsToSave = aidsEnabled && aidsImpact ? aidsImpact.adjustedYearsToSave : yearsToSave;
  const displayMonthsToSave = aidsEnabled && aidsImpact ? aidsImpact.adjustedMonthsToSave : monthsToSave;

  const readinessScore = computeReadinessScore(result);
  const readiness = getReadinessLabel(readinessScore);
  const nextAction = getNextBestAction(result);

  const displayYears = displayYearsToSave === 0 ? "¡Ya!" : displayYearsToSave === Infinity ? "—" : `~${displayYearsToSave} años`;
  const displayMonths = displayMonthsToSave <= 0 ? "" : `${displayMonthsToSave} meses`;
  const propertyDesc = `${propertyTypeLabels[preferences.propertyType] || preferences.propertyType} · ${sqm} m² · ${preferences.rooms} hab · ${zoneLabels[preferences.zone] || preferences.zone}`;

  // Tracker data
  const currentPhase = trackerData?.phases.find(p => p.id === trackerData.trackerState?.current_phase_id);
  const currentPhaseSteps = trackerData ? trackerData.steps.filter(s => s.phase_id === currentPhase?.id) : [];
  const completedStepIds = new Set(trackerData?.stepProgress.filter(s => s.completed).map(s => s.step_id) || []);
  const nextStep = currentPhaseSteps.find(s => !completedStepIds.has(s.id));

  const cardDelay = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.08 } });

  return (
    <div className="space-y-6">

      {/* ===== ROW 1: KEY METRICS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1 — Time to buy (spans 2 cols) */}
        <motion.div {...cardDelay(0)} className="sm:col-span-2">
          <Card className={`glow-card h-full overflow-hidden ${displayCanAfford ? "border-success border-2" : "border-2 border-primary/40"}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${displayCanAfford ? "bg-success/15" : "bg-primary/15"}`}>
                  <Timer className={`h-7 w-7 ${displayCanAfford ? "text-success" : "text-primary"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Tiempo estimado para comprar</p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className={`text-5xl font-extrabold tracking-tight font-mono ${displayCanAfford ? "text-success" : "text-foreground"}`}>
                      {displayYears}
                    </p>
                    {!displayCanAfford && displayMonths && (
                      <p className="text-lg text-muted-foreground font-mono">({displayMonths})</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {displayCanAfford
                      ? "¡Puedes dar el paso cuando quieras!"
                      : "Con tu situación actual estás avanzando en la dirección correcta."}
                  </p>
                </div>
              </div>
              {/* Readiness score integrated */}
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Preparación para comprar</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-xl font-extrabold font-mono ${readiness.color}`}>{readinessScore}%</span>
                    <span className={`text-xs font-bold ${readiness.color}`}>{readiness.label}</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-primary)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${readinessScore}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{readiness.message}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2 — Savings */}
        <motion.div {...cardDelay(1)}>
          <Card className="glow-card h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-xl bg-success/15 flex items-center justify-center">
                  <Euro className="h-4.5 w-4.5 text-success" />
                </div>
                <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Ahorros</span>
              </div>
              <p className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                {formatCurrency(totalSavings)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Meta: {formatCurrency(displayTotalUpfront)}
              </p>
              <Progress value={displaySavingsProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">{displaySavingsProgress}% completado</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 3 — Purchase capacity */}
        <motion.div {...cardDelay(2)}>
          <Card className="glow-card h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Home className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Vivienda estimada</span>
              </div>
              <p className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                {formatCurrency(estimatedPrice)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(pricePerSqm)}/m² · {sqm} m²
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Basado en tus preferencias y mercado actual.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ===== Aids toggle ===== */}
      {eligibleAids.length > 0 && aidsImpact && (
        <motion.div {...cardDelay(4)}>
          <Card className="glow-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold cursor-pointer">Incluir ayudas públicas</Label>
                <p className="text-xs text-muted-foreground">Recalcula con las ayudas aplicables</p>
              </div>
              <Switch checked={aidsEnabled} onCheckedChange={onToggleAids} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ===== Housing Aids (detailed) ===== */}
      {eligibleAids.length > 0 && aidsImpact && (
        <HousingAidsSection
          eligibleAids={eligibleAids}
          impact={aidsImpact}
          isYoungBuyer={isYoungBuyer}
          originalYearsToSave={yearsToSave}
          onToggleAids={onToggleAids}
          aidsEnabled={aidsEnabled}
        />
      )}

      {/* ===== ROW 2: PROGRESS TOWARD PURCHASE ===== */}
      <motion.div {...cardDelay(5)}>
        <Card className="glow-card overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3 mb-1">
                <Map className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Tu camino hacia la compra</h3>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                {propertyDesc} en {city.name}
                {aidsEnabled && aidsImpact ? " · con ayudas" : ""}
              </p>
            </div>

            {/* Big progress bar */}
            <div className="px-6 py-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-foreground">{displaySavingsProgress}% del objetivo</span>
                {!displayCanAfford && displaySavingsGap > 0 && (
                  <span className="text-muted-foreground">Faltan <span className="font-bold text-foreground">{formatCurrency(displaySavingsGap)}</span></span>
                )}
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(displaySavingsProgress, 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{formatCurrency(totalSavings)}</span>
                <span>{formatCurrency(displayTotalUpfront)}</span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground font-semibold">Entrada ({100 - mortgagePercent}%)</p>
                <p className="text-sm font-extrabold mt-0.5">{formatCurrency(requiredDownPayment)}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground font-semibold">Impuestos (~10%)</p>
                <p className="text-sm font-extrabold mt-0.5">{formatCurrency(taxesAndFees)}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground font-semibold">Cuota hipotecaria</p>
                <p className="text-sm font-extrabold mt-0.5">{formatCurrency(monthlyMortgagePayment)}/mes</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground font-semibold">Ratio deuda</p>
                <p className={`text-sm font-extrabold mt-0.5 ${debtToIncomeRatio <= 35 ? "text-success" : "text-warning"}`}>{debtToIncomeRatio}%</p>
              </div>
            </div>

            {/* Phase indicator */}
            {trackerData && trackerData.phases.length > 0 && (
              <div className="px-6 pb-5">
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {trackerData.phases.map((phase, i) => {
                    const isCurrent = phase.id === trackerData.trackerState?.current_phase_id;
                    const currentOrderIdx = currentPhase?.order_index ?? 0;
                    const isPast = phase.order_index < currentOrderIdx;
                    return (
                      <div key={phase.id} className="flex items-center gap-1 shrink-0">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : isPast
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {isPast ? <CheckCircle2 className="h-3 w-3" /> : null}
                          <span className="whitespace-nowrap">{phase.name}</span>
                        </div>
                        {i < trackerData.phases.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {currentPhase && (
                  <p className="text-xs text-muted-foreground mt-2 ml-1">
                    {trackerData.trackerState?.focus_message || currentPhase.description}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== ROW 3: NEXT BEST ACTION ===== */}
      <motion.div {...cardDelay(6)}>
        <Card className="glow-card border-l-4 border-l-primary overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Tu siguiente mejor paso</p>
                <h3 className="text-lg font-extrabold mb-1">{nextAction.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{nextAction.description}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  {nextAction.impact}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== Housing Aids ===== */}
      {eligibleAids.length > 0 && aidsImpact && (
        <HousingAidsSection
          eligibleAids={eligibleAids}
          impact={aidsImpact}
          isYoungBuyer={isYoungBuyer}
          originalYearsToSave={yearsToSave}
          onToggleAids={onToggleAids}
          aidsEnabled={aidsEnabled}
        />
      )}

      {/* ===== ROW 4: TRACKER PREVIEW ===== */}
      {trackerData && trackerData.milestones.length > 0 && (
        <motion.div {...cardDelay(7)}>
          <Card className="glow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-warning" />
                <h3 className="text-lg font-bold">Tu progreso</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {/* Savings for down payment */}
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Ahorro para entrada</p>
                  <p className="text-lg font-extrabold font-mono">{displaySavingsProgress}%</p>
                  <Progress value={displaySavingsProgress} className="h-1.5 mt-1.5" />
                </div>
                {/* Monthly savings habit */}
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Ahorro mensual</p>
                  <p className="text-lg font-extrabold font-mono">
                    {totalMonthlyIncome > 0 ? Math.round((totalMonthlySavings / totalMonthlyIncome) * 100) : 0}%
                  </p>
                  <Progress value={totalMonthlyIncome > 0 ? Math.min(100, (totalMonthlySavings / totalMonthlyIncome) * 100) : 0} className="h-1.5 mt-1.5" />
                </div>
                {/* Debt health */}
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Salud deuda</p>
                  <p className={`text-lg font-extrabold font-mono ${debtToIncomeRatio <= 35 ? "text-success" : "text-warning"}`}>
                    {Math.max(0, 100 - debtToIncomeRatio)}%
                  </p>
                  <Progress value={Math.max(0, 100 - debtToIncomeRatio)} className="h-1.5 mt-1.5" />
                </div>
                {/* Readiness */}
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Preparación</p>
                  <p className={`text-lg font-extrabold font-mono ${readiness.color}`}>{readinessScore}%</p>
                  <Progress value={readinessScore} className="h-1.5 mt-1.5" />
                </div>
              </div>

              {/* Milestones row */}
              <div className="space-y-2">
                {trackerData.milestones.map(milestone => {
                  const achieved = trackerData.userMilestones.some(m => m.milestone_id === milestone.id);
                  return (
                    <div key={milestone.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${achieved ? "bg-primary/10" : "bg-muted/30"}`}>
                      {achieved ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                      )}
                      <span className={`text-sm font-semibold ${achieved ? "text-foreground" : "text-muted-foreground"}`}>
                        {milestone.percentage_required}% — {milestone.title}
                      </span>
                      {achieved && <Sparkles className="h-3.5 w-3.5 text-warning ml-auto shrink-0" />}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground italic mt-3">
                {displaySavingsProgress >= 50
                  ? "¡Vas por muy buen camino! Ya superaste la mitad de tu objetivo."
                  : "Cada paso cuenta. Ya estás avanzando hacia tu objetivo."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ===== Optimization Tips ===== */}
      {optimizationTips.length > 0 && (
        <motion.div {...cardDelay(8)}>
          <Card className="glow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-warning" />
                <h3 className="text-lg font-bold">Ideas para optimizar</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optimizationTips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.06 }}
                    className="p-4 rounded-xl bg-warning/5 border border-warning/20"
                  >
                    <p className="text-sm font-bold">{tip.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                    <span className="inline-block mt-1.5 text-xs font-bold text-warning">{tip.potentialSaving}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ===== Banks ===== */}
      <motion.div {...cardDelay(9)}>
        <Card className="glow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Comparativa de bancos</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {bankOptions.map((bank, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.05 }}>
                  <div className="rounded-xl bg-muted/50 border border-border p-4 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${bank.website}&size=32`} alt={bank.name} className="w-5 h-5 rounded-sm shrink-0" />
                      <p className="text-sm font-extrabold">{bank.name}</p>
                    </div>
                    <p className="text-2xl font-mono font-extrabold text-foreground mb-1">{bank.rate}</p>
                    <p className="text-xs text-muted-foreground mb-1">Hasta {bank.maxFinancing}</p>
                    <p className="text-xs text-muted-foreground flex-1">{bank.specialCondition}</p>
                    <div className="mt-3 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Cuota estimada</p>
                      <p className="text-sm font-extrabold">{formatCurrency(monthlyMortgagePayment)}/mes</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default Dashboard;
