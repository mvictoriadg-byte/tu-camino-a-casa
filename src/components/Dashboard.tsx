import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { type AffordabilityResult, formatCurrency } from "@/lib/housing-data";
import {
  Home, TrendingUp, Clock, CheckCircle2, Landmark, Euro, Target, Receipt,
  Wrench, Sparkles, ArrowRight, Building, Lightbulb, Flag, Trophy, Shield,
  Users, Timer, Percent,
} from "lucide-react";

interface DashboardProps {
  result: AffordabilityResult;
}

const propertyTypeLabels: Record<string, string> = {
  apartamento: "Apartamento", casa: "Casa", "obra-nueva": "Obra nueva", "segunda-mano": "Segunda mano",
};
const zoneLabels: Record<string, string> = {
  centro: "Centro", metropolitana: "Área metropolitana", periferia: "Periferia",
};

const Dashboard = ({ result }: DashboardProps) => {
  const {
    city, preferences, estimatedPrice, totalUpfront, requiredDownPayment, taxesAndFees,
    reformCostEstimate, savingsGap, yearsToSave, monthsToSave, maxHomePrice, canAfford,
    monthlyMortgagePayment, savingsProgress, actionPlan, bankOptions, optimizationTips,
    milestones, isYoungBuyer, debtToIncomeRatio, totalMonthlyIncome, totalSavings,
    totalMonthlySavings, totalMonthlyDebts, numBuyers, mortgagePercent, pricePerSqm, sqm,
  } = result;

  const propertyDesc = `${propertyTypeLabels[preferences.propertyType] || preferences.propertyType} · ${sqm} m² · ${preferences.rooms} hab · ${zoneLabels[preferences.zone] || preferences.zone}`;
  const displayYears = yearsToSave === 0 ? "¡Ya!" : yearsToSave === Infinity ? "—" : `~${yearsToSave} años`;
  const displayMonths = monthsToSave <= 0 ? "" : `${monthsToSave} meses`;
  const totalMonths = monthsToSave <= 0 ? 0 : monthsToSave;

  return (
    <div className="space-y-5">
      {/* HERO: Compact Time to Buy */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className={`glow-card border-2 ${canAfford ? "border-success" : "border-primary"}`}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center h-14 w-14 rounded-xl shrink-0 ${canAfford ? "bg-success/20" : "bg-primary/20"}`}>
                {canAfford ? <Trophy className="h-7 w-7 text-success" /> : <Timer className="h-7 w-7 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-0.5">
                  {canAfford ? "¡Puedes comprar ya!" : "Tiempo estimado hasta tu casa"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl sm:text-4xl font-bold ${canAfford ? "text-success" : "text-primary"}`}>
                    {displayYears}
                  </span>
                  {!canAfford && displayMonths && (
                    <span className="text-sm text-muted-foreground font-mono">({displayMonths})</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{propertyDesc} en {city.name}</p>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-xs text-muted-foreground">Progreso</p>
                <p className="text-2xl font-bold text-primary font-mono">{savingsProgress}%</p>
              </div>
            </div>
            {/* Inline progress bar */}
            <div className="mt-3">
              <div className="progress-bar">
                <motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${Math.min(savingsProgress, 100)}%` }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>Ahorros: {formatCurrency(totalSavings)}</span>
                {!canAfford && savingsGap > 0 && (
                  <span>Faltan: <span className="text-primary font-semibold">{formatCurrency(savingsGap)}</span></span>
                )}
                <span>Meta: {formatCurrency(totalUpfront)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Co-buyers summary */}
      {numBuyers > 1 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="glow-card border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Comprando entre {numBuyers} personas</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><p className="text-xs text-muted-foreground">Ingresos totales</p><p className="text-base font-bold text-primary">{formatCurrency(totalMonthlyIncome)}<span className="text-xs font-normal text-muted-foreground">/mes</span></p></div>
                <div><p className="text-xs text-muted-foreground">Ahorros totales</p><p className="text-base font-bold text-primary">{formatCurrency(totalSavings)}</p></div>
                <div><p className="text-xs text-muted-foreground">Ahorro mensual</p><p className="text-base font-bold text-primary">{formatCurrency(totalMonthlySavings)}<span className="text-xs font-normal text-muted-foreground">/mes</span></p></div>
                <div><p className="text-xs text-muted-foreground">Deudas totales</p><p className="text-base font-bold text-muted-foreground">{formatCurrency(totalMonthlyDebts)}<span className="text-xs font-normal">/mes</span></p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* PRIMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Precio estimado vivienda"
          value={formatCurrency(estimatedPrice)}
          icon={Home}
          subtitle={`${formatCurrency(pricePerSqm)}/m² · ${sqm} m² en ${city.name}`}
          delay={0.15}
          variant="default"
          size="large"
        />
        {/* Merged: Total cost required (down payment + taxes) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="glow-card h-full border-primary/30">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Coste total para comprar</span>
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="stat-value text-primary mb-3">{formatCurrency(totalUpfront)}</div>
              <div className="space-y-1.5 border-t border-border pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Entrada ({100 - mortgagePercent}%)</span>
                  <span className="font-medium">{formatCurrency(requiredDownPayment)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Impuestos y gastos (~10%)</span>
                  <span className="font-medium">{formatCurrency(taxesAndFees)}</span>
                </div>
                {reformCostEstimate > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Reforma estimada</span>
                    <span className="font-medium text-warning">{formatCurrency(reformCostEstimate)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SECONDARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Tu capacidad de compra"
          value={formatCurrency(maxHomePrice)}
          icon={TrendingUp}
          subtitle="Máximo que puedes permitirte"
          variant={canAfford ? "success" : "warning"}
          delay={0.25}
        />
        {reformCostEstimate > 0 && (
          <StatCard
            label="Coste de reforma"
            value={formatCurrency(reformCostEstimate)}
            icon={Wrench}
            subtitle="Estimación según estado"
            variant="warning"
            delay={0.3}
          />
        )}
        <StatCard
          label="Cuota hipotecaria"
          value={`${formatCurrency(monthlyMortgagePayment)}/mes`}
          icon={Euro}
          subtitle={`30 años · ${city.mortgageRate}% · Hipoteca ${mortgagePercent}% · DTI: ${debtToIncomeRatio}%`}
          variant={debtToIncomeRatio <= 35 ? "success" : "destructive"}
          delay={0.35}
        />
      </div>

      {/* Milestones */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Flag className="h-5 w-5 text-primary" /> Tu Roadmap de Ahorro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.06 }} className="flex items-center gap-4">
                    <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.reached ? "bg-success/20" : "bg-muted"}`}>
                      {m.reached ? <CheckCircle2 className="h-4 w-4 text-success" /> : <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`text-sm font-medium ${m.reached ? "text-success" : "text-foreground"}`}>{m.label}</span>
                      <span className={`text-xs font-mono ${m.reached ? "text-success" : "text-muted-foreground"}`}>{m.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Tu Plan de Acción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {actionPlan.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.08 }} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                <span className="text-2xl shrink-0">{step.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {step.impact && <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary"><ArrowRight className="h-3 w-3" /> {step.impact}</span>}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Bank Comparison — VERTICAL */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Comparativa de Bancos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {bankOptions.map((bank, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 + i * 0.05 }}>
                  <Card className="bg-secondary/30 border-border/50 h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <p className="text-sm font-bold text-foreground mb-1">{bank.name}</p>
                      <div className="flex-1">
                        <p className="text-2xl font-mono font-bold text-primary mb-1">{bank.rate}</p>
                        <p className="text-xs text-muted-foreground mb-2">Hasta {bank.maxFinancing} financiación</p>
                        <p className="text-xs text-muted-foreground">{bank.specialCondition}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Cuota estimada</p>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(monthlyMortgagePayment)}/mes</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Optimization Tips */}
      {optimizationTips.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.0 }}>
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-warning" /> Ideas para Optimizar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {optimizationTips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.05 + i * 0.06 }} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <Lightbulb className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                    <span className="inline-block mt-1 text-xs font-medium text-warning">{tip.potentialSaving}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Subsidies */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.2 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" /> Ayudas Públicas
              {isYoungBuyer && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-success/20 text-success font-medium">
                  <Shield className="h-3 w-3 inline mr-1" />Joven &lt;35
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {city.subsidies.map((subsidy, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.25 + i * 0.06 }} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-secondary-foreground">{subsidy}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
