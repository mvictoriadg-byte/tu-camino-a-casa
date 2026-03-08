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
} from "lucide-react";

interface DashboardProps {
  result: AffordabilityResult;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Dashboard = ({ result }: DashboardProps) => {
  const {
    city,
    avgHomePrice,
    requiredDownPayment,
    savingsGap,
    yearsToSave,
    maxHomePrice,
    affordabilityRatio,
    canAfford,
  } = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div
          className={`h-3 w-3 rounded-full ${canAfford ? "bg-success" : "bg-warning"}`}
        />
        <h2 className="text-2xl font-bold">
          {canAfford ? "You can afford a home!" : "Not quite there yet"}
        </h2>
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
                Affordability Score — {city.name}
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
              Your buying power vs average home price in {city.name}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Avg Home Price"
          value={formatCurrency(avgHomePrice)}
          icon={Home}
          subtitle={`Average in ${city.name}`}
          delay={0.2}
        />
        <StatCard
          label="Your Buying Power"
          value={formatCurrency(maxHomePrice)}
          icon={TrendingUp}
          subtitle="Max home you can afford"
          variant={canAfford ? "success" : "warning"}
          delay={0.3}
        />
        <StatCard
          label="Down Payment Needed"
          value={formatCurrency(requiredDownPayment)}
          icon={Target}
          subtitle={`${city.downPaymentPercent}% of home price`}
          delay={0.4}
        />
        <StatCard
          label="Savings Gap"
          value={savingsGap > 0 ? formatCurrency(savingsGap) : "$0"}
          icon={savingsGap > 0 ? AlertTriangle : CheckCircle2}
          subtitle={savingsGap > 0 ? "Still needed for down payment" : "You have enough saved!"}
          variant={savingsGap > 0 ? "destructive" : "success"}
          delay={0.5}
        />
        <StatCard
          label="Time to Save"
          value={
            yearsToSave === 0
              ? "Ready!"
              : yearsToSave === Infinity
              ? "N/A"
              : `${yearsToSave} yrs`
          }
          icon={Clock}
          subtitle={yearsToSave === 0 ? "You already have enough" : "At your current savings rate"}
          variant={yearsToSave <= 2 ? "success" : yearsToSave <= 5 ? "warning" : "destructive"}
          delay={0.6}
        />
        <StatCard
          label="Monthly Mortgage"
          value={formatCurrency(result.monthlyIncome * 0.28)}
          icon={DollarSign}
          subtitle="Max recommended (28% of income)"
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
              Government Programs & Subsidies
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
