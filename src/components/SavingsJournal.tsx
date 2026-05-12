import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/housing-data";
import {
  Target, TrendingDown, Plus, CheckCircle2, Pencil, X,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid,
} from "recharts";

interface MonthEntry {
  id?: string;
  month_number: number;
  month_label: string;
  completed: boolean;
  saved_amount: number;
}

interface SavingsJournalProps {
  userId: string;
  totalUpfront: number;
  monthlySavingsTarget: number;
  currentSavings: number;
  yearsToSave: number;
  monthsToSave: number;
}

const MILESTONES = [
  { threshold: 0, count: 1, message: "🎉 ¡Primer mes registrado! Has dado el primer paso." },
  { threshold: 0, count: 3, message: "🔥 ¡3 meses seguidos! La constancia es clave." },
  { threshold: 10, count: 0, message: "🏆 ¡10% de la entrada conseguido!" },
  { threshold: 25, count: 0, message: "🚀 ¡Un cuarto del camino recorrido!" },
  { threshold: 50, count: 0, message: "⭐ ¡Mitad del camino! El 50% está ahorrado." },
  { threshold: 75, count: 0, message: "🏠 ¡75%! Tu casa está muy cerca." },
];

const formatYearsShort = (months: number) => {
  if (months <= 0) return "¡Ya puedes comprar!";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}m`;
  if (m === 0) return `~${y}a`;
  return `~${y}a ${m}m`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-muted-foreground mb-1">{label}</p>
      <p className="font-extrabold text-primary">{formatYearsShort(payload[0].value)} restantes</p>
      {payload[1] && (
        <p className="text-success font-bold">{formatCurrency(payload[1].value)} ahorrado</p>
      )}
    </div>
  );
};

const SavingsJournal = ({
  userId, totalUpfront, monthlySavingsTarget, currentSavings,
  yearsToSave, monthsToSave,
}: SavingsJournalProps) => {
  const [months, setMonths] = useState<MonthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [triggeredMilestones, setTriggeredMilestones] = useState<Set<string>>(new Set());

  const totalManualSaved = months.reduce((s, m) => s + (m.saved_amount || 0), 0);
  const totalSaved = currentSavings + totalManualSaved;
  const remaining = Math.max(0, totalUpfront - totalSaved);
  const progressPercent = totalUpfront > 0 ? Math.min(100, Math.round((totalSaved / totalUpfront) * 100)) : 100;
  const estimatedMonthsLeft = monthlySavingsTarget > 0 ? Math.ceil(remaining / monthlySavingsTarget) : 0;
  const originalMonthsToSave = monthsToSave === -1 ? 0 : monthsToSave;
  const monthsSaved = Math.max(0, originalMonthsToSave - estimatedMonthsLeft);

  const getMonthLabel = () => {
    const d = new Date();
    return d.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  };

  const checkMilestones = useCallback((pct: number, count: number) => {
    for (const m of MILESTONES) {
      const key = m.count > 0 ? `count-${m.count}` : `pct-${m.threshold}`;
      if (triggeredMilestones.has(key)) continue;
      if (m.count > 0 && count >= m.count) {
        toast.success(m.message, { duration: 4000 });
        setTriggeredMilestones(prev => new Set(prev).add(key));
        break;
      }
      if (m.threshold > 0 && pct >= m.threshold) {
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
      .order("month_number", { ascending: false });

    if (data && data.length > 0) {
      const loaded = data.map(d => ({
        id: d.id,
        month_number: d.month_number,
        month_label: d.month_label,
        completed: d.completed,
        saved_amount: Number(d.saved_amount) || 0,
      }));
      setMonths(loaded);
      const alreadyCompleted = loaded.filter(m => m.completed).length;
      const alreadySaved = currentSavings + loaded.reduce((s, m) => s + (m.saved_amount || 0), 0);
      const alreadyPct = totalUpfront > 0 ? Math.round((alreadySaved / totalUpfront) * 100) : 0;
      const existing = new Set<string>();
      for (const ml of MILESTONES) {
        if (ml.count > 0 && alreadyCompleted >= ml.count) existing.add(`count-${ml.count}`);
        if (ml.threshold > 0 && alreadyPct >= ml.threshold) existing.add(`pct-${ml.threshold}`);
      }
      setTriggeredMilestones(existing);
    }
    setLoading(false);
  }, [userId, currentSavings, totalUpfront]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const handleAddMonth = async () => {
    const amount = Number(inputValue.replace(",", "."));
    if (!amount || amount <= 0) { toast.error("Introduce una cantidad válida"); return; }

    const nextNum = months.length > 0 ? Math.max(...months.map(m => m.month_number)) + 1 : 1;
    const label = getMonthLabel();

    const newEntry: MonthEntry = {
      month_number: nextNum,
      month_label: label,
      completed: true,
      saved_amount: amount,
    };

    setMonths(prev => [newEntry, ...prev]);
    setInputValue("");

    const newManual = totalManualSaved + amount;
    const newTotal = currentSavings + newManual;
    const newPct = totalUpfront > 0 ? Math.round((newTotal / totalUpfront) * 100) : 0;
    const newCount = months.filter(m => m.completed).length + 1;
    checkMilestones(newPct, newCount);
    toast.success("¡Buen trabajo! Mes registrado 🎉");

    try {
      const { data } = await supabase.from("savings_progress").insert({
        user_id: userId,
        month_number: nextNum,
        month_label: label,
        completed: true,
        saved_amount: amount,
        target_amount: monthlySavingsTarget,
        total_upfront: totalUpfront,
      }).select().single();
      if (data) {
        setMonths(prev => prev.map(m => m.month_number === nextNum ? { ...m, id: data.id } : m));
      }
    } catch {
      toast.error("Error al guardar");
      setMonths(prev => prev.filter(m => m.month_number !== nextNum));
    }
  };

  const handleEdit = async (monthNumber: number) => {
    const amount = Number(editValue.replace(",", "."));
    if (!amount || amount <= 0) { toast.error("Introduce una cantidad válida"); return; }
    const month = months.find(m => m.month_number === monthNumber);
    if (!month) return;
    setMonths(prev => prev.map(m => m.month_number === monthNumber ? { ...m, saved_amount: amount } : m));
    setEditingMonth(null);
    if (month.id) {
      await supabase.from("savings_progress").update({ saved_amount: amount, updated_at: new Date().toISOString() }).eq("id", month.id);
    }
    toast.success("Actualizado");
  };

  const handleDelete = async (monthNumber: number) => {
    const month = months.find(m => m.month_number === monthNumber);
    if (!month) return;
    setMonths(prev => prev.filter(m => m.month_number !== monthNumber));
    if (month.id) {
      await supabase.from("savings_progress").delete().eq("id", month.id);
    }
    toast.success("Mes eliminado");
  };

  const chartData = (() => {
    if (months.length === 0) return [];
    const sorted = [...months].sort((a, b) => a.month_number - b.month_number);
    let running = currentSavings;
    return sorted
      .filter(m => m.completed)
      .map(m => {
        running += m.saved_amount;
        const gap = Math.max(0, totalUpfront - running);
        const mLeft = monthlySavingsTarget > 0 ? Math.ceil(gap / monthlySavingsTarget) : 0;
        return { label: m.month_label, monthsLeft: mLeft, totalSaved: running };
      });
  })();

  if (loading) return null;

  return (
    <div className="space-y-4">

      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border-2 border-primary/20 bg-primary/5 shadow-lg shadow-primary/5">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Tu progreso real</p>
            <h2 className="text-xl font-extrabold tracking-tight mb-5">¿Cómo vas hacia tu casa?</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-background/60 border border-border p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Te faltan</p>
                <p className="text-3xl font-extrabold text-primary leading-none">
                  {formatYearsShort(estimatedMonthsLeft)}
                </p>
                {monthsSaved > 0 && (
                  <p className="text-xs text-success font-bold mt-1.5">
                    ↓ {formatYearsShort(monthsSaved)} menos que al empezar
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-background/60 border border-border p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Ahorrado en total</p>
                <p className="text-3xl font-extrabold text-foreground leading-none">
                  {formatCurrency(totalSaved)}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {progressPercent}% de {formatCurrency(totalUpfront)}
                </p>
              </div>
            </div>

            <div className="h-2 bg-background/60 rounded-full overflow-hidden border border-border">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
              <span>{formatCurrency(totalSaved)} ahorrado</span>
              <span>Meta: {formatCurrency(totalUpfront)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* GRÁFICO */}
      {chartData.length >= 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="glow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-success" />
                Evolución — años restantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Cada mes que registras, el tiempo restante baja. Así de visual.
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${Math.round(v / 12)}a`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="hsl(var(--success))" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="monthsLeft"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* REGISTRO MENSUAL */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Registro mensual de ahorro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex gap-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex-1">
                <p className="text-xs font-bold text-primary mb-1.5">¿Cuánto has ahorrado este mes?</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">€</span>
                  <Input
                    type="number"
                    placeholder="800"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddMonth()}
                    className="pl-7 font-bold"
                  />
                </div>
              </div>
              <Button onClick={handleAddMonth} className="self-end rounded-xl font-bold px-4">
                <Plus className="h-4 w-4 mr-1" /> Añadir
              </Button>
            </div>

            {months.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">Aún no has registrado ningún mes.</p>
                <p className="text-muted-foreground text-xs mt-1">Empieza añadiendo lo que has ahorrado este mes.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground px-1 pb-1 border-b border-border">
                  <span>Mes</span>
                  <span>Ahorrado · Total acumulado</span>
                </div>

                <AnimatePresence>
                  {months.map((m, i) => {
                    const sortedAsc = [...months].sort((a, b) => a.month_number - b.month_number);
                    let running = currentSavings;
                    for (const entry of sortedAsc) {
                      if (entry.completed) running += entry.saved_amount;
                      if (entry.month_number === m.month_number) break;
                    }

                    return (
                      <motion.div
                        key={m.month_number}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                      >
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold">{m.month_label}</p>
                          {editingMonth === m.month_number ? (
                            <div className="flex gap-1.5 mt-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleEdit(m.month_number)}
                                className="h-7 text-xs w-24 font-bold"
                                autoFocus
                              />
                              <Button size="sm" className="h-7 px-2 text-xs" onClick={() => handleEdit(m.month_number)}>OK</Button>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setEditingMonth(null)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-bold text-foreground">+{formatCurrency(m.saved_amount)}</span>
                              <span className="mx-1">·</span>
                              Total: {formatCurrency(running)}
                            </p>
                          )}
                        </div>

                        {editingMonth !== m.month_number && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => { setEditingMonth(m.month_number); setEditValue(String(m.saved_amount)); }}
                              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDelete(m.month_number)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors"
                            >
                              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default SavingsJournal;
