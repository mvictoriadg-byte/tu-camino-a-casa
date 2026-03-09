import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/housing-data";
import { Timer, Sparkles, TrendingUp, BarChart3 } from "lucide-react";

interface ScenarioComparisonProps {
  currentYears: number;
  currentMonths: number;
  aidsYears: number | null;
  aidsMonths: number | null;
  extraSavingsYears: number;
  extraSavingsMonths: number;
  totalUpfront: number;
  totalSavings: number;
  monthlySavings: number;
}

const formatTime = (years: number | null, months: number | null) => {
  if (years === null || months === null) return "—";
  if (years === 0 && months <= 0) return "¡Ya!";
  if (years === Infinity) return "—";
  if (years > 0) return `~${years} años`;
  return `${months} meses`;
};

const ScenarioComparison = ({
  currentYears, currentMonths,
  aidsYears, aidsMonths,
  extraSavingsYears, extraSavingsMonths,
  totalUpfront, totalSavings, monthlySavings,
}: ScenarioComparisonProps) => {
  const scenarios = [
    {
      title: "Escenario actual",
      icon: Timer,
      time: formatTime(currentYears, currentMonths),
      description: "Con tus datos actuales",
      color: "text-foreground",
      bgColor: "bg-muted/50",
      borderColor: "border-border",
    },
    {
      title: "Con ayudas públicas",
      icon: Sparkles,
      time: formatTime(aidsYears, aidsMonths),
      description: "Incluyendo ayudas elegibles",
      color: "text-success",
      bgColor: "bg-success/5",
      borderColor: "border-success/30",
    },
    {
      title: "Ahorrando +200€/mes",
      icon: TrendingUp,
      time: formatTime(extraSavingsYears, extraSavingsMonths),
      description: `${formatCurrency(monthlySavings + 200)}/mes total`,
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/30",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
      <Card className="glow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Comparación de escenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scenarios.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className={`rounded-xl ${s.bgColor} border ${s.borderColor} p-4 text-center`}
                >
                  <div className={`h-10 w-10 rounded-xl ${s.bgColor} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{s.title}</p>
                  <p className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.time}</p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScenarioComparison;
