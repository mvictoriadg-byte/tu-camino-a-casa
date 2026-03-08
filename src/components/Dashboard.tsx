import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { type AffordabilityResult, formatCurrency } from "@/lib/housing-data";
import {
  Home, TrendingUp, CheckCircle2, Landmark, Euro, Target,
  Wrench, Sparkles, ArrowRight, Building, Lightbulb, Flag, Trophy, Shield,
  Users, Timer,
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

  return (
    <div className="space-y-5">
      {/* HERO: Time to Buy */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className={`glow-card overflow-hidden ${canAfford ? "border-success border-2" : "border-2 border-primary"}`}>
          <CardContent className="p-0">
            <div className={`px-6 py-5 ${canAfford ? "bg-success/10" : "bg-primary/10"}`}>
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center h-14 w-14 rounded-2xl shrink-0 ${canAfford ? "bg-success/20" : "bg-primary/30"}`}>
                  {canAfford ? <Trophy className="h-7 w-7 text-success" /> : <Timer className="h-7 w-7 text-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-0.5">
                    {canAfford ? "¡Puedes comprar ya!" : "Tiempo estimado"}
                  </p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${canAfford ? "text-success" : "text-foreground"}`}>
                      {displayYears}
                    </span>
                    {!canAfford && displayMonths && (
                      <span className="text-base text-muted-foreground font-mono">({displayMonths})</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{propertyDesc} en {city.name}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progreso</p>
                  <p className="text-3xl font-extrabold text-foreground font-mono">{savingsProgress}%</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-border">
              <div className="progress-bar">
                <motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${Math.min(savingsProgress, 100)}%` }} transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                <span>Ahorros: {formatCurrency(totalSavings)}</span>
                {!canAfford && savingsGap > 0 && (
                  <span>Faltan: <span className="font-bold text-foreground">{formatCurrency(savingsGap)}</span></span>
                )}
                <span>Meta: {formatCurrency(totalUpfront)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Co-buyers */}
      {numBuyers > 1 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="glow-card border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-foreground" />
                <span className="text-sm font-bold">Comprando entre {numBuyers} personas</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><p className="text-xs text-muted-foreground font-semibold">Ingresos</p><p className="text-base font-extrabold">{formatCurrency(totalMonthlyIncome)}<span className="text-xs font-normal text-muted-foreground">/mes</span></p></div>
                <div><p className="text-xs text-muted-foreground font-semibold">Ahorros</p><p className="text-base font-extrabold">{formatCurrency(totalSavings)}</p></div>
                <div><p className="text-xs text-muted-foreground font-semibold">Ahorro mensual</p><p className="text-base font-extrabold">{formatCurrency(totalMonthlySavings)}<span className="text-xs font-normal text-muted-foreground">/mes</span></p></div>
                <div><p className="text-xs text-muted-foreground font-semibold">Deudas</p><p className="text-base font-extrabold text-muted-foreground">{formatCurrency(totalMonthlyDebts)}<span className="text-xs font-normal">/mes</span></p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* PRIMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Precio estimado vivienda" value={formatCurrency(estimatedPrice)} icon={Home}
          subtitle={`${formatCurrency(pricePerSqm)}/m² · ${sqm} m²`} delay={0.15} size="large" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="glow-card h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Coste total para comprar</span>
                <Target className="h-4 w-4 text-foreground" />
              </div>
              <div className="stat-value text-foreground mb-3">{formatCurrency(totalUpfront)}</div>
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Entrada ({100 - mortgagePercent}%)</span><span className="font-bold">{formatCurrency(requiredDownPayment)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Impuestos (~10%)</span><span className="font-bold">{formatCurrency(taxesAndFees)}</span></div>
                {reformCostEstimate > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Reforma</span><span className="font-bold text-warning">{formatCurrency(reformCostEstimate)}</span></div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SECONDARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Capacidad de compra" value={formatCurrency(maxHomePrice)} icon={TrendingUp}
          subtitle="Máximo hipotecable" variant={canAfford ? "success" : "warning"} delay={0.25} />
        {reformCostEstimate > 0 && (
          <StatCard label="Reforma estimada" value={formatCurrency(reformCostEstimate)} icon={Wrench}
            subtitle="Según estado vivienda" variant="warning" delay={0.3} />
        )}
        <StatCard label="Cuota hipotecaria" value={`${formatCurrency(monthlyMortgagePayment)}/mes`} icon={Euro}
          subtitle={`30 años · ${city.mortgageRate}% · DTI: ${debtToIncomeRatio}%`}
          variant={debtToIncomeRatio <= 35 ? "success" : "destructive"} delay={0.35} />
      </div>

      {/* Milestones */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3"><CardTitle className="text-lg font-bold flex items-center gap-2"><Flag className="h-5 w-5 text-primary" /> Roadmap de Ahorro</CardTitle></CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.06 }} className="flex items-center gap-4">
                    <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.reached ? "bg-success/20" : "bg-muted"}`}>
                      {m.reached ? <CheckCircle2 className="h-4 w-4 text-success" /> : <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`text-sm font-bold ${m.reached ? "text-success" : "text-foreground"}`}>{m.label}</span>
                      <span className={`text-xs font-mono font-bold ${m.reached ? "text-success" : "text-muted-foreground"}`}>{m.date}</span>
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
          <CardHeader className="pb-3"><CardTitle className="text-lg font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Plan de Acción</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {actionPlan.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.08 }}
                className="flex gap-3 p-4 rounded-xl bg-muted/60">
                <span className="text-2xl shrink-0">{step.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {step.impact && <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-success"><ArrowRight className="h-3 w-3" /> {step.impact}</span>}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Banks — Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3"><CardTitle className="text-lg font-bold flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Comparativa de Bancos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {bankOptions.map((bank, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 + i * 0.05 }}>
                  <div className="rounded-xl bg-muted/50 border border-border p-4 h-full flex flex-col">
                    <p className="text-sm font-extrabold mb-2">{bank.name}</p>
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

      {/* Tips */}
      {optimizationTips.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.0 }}>
          <Card className="glow-card">
            <CardHeader className="pb-3"><CardTitle className="text-lg font-bold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-warning" /> Ideas para Optimizar</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {optimizationTips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.05 + i * 0.06 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
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

      {/* Subsidies */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.2 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" /> Ayudas Públicas
              {isYoungBuyer && (
                <span className="ml-2 text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-bold">
                  <Shield className="h-3 w-3 inline mr-1" />Joven &lt;35
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {city.subsidies.map((subsidy, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.25 + i * 0.06 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted/60">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">{subsidy}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;