import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { type AffordabilityResult, formatCurrency } from "@/lib/housing-data";
import {
  Home, TrendingUp, Target, Sparkles, ArrowRight, Building,
  Lightbulb, ChevronDown, ChevronUp, Landmark, Gift, Receipt, CheckCircle2,
} from "lucide-react";
import { type EligibleAid, type AidsImpactSummary } from "@/lib/housing-aids";

import doodleCelebrate from "@/assets/doodle-celebrate.png";
import doodleStrength from "@/assets/doodle-strength.png";
import doodleChart from "@/assets/doodle-chart.png";
import doodleGovernment from "@/assets/doodle-government.png";
import doodleTarget from "@/assets/doodle-target.png";
import doodleSearch from "@/assets/doodle-search.png";
import doodleHouse from "@/assets/illustration-housing.png";
import doodleBank from "@/assets/illustration-mortgage.png";

const doodleIconMap: Record<string, string> = {
  "🎉": doodleCelebrate, "🏦": doodleBank, "🔍": doodleSearch,
  "💪": doodleStrength, "📊": doodleChart, "🏛️": doodleGovernment,
  "🎯": doodleTarget, "🏠": doodleHouse,
};

const impactTypeIcon: Record<string, React.ElementType> = {
  financing_increase: TrendingUp, downpayment_reduction: Gift,
  grant: Gift, tax_reduction: Receipt,
};
const impactTypeColor: Record<string, string> = {
  financing_increase: "text-primary", downpayment_reduction: "text-success",
  grant: "text-success", tax_reduction: "text-warning",
};

interface DashboardProps {
  result: AffordabilityResult;
  eligibleAids: EligibleAid[];
  aidsImpact: AidsImpactSummary | null;
  aidsEnabled: boolean;
  onToggleAids: (enabled: boolean) => void;
}

const formatYears = (years: number, months: number) => {
  if (years === 0 && months === 0) return "¡Ya puedes comprar!";
  if (years === Infinity || months === -1) return "—";
  if (years >= 1) return `~${years} año${years !== 1 ? "s" : ""}`;
  return `${months} meses`;
};

