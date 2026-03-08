import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { type AffordabilityResult } from "@/lib/housing-data";
import {
  Home,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Landmark,
  DollarSign,
  Target,
  Receipt,
  Wrench,
} from "lucide-react";

interface DashboardProps {
  result: AffordabilityResult;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

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
    maxHomePrice,
    affordabilityRatio,
    canAfford,
    monthlyMortgagePayment,
  } = result;

  const propertyDesc = `${propertyTypeLabels[preferences.propertyType] || preferences.propertyType} · ${preferences.size} m² · ${preferences.rooms} hab · ${zoneLabels[preferences.zone] || preferences.zone}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className={`h-3 w-3 rounded-full ${canAfford ? "bg-success" : "bg-warning"}`} />
          <h2 className="text-2xl font-bold">
            {canAfford ? "¡Puedes comprar!" : "Aún no estás listo"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">{propertyDesc} en {city.name}</p>
      </motion.div>

      {/* Affordability Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="glow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                Puntuación de viabilidad — {city.name}
              </span>
              <span className="stat-value text-xl text-primary">{affordabilityRatio}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(affordabilityRatio, 100)}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tu capacidad de compra vs precio estimado en {city.name}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Precio estimado"
          value={formatCurrency(estimatedPrice)}
          icon={Home}
          subtitle={`${city.avgPricePerSqm} €/m² en ${city.name}`}
          delay={0.2}
        />
        <StatCard
          label="Tu poder de compra"
          value={formatCurrency(maxHomePrice)}
          icon={TrendingUp}
          subtitle="Precio máximo que puedes permitirte"
          variant={canAfford ? "success" : "warning"}
          delay={0.3}
        />
        <StatCard
          label="Entrada necesaria (20%)"
          value={formatCurrency(requiredDownPayment)}
          icon={Target}
          subtitle="Aportación inicial para la hipoteca"
          delay={0.4}
        />
        <StatCard
          label="Impuestos y gastos (~10%)"
          value={formatCurrency(taxesAndFees)}
          icon={Receipt}
          subtitle="ITP/IVA, notaría, registro, gestoría"
          delay={0.45}
        />
        {reformCostEstimate > 0 && (
          <StatCard
            label="Coste de reforma"
            value={formatCurrency(reformCostEstimate)}
            icon={Wrench}
            subtitle="Estimación según estado de la vivienda"
            variant="warning"
            delay={0.5}
          />
        )}
        <StatCard
          label="Total inicial necesario"
          value={formatCurrency(totalUpfront)}
          icon={DollarSign}
          subtitle="Entrada + impuestos + reforma"
          delay={0.55}
        />
        <StatCard
          label="Brecha de ahorro"
          value={savingsGap > 0 ? formatCurrency(savingsGap) : "0 €"}
          icon={savingsGap > 0 ? AlertTriangle : CheckCircle2}
          subtitle={savingsGap > 0 ? "Te falta para la entrada" : "¡Tienes suficiente ahorrado!"}
          variant={savingsGap > 0 ? "destructive" : "success"}
          delay={0.6}
        />
        <StatCard
          label="Tiempo para ahorrar"
          value={
            yearsToSave === 0
              ? "¡Listo!"
              : yearsToSave === Infinity
              ? "N/A"
              : `${yearsToSave} años`
          }
          icon={Clock}
          subtitle={yearsToSave === 0 ? "Ya tienes suficiente" : "A tu ritmo de ahorro actual"}
          variant={yearsToSave <= 2 ? "success" : yearsToSave <= 5 ? "warning" : "destructive"}
          delay={0.65}
        />
        <StatCard
          label="Cuota hipotecaria"
          value={formatCurrency(monthlyMortgagePayment)}
          icon={DollarSign}
          subtitle={`A 30 años al ${city.mortgageRate}% TAE`}
          variant={monthlyMortgagePayment <= result.monthlyIncome * 0.35 ? "success" : "destructive"}
          delay={0.7}
        />
      </div>

      {/* Subsidies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Ayudas y Programas Públicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {city.subsidies.map((subsidy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
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
