import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { type AffordabilityResult, formatCurrency } from "@/lib/housing-data";
import {
  Home,
  TrendingUp,
  Clock,
  CheckCircle2,
  Landmark,
  Euro,
  Target,
  Receipt,
  Wrench,
  Sparkles,
  ArrowRight,
  Building,
  Lightbulb,
  Flag,
  Trophy,
  Shield,
  Users,
  Timer,
} from "lucide-react";

interface DashboardProps {
  result: AffordabilityResult;
}

const propertyTypeLabels: Record<string, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  "obra-nueva": "Obra nueva",
  "segunda-mano": "Segunda mano",
};

const zoneLabels: Record<string, string> = {
  centro: "Centro",
  metropolitana: "Área metropolitana",
  periferia: "Periferia",
};

const Dashboard = ({ result }: DashboardProps) => {
  const {
    city,
    preferences,
    estimatedPrice,
    totalUpfront,
    requiredDownPayment,
    taxesAndFees,
    reformCostEstimate,
    savingsGap,
    yearsToSave,
    monthsToSave,
    maxHomePrice,
    canAfford,
    monthlyMortgagePayment,
    savingsProgress,
    actionPlan,
    bankOptions,
    optimizationTips,
    milestones,
    isYoungBuyer,
    debtToIncomeRatio,
    totalMonthlyIncome,
    totalSavings,
    totalMonthlySavings,
    totalMonthlyDebts,
    numBuyers,
    userProfile,
  } = result;

  const propertyDesc = `${propertyTypeLabels[preferences.propertyType] || preferences.propertyType} · ${preferences.size} m² · ${preferences.rooms} hab · ${zoneLabels[preferences.zone] || preferences.zone}`;

  const displayYears = yearsToSave === 0 ? "¡Ya!" : yearsToSave === Infinity ? "—" : `~${yearsToSave} años`;
  const displayMonths = monthsToSave <= 0 ? "" : monthsToSave === -1 ? "" : `${monthsToSave} meses`;

  return (
    <div className="space-y-6">
      {/* HERO: Time to Buy — Most prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`glow-card border-2 ${canAfford ? "border-success" : "border-primary"}`}>
          <CardContent className="p-8 text-center">
            <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4 ${canAfford ? "bg-success/20" : "bg-primary/20"}`}>
              {canAfford ? <Trophy className="h-8 w-8 text-success" /> : <Timer className="h-8 w-8 text-primary" />}
            </div>
            <p className="text-sm uppercase tracking-widest font-medium text-muted-foreground mb-2">
              {canAfford ? "¡Puedes comprar ya!" : "Tiempo estimado hasta tu casa"}
            </p>
            <div className={`text-5xl sm:text-6xl font-bold mb-2 ${canAfford ? "text-success" : "text-primary"}`}>
              {displayYears}
            </div>
            {!canAfford && displayMonths && (
              <p className="text-lg text-muted-foreground font-mono">{displayMonths}</p>
            )}
            <p className="text-sm text-muted-foreground mt-3">{propertyDesc} en {city.name}</p>
            {!canAfford && savingsGap > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Te faltan <span className="font-semibold text-primary">{formatCurrency(savingsGap)}</span> — ahorrando <span className="font-semibold text-primary">{formatCurrency(totalMonthlySavings)}/mes</span>
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="glow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" /> Progreso hacia tu meta
              </span>
              <span className="stat-value text-xl text-primary">{savingsProgress}%</span>
            </div>
            <div className="progress-bar mt-2">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(savingsProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Ahorros: {formatCurrency(totalSavings)}</span>
              <span>Meta: {formatCurrency(totalUpfront)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Co-buyers summary */}
      {numBuyers > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="glow-card border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">Comprando entre {numBuyers} personas</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Ingresos totales</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(totalMonthlyIncome)}<span className="text-xs font-normal text-muted-foreground">/mes</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Ahorros totales</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(totalSavings)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Ahorro mensual</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(totalMonthlySavings)}<span className="text-xs font-normal text-muted-foreground">/mes</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Deudas totales</p>
                  <p className="text-lg font-bold text-muted-foreground">{formatCurrency(totalMonthlyDebts)}<span className="text-xs font-normal">/mes</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Key Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Precio estimado vivienda"
          value={formatCurrency(estimatedPrice)}
          icon={Home}
          subtitle={`${city.avgPricePerSqm} €/m² en ${city.name}`}
          delay={0.2}
        />
        <StatCard
          label="Tu capacidad de compra"
          value={formatCurrency(maxHomePrice)}
          icon={TrendingUp}
          subtitle="Máximo que puedes permitirte"
          variant={canAfford ? "success" : "warning"}
          delay={0.25}
        />
        <StatCard
          label="Entrada necesaria (20%)"
          value={formatCurrency(requiredDownPayment)}
          icon={Target}
          subtitle="Aportación inicial para la hipoteca"
          delay={0.3}
        />
        <StatCard
          label="Impuestos y gastos (~10%)"
          value={formatCurrency(taxesAndFees)}
          icon={Receipt}
          subtitle="ITP/IVA, notaría, registro, gestoría"
          delay={0.35}
        />
        {reformCostEstimate > 0 && (
          <StatCard
            label="Coste de reforma"
            value={formatCurrency(reformCostEstimate)}
            icon={Wrench}
            subtitle="Estimación según estado vivienda"
            variant="warning"
            delay={0.38}
          />
        )}
        <StatCard
          label="Cuota hipotecaria estimada"
          value={`${formatCurrency(monthlyMortgagePayment)}/mes`}
          icon={Euro}
          subtitle={`A 30 años al ${city.mortgageRate}% · Endeudamiento: ${debtToIncomeRatio}%`}
          variant={debtToIncomeRatio <= 35 ? "success" : "destructive"}
          delay={0.4}
        />
        <StatCard
          label="Tiempo estimado"
          value={displayYears}
          icon={Clock}
          subtitle={yearsToSave === 0 ? "Ya tienes los ahorros necesarios" : "A tu ritmo de ahorro actual"}
          variant={yearsToSave <= 2 ? "success" : yearsToSave <= 5 ? "warning" : "default"}
          delay={0.45}
        />
      </div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              Tu Roadmap de Ahorro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.08 }}
                    className="flex items-center gap-4 pl-0"
                  >
                    <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.reached ? "bg-success/20" : "bg-muted"}`}>
                      {m.reached
                        ? <CheckCircle2 className="h-4 w-4 text-success" />
                        : <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                      }
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Tu Plan de Acción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionPlan.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + i * 0.1 }}
                className="flex gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <span className="text-2xl shrink-0">{step.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {step.impact && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary">
                      <ArrowRight className="h-3 w-3" /> {step.impact}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Bank Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Comparativa de Bancos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bankOptions.map((bank, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.06 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{bank.name}</p>
                    <p className="text-xs text-muted-foreground">{bank.specialCondition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold text-primary">{bank.rate}</p>
                    <p className="text-xs text-muted-foreground">Hasta {bank.maxFinancing}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Optimization Tips */}
      {optimizationTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                Ideas para Optimizar tu Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {optimizationTips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.15 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                >
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.3 }}
      >
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Ayudas Públicas Disponibles
              {isYoungBuyer && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-success/20 text-success font-medium">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Joven &lt;35: más ventajas
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {city.subsidies.map((subsidy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.35 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
              >
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