import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/housing-data";
import { CheckCircle2, Circle, Target, TrendingUp, Sparkles, PartyPopper } from "lucide-react";
import { toast } from "sonner";

interface MonthEntry {
  id?: string;
  month_number: number;
  month_label: string;
  completed: boolean;
}

interface SavingsProgressTrackerProps {
  userId: string;
  totalUpfront: number;
  monthlySavingsTarget: number;
  currentSavings: number;
}

const motivationalMessages = [
  "¡Buen trabajo! Estás un paso más cerca de tu casa. 🏠",
  "¡Sigue así! La constancia es la clave del éxito. 💪",
  "¡Genial! Cada euro cuenta para tu futuro hogar. ✨",
  "¡Increíble disciplina! Tu casa te espera. 🎯",
  "¡Otro mes cumplido! Estás construyendo tu sueño. 🌟",
];

const SavingsProgressTracker = ({ userId, totalUpfront, monthlySavingsTarget, currentSavings }: SavingsProgressTrackerProps) => {
  const [months, setMonths] = useState<MonthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMotivation, setShowMotivation] = useState<string | null>(null);

  const totalMonthsNeeded = monthlySavingsTarget > 0 ? Math.ceil(Math.max(0, totalUpfront - currentSavings) / monthlySavingsTarget) : 12;
  const displayMonths = Math.min(Math.max(totalMonthsNeeded, 6), 36);

  const completedCount = months.filter(m => m.completed).length;
  const totalSaved = currentSavings + completedCount * monthlySavingsTarget;
  const remaining = Math.max(0, totalUpfront - totalSaved);
  const progressPercent = totalUpfront > 0 ? Math.min(100, Math.round((totalSaved / totalUpfront) * 100)) : 100;
  const estimatedMonthsLeft = monthlySavingsTarget > 0 ? Math.ceil(remaining / monthlySavingsTarget) : 0;

  const getMonthLabel = (index: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + index);
    return d.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  };

  const loadProgress = useCallback(async () => {
    const { data } = await supabase
      .from("savings_progress")
      .select("*")
      .eq("user_id", userId)
      .order("month_number", { ascending: true });

    if (data && data.length > 0) {
      setMonths(data.map(d => ({
        id: d.id,
        month_number: d.month_number,
        month_label: d.month_label,
        completed: d.completed,
      })));
    } else {
      // Initialize months
      const initial: MonthEntry[] = Array.from({ length: displayMonths }, (_, i) => ({
        month_number: i + 1,
        month_label: getMonthLabel(i),
        completed: false,
      }));
      setMonths(initial);
    }
    setLoading(false);
  }, [userId, displayMonths]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const toggleMonth = async (monthNumber: number) => {
    const month = months.find(m => m.month_number === monthNumber);
    if (!month) return;

    const newCompleted = !month.completed;

    // Optimistic update
    setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, completed: newCompleted } : m));

    if (newCompleted) {
      const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setShowMotivation(msg);
      setTimeout(() => setShowMotivation(null), 3000);
    }

    try {
      if (month.id) {
        await supabase.from("savings_progress").update({ completed: newCompleted, updated_at: new Date().toISOString() }).eq("id", month.id);
      } else {
        const { data } = await supabase.from("savings_progress").insert({
          user_id: userId,
          month_number: monthNumber,
          month_label: month.month_label,
          completed: newCompleted,
          target_amount: monthlySavingsTarget,
          total_upfront: totalUpfront,
        }).select().single();
        if (data) {
          setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, id: data.id } : m));
        }
      }
    } catch {
      // Revert
      setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, completed: !newCompleted } : m));
      toast.error("Error al guardar el progreso");
    }
  };

  if (loading) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Card className="glow-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Tu progreso hacia la entrada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground font-semibold">Meta entrada</p>
              <p className="text-base font-extrabold">{formatCurrency(totalUpfront)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground font-semibold">Ahorro mensual</p>
              <p className="text-base font-extrabold">{formatCurrency(monthlySavingsTarget)}<span className="text-xs font-normal text-muted-foreground">/mes</span></p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <p className="text-xs text-muted-foreground font-semibold">Total ahorrado</p>
              <p className="text-base font-extrabold text-primary">{formatCurrency(totalSaved)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground font-semibold">Restante</p>
              <p className="text-base font-extrabold">{formatCurrency(remaining)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">{formatCurrency(totalSaved)} de {formatCurrency(totalUpfront)}</span>
              <span className="text-sm font-extrabold text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            {estimatedMonthsLeft > 0 && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                ~{estimatedMonthsLeft} meses restantes al ritmo actual
              </p>
            )}
          </div>

          {/* Motivational message */}
          <AnimatePresence>
            {showMotivation && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20"
              >
                <PartyPopper className="h-5 w-5 text-success shrink-0" />
                <p className="text-sm font-bold text-success">{showMotivation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Monthly tracker */}
          <div>
            <p className="text-sm font-bold mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Registro mensual
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {months.slice(0, displayMonths).map((month, i) => (
                <motion.button
                  key={month.month_number}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => toggleMonth(month.month_number)}
                  className={`
                    flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer
                    ${month.completed
                      ? "bg-success/10 border-success/30 hover:bg-success/20"
                      : "bg-muted/30 border-border hover:bg-muted/60"
                    }
                  `}
                >
                  {month.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40" />
                  )}
                  <span className="text-[10px] font-semibold text-muted-foreground capitalize leading-tight">
                    {month.month_label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavingsProgressTracker;