const Dashboard = ({ result, eligibleAids, aidsImpact, aidsEnabled, onToggleAids }: DashboardProps) => {
  const [aidsExpanded, setAidsExpanded] = useState(false);
  const [banksExpanded, setBanksExpanded] = useState(false);

  const {
    city, preferences, estimatedPrice, totalUpfront, requiredDownPayment, taxesAndFees,
    reformCostEstimate, yearsToSave, monthsToSave, canAfford,
    monthlyMortgagePayment, actionPlan, bankOptions, optimizationTips,
    totalSavings, totalMonthlySavings, mortgagePercent, pricePerSqm, sqm,
  } = result;

  const hasAids = eligibleAids.length > 0 && !!aidsImpact;
  const yearsSaved = hasAids ? aidsImpact!.yearsSaved : 0;

  const displayTotalUpfront = aidsEnabled && aidsImpact ? aidsImpact.adjustedTotalUpfront : totalUpfront;
  const displaySavingsGap = Math.max(0, displayTotalUpfront - totalSavings);
  const displaySavingsProgress = displayTotalUpfront > 0
    ? Math.min(100, Math.round((totalSavings / displayTotalUpfront) * 100))
    : 100;

  const activeYears = aidsEnabled && aidsImpact ? aidsImpact.adjustedYearsToSave : yearsToSave;
  const activeMonths = aidsEnabled && aidsImpact ? aidsImpact.adjustedMonthsToSave : monthsToSave;

  return (
    <div className="space-y-4">

      {/* ─── BLOQUE 1: HERO ─── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border-2 border-primary/20 bg-primary/5 shadow-lg shadow-primary/5">
          <CardContent className="p-0">

            {/* Header */}
            <div className="px-6 pt-6 pb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">
                {city.name} · {preferences.propertyType}
              </p>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-5">
                ¿Cuándo podrás comprar tu casa?
              </h2>

              {/* Número principal — animado */}
              <div className="mb-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${aidsEnabled}-${activeYears}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-6xl font-extrabold tracking-tight text-primary leading-none">
                      {formatYears(activeYears, activeMonths)}
                    </p>
                    {aidsEnabled && hasAids && yearsSaved > 0 && (
                      <p className="text-sm font-bold text-success mt-2">
                        ✓ {yearsSaved} año{yearsSaved !== 1 ? "s" : ""} menos gracias a las ayudas
                      </p>
                    )}
                    {!aidsEnabled && (
                      <p className="text-sm text-muted-foreground mt-2">Sin incluir ayudas públicas</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Toggle */}
              {hasAids && (
                <div className="flex items-center justify-between bg-background/60 border border-border rounded-xl px-4 py-3">
                  <div>
                    <Label className="text-sm font-bold cursor-pointer">Incluir ayudas públicas</Label>
                    <p className="text-xs text-muted-foreground">
                      {eligibleAids.length} ayuda{eligibleAids.length !== 1 ? "s" : ""} aplicable{eligibleAids.length !== 1 ? "s" : ""}
                      {yearsSaved > 0 ? ` · ahorra ~${yearsSaved} año${yearsSaved !== 1 ? "s" : ""}` : ""}
                    </p>
                  </div>
                  <Switch checked={aidsEnabled} onCheckedChange={onToggleAids} />
                </div>
              )}
            </div>

            {/* Desplegable de ayudas */}
            {hasAids && (
              <div className="border-t border-primary/10">
                <button
                  onClick={() => setAidsExpanded(!aidsExpanded)}
                  className="w-full flex items-center justify-between px-6 py-3 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary">Ver qué ayudas aplican</span>
                  </div>
                  {aidsExpanded
                    ? <ChevronUp className="h-4 w-4 text-primary/60" />
                    : <ChevronDown className="h-4 w-4 text-primary/60" />
                  }
                </button>

                <AnimatePresence>
                  {aidsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 space-y-3">
                        {/* Pills de impacto */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {aidsImpact!.additionalFinancingPercent > 0 && (
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                              +{aidsImpact!.additionalFinancingPercent}% financiación
                            </span>
                          )}
                          {aidsImpact!.directGrants > 0 && (
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-success/10 text-success">
                              {formatCurrency(aidsImpact!.directGrants)} en subvenciones
                            </span>
                          )}
                          {aidsImpact!.estimatedTaxSavings > 0 && (
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-warning/10 text-warning">
                              {formatCurrency(aidsImpact!.estimatedTaxSavings)} ahorro fiscal
                            </span>
                          )}
                        </div>

                        {/* Lista de ayudas */}
                        {eligibleAids.map((aid) => {
                          const Icon = impactTypeIcon[aid.impact_type] || Landmark;
                          const colorClass = impactTypeColor[aid.impact_type] || "text-primary";
                          return (
                            <div key={aid.id} className="flex items-start gap-3 p-3 rounded-xl bg-background/70 border border-border">
                              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-muted ${colorClass}`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-bold">{aid.name}</p>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-semibold text-muted-foreground shrink-0">
                                    {aid.region}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{aid.benefit_description}</p>
                                <p className={`text-xs font-bold mt-1 ${colorClass}`}>{aid.estimatedImpact}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </CardContent>
        </Card>
      </motion.div>

      {/* ─── BLOQUES 2+3: AHORRO E HIPOTECA ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Objetivo de ahorro */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="glow-card h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tu objetivo de ahorro</span>
              </div>

              <div className="mb-1">
                <p className="text-xs text-muted-foreground mb-0.5">Necesitas</p>
                <p className="text-2xl font-extrabold">{formatCurrency(displayTotalUpfront)}</p>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-0.5">Tienes ahora</p>
                <p className="text-2xl font-extrabold text-primary">{formatCurrency(totalSavings)}</p>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{displaySavingsProgress}% conseguido</span>
                  {displaySavingsGap > 0 && (
                    <span className="font-bold text-foreground">Faltan {formatCurrency(displaySavingsGap)}</span>
                  )}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${displaySavingsProgress}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-border pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Entrada ({100 - mortgagePercent}%)</span>
                  <span className="font-bold">{formatCurrency(requiredDownPayment)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Impuestos y gastos</span>
                  <span className="font-bold">{formatCurrency(taxesAndFees)}</span>
                </div>
                {reformCostEstimate > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Reforma</span>
                    <span className="font-bold text-warning">{formatCurrency(reformCostEstimate)}</span>
                  </div>
                )}
                {totalMonthlySavings > 0 && (
                  <div className="flex justify-between text-xs pt-1 border-t border-border">
                    <span className="text-muted-foreground">Ahorras al mes</span>
                    <span className="font-bold text-primary">{formatCurrency(totalMonthlySavings)}/mes</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vivienda e hipoteca */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="glow-card h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">La vivienda y la hipoteca</span>
              </div>

              <div className="mb-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Precio estimado</p>
                  <p className="text-2xl font-extrabold">{formatCurrency(estimatedPrice)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(pricePerSqm)}/m² · {sqm} m²</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Cuota mensual estimada</p>
                  <p className="text-2xl font-extrabold">{formatCurrency(monthlyMortgagePayment)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{mortgagePercent}% financiado · 30 años</p>
                </div>
              </div>

              <div className={`flex items-start gap-2 text-xs font-bold px-3 py-2 rounded-lg ${canAfford ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{canAfford
                  ? "Tu capacidad de endeudamiento cubre esta hipoteca"
                  : "La cuota supera el 35% de tus ingresos — considera revisar el precio"
                }</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── BLOQUE 4: PLAN DE ACCIÓN ─── */}
      {actionPlan.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Tu plan de acción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {actionPlan.map((step, i) => {
                const doodleSrc = doodleIconMap[step.icon];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {doodleSrc
                        ? <img src={doodleSrc} alt="" className="h-5 w-5 object-contain" />
                        : <span className="text-base">{step.icon}</span>
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      {step.impact && (
                        <span className="inline-block mt-1.5 text-xs font-bold text-primary">{step.impact}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── BLOQUE 5: IDEAS PARA OPTIMIZAR ─── */}
      {optimizationTips.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                Ideas para llegar antes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {optimizationTips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20"
                >
                  <Lightbulb className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{tip.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                    <span className="inline-block mt-1 text-xs font-bold text-warning">{tip.potentialSaving}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── BLOQUE 6: BANCOS — colapsado ─── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="glow-card overflow-hidden">
          <button
            onClick={() => setBanksExpanded(!banksExpanded)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-bold text-muted-foreground">Comparativa de bancos</span>
              <span className="text-xs text-muted-foreground/60">· referencia orientativa</span>
            </div>
            {banksExpanded
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </button>

          <AnimatePresence>
            {banksExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Cuota calculada a 30 años con {mortgagePercent}% de financiación. Las condiciones finales dependen de tu perfil bancario.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bankOptions.map((bank, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className="rounded-xl bg-muted/50 border border-border p-4 h-full flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${bank.website}&size=32`}
                              alt={bank.name}
                              className="w-5 h-5 rounded-sm shrink-0"
                            />
                            <p className="text-sm font-extrabold">{bank.name}</p>
                          </div>
                          <p className="text-xl font-mono font-extrabold text-foreground mb-1">{bank.rate}</p>
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

    </div>
  );
};

export default Dashboard;
