import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/housing-data";
import { CheckCircle2, Target, TrendingUp, Sparkles, Euro, Save } from "lucide-react";
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

const MILESTONES = [
  { threshold: 0, count: 1, message: "🎉 ¡Primer mes registrado! Has dado el primer paso." },
  { threshold: 0, count: 3, message: "🔥 ¡3 meses ahorrando! La constancia es clave." },
  { threshold: 10, count: 0, message: "🏆 ¡Has alcanzado el 10% de tu entrada!" },
  { threshold: 25, count: 0, message: "🚀 ¡25% completado! Un cuarto del camino recorrido." },
  { threshold: 50, count: 0, message: "⭐ ¡Mitad del camino! El 50% de tu entrada está ahorrado." },
  { threshold: 75, count: 0, message: "🏠 ¡75%! Tu casa está muy cerca." },
];

const SavingsProgressTracker = ({ userId, totalUpfront, monthlySavingsTarget, currentSavings }: SavingsProgressTrackerProps) => {
  const [months, setMonths] = useState<MonthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [triggeredMilestones, setTriggeredMilestones] = useState<Set<string>>(new Set());

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

  const checkMilestones = useCallback((newProgressPercent: number, newCompletedCount: number) => {
    for (const m of MILESTONES) {
      const key = m.count > 0 ? `count-${m.count}` : `pct-${m.threshold}`;
      if (triggeredMilestones.has(key)) continue;
      if (m.count > 0 && newCompletedCount >= m.count) {
        toast.success(m.message, { duration: 4000 });
        setTriggeredMilestones(prev => new Set(prev).add(key));
        break;
      }
      if (m.threshold > 0 && newProgressPercent >= m.threshold) {
        toast.success(m.message, { duration: 4000 });
        setTriggeredMilestones(prev => new Set(prev).add(key));
        break;
      }
    }
  }, [triggeredMilestones]);

  const loadProgress = useCallback(async () => {
    const { data } = await supabase
      .from("savings_progress")
      .select("*")
      .eq("user_id", userId)
      .order("month_number", { ascending: true });

    if (data && data.length > 0) {
      const loaded = data.map(d => ({
        id: d.id,
        month_number: d.month_number,
        month_label: d.month_label,
        completed: d.completed,
        saved_amount: Number(d.saved_amount) || 0,
      }));
      setMonths(loaded);
      // Pre-fill input values for completed months
      const vals: Record<number, string> = {};
      loaded.forEach(m => {
        if (m.completed && m.saved_amount > 0) vals[m.month_number] = String(m.saved_amount);
      });
      setInputValues(vals);
      // Track already-achieved milestones
      const alreadyCompleted = loaded.filter(m => m.completed).length;
      const alreadySaved = currentSavings + loaded.reduce((s, m) => s + (m.saved_amount || 0), 0);
      const alreadyPct = totalUpfront > 0 ? Math.round((alreadySaved / totalUpfront) * 100) : 0;
      const existing = new Set<string>();
      for (const ml of MILESTONES) {
        if (ml.count > 0 && alreadyCompleted >= ml.count) existing.add(`count-${ml.count}`);
        if (ml.threshold > 0 && alreadyPct >= ml.threshold) existing.add(`pct-${ml.threshold}`);
      }
      setTriggeredMilestones(existing);
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
  }, [userId, displayMonths, currentSavings, totalUpfront]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const saveMonth = async (monthNumber: number, savedAmount: number) => {
    const month = months.find(m => m.month_number === monthNumber);
    if (!month || savedAmount <= 0) return;

    const completed = true;
    // Optimistic update
    setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, completed, saved_amount: savedAmount } : m));

    toast.success("¡Buen trabajo! Tu progreso se ha actualizado. 🎉");

    // Check milestones
    const newCompleted = months.filter(m => m.month_number !== monthNumber && m.completed).length + 1;
    const newManualSaved = months.reduce((s, m) => s + (m.month_number === monthNumber ? savedAmount : (m.saved_amount || 0)), 0);
    const newPct = totalUpfront > 0 ? Math.round(((currentSavings + newManualSaved) / totalUpfront) * 100) : 0;
    checkMilestones(newPct, newCompleted);

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
      setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, completed: false, saved_amount: 0 } : m));
      toast.error("Error al guardar el progreso");
    }
  };

  const handleSaveClick = (monthNumber: number) => {
    const amount = Number(inputValues[monthNumber]) || 0;
    if (amount <= 0) {
      toast.error("Introduce una cantidad válida");
      return;
    }
    saveMonth(monthNumber, amount);
  };

  const handleClearMonth = async (monthNumber: number) => {
    const month = months.find(m => m.month_number === monthNumber);
    if (!month || !month.completed) return;
    setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, completed: false, saved_amount: 0 } : m));
    setInputValues(prev => { const n = { ...prev }; delete n[monthNumber]; return n; });
    if (month.id) {
      await supabase.from("savings_progress").update({ completed: false, saved_amount: 0 }).eq("id", month.id);
    }
    toast.success("Mes reiniciado");
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

          {/* Monthly tracker - always show input */}
          <div>
            <p className="text-sm font-bold mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Registro mensual
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {months.slice(0, displayMonths).map((month, i) => (
                <motion.div
                  key={month.month_number}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.015 }}
                  className={`rounded-xl border p-3 transition-all duration-200 ${
                    month.completed
                      ? "bg-success/5 border-success/30"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground capitalize">
                      {month.month_label}
                    </span>
                    {month.completed && (
                      <button onClick={() => handleClearMonth(month.month_number)} title="Reiniciar mes">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <Euro className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder={String(monthlySavingsTarget)}
                        value={inputValues[month.month_number] || ""}
                        onChange={e => setInputValues(prev => ({ ...prev, [month.month_number]: e.target.value }))}
                        className="h-8 text-xs pl-6 rounded-lg"
                        disabled={month.completed}
                        onKeyDown={e => e.key === "Enter" && !month.completed && handleSaveClick(month.month_number)}
                      />
                    </div>
                    {!month.completed && (
                      <button
                        onClick={() => handleSaveClick(month.month_number)}
                        className="h-8 w-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors"
                        title="Guardar"
                      >
                        <Save className="h-3.5 w-3.5 text-primary" />
                      </button>
                    )}
                  </div>
                  {month.completed && month.saved_amount > 0 && (
                    <p className="text-[10px] font-bold text-success mt-1.5">
                      ✅ {formatCurrency(month.saved_amount)}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavingsProgressTracker;
