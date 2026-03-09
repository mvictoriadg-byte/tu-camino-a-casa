import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/housing-data";
import { CheckCircle2, Circle, Target, TrendingUp, Sparkles, Euro } from "lucide-react";
import { toast } from "sonner";

interface MonthEntry {
  id?: string;
  month_number: number;
  month_label: string;
  completed: boolean;
  saved_amount: number;
}

interface SavingsProgressTrackerProps {
  userId: string;
  totalUpfront: number;
  monthlySavingsTarget: number;
  currentSavings: number;
}

const SavingsProgressTracker = ({ userId, totalUpfront, monthlySavingsTarget, currentSavings }: SavingsProgressTrackerProps) => {
  const [months, setMonths] = useState<MonthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [inputAmount, setInputAmount] = useState("");

  const totalMonthsNeeded = monthlySavingsTarget > 0 ? Math.ceil(Math.max(0, totalUpfront - currentSavings) / monthlySavingsTarget) : 12;
  const displayMonths = Math.min(Math.max(totalMonthsNeeded, 6), 36);

  const completedCount = months.filter(m => m.completed).length;
  const totalManualSaved = months.reduce((sum, m) => sum + (m.saved_amount || 0), 0);
  const totalSaved = currentSavings + totalManualSaved;
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
        saved_amount: Number(d.saved_amount) || 0,
      })));
    } else {
      const initial: MonthEntry[] = Array.from({ length: displayMonths }, (_, i) => ({
        month_number: i + 1,
        month_label: getMonthLabel(i),
        completed: false,
        saved_amount: 0,
      }));
      setMonths(initial);
    }
    setLoading(false);
  }, [userId, displayMonths]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const saveMonth = async (monthNumber: number, completed: boolean, savedAmount: number) => {
    const month = months.find(m => m.month_number === monthNumber);
    if (!month) return;

    // Optimistic update
    setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, completed, saved_amount: savedAmount } : m));

    if (completed) {
      toast.success("¡Buen trabajo! Tu progreso se ha actualizado. 🎉");
    }

    try {
      if (month.id) {
        await supabase.from("savings_progress").update({
          completed,
          saved_amount: savedAmount,
          updated_at: new Date().toISOString()
        }).eq("id", month.id);
      } else {
        const { data } = await supabase.from("savings_progress").insert({
          user_id: userId,
          month_number: monthNumber,
          month_label: month.month_label,
          completed,
          saved_amount: savedAmount,
          target_amount: monthlySavingsTarget,
          total_upfront: totalUpfront,
        }).select().single();
        if (data) {
          setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, id: data.id } : m));
        }
      }
    } catch {
      // Revert
      setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, completed: !completed, saved_amount: month.saved_amount } : m));
      toast.error("Error al guardar el progreso");
    }
  };

  const handleMonthClick = (monthNumber: number) => {
    const month = months.find(m => m.month_number === monthNumber);
    if (!month) return;

    if (month.completed) {
      // Toggle off
      saveMonth(monthNumber, false, 0);
      setEditingMonth(null);
    } else {
      // Open input
      setEditingMonth(monthNumber);
      setInputAmount(String(monthlySavingsTarget));
    }
  };

  const handleSaveAmount = (monthNumber: number) => {
    const amount = Number(inputAmount) || 0;
    if (amount <= 0) return;
    saveMonth(monthNumber, true, amount);
    setEditingMonth(null);
    setInputAmount("");
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

          {/* Monthly tracker */}
          <div>
            <p className="text-sm font-bold mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Registro mensual
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {months.slice(0, displayMonths).map((month, i) => (
                <div key={month.month_number}>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => handleMonthClick(month.month_number)}
                    className={`
                      w-full flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer
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
                    {month.completed && month.saved_amount > 0 && (
                      <span className="text-[9px] font-bold text-success">
                        {formatCurrency(month.saved_amount)}
                      </span>
                    )}
                  </motion.button>

                  {/* Inline input for saving amount */}
                  <AnimatePresence>
                    {editingMonth === month.month_number && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 overflow-hidden"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <Euro className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="€"
                              value={inputAmount}
                              onChange={e => setInputAmount(e.target.value)}
                              className="h-7 text-xs pl-6 rounded-lg"
                              autoFocus
                              onKeyDown={e => e.key === "Enter" && handleSaveAmount(month.month_number)}
                            />
                          </div>
                          <Button
                            size="sm"
                            className="h-6 text-[10px] rounded-lg"
                            onClick={() => handleSaveAmount(month.month_number)}
                          >
                            Guardar
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavingsProgressTracker;
