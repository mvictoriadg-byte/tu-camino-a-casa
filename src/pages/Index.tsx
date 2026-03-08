import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InputForm from "@/components/InputForm";
import Dashboard from "@/components/Dashboard";
import { calculateAffordability, type AffordabilityResult, type UserProfile } from "@/lib/housing-data";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Home, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCalculate = async (profile: UserProfile) => {
    const r = calculateAffordability(profile);
    setResult(r);

    // If user is logged in, save their data
    if (user) {
      try {
        // Check if they already have data
        const { data: existing } = await supabase
          .from("user_financial_data")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        const payload = {
          user_id: user.id,
          city: profile.city,
          age: profile.age,
          employment_status: profile.employmentStatus,
          monthly_income: profile.monthlyIncome,
          savings: profile.savings,
          monthly_savings: profile.monthlySavings,
          monthly_debts: profile.monthlyDebts,
          num_buyers: profile.numBuyers,
          co_buyers: profile.coBuyers as any,
          property_type: profile.preferences.propertyType,
          size_sqm: Number(profile.preferences.size),
          rooms: profile.preferences.rooms,
          zone: profile.preferences.zone,
          reform_state: profile.preferences.reformState,
          mortgage_percent: profile.mortgagePercent,
          result_json: r as any,
        };

        if (existing && existing.length > 0) {
          await supabase.from("user_financial_data").update(payload).eq("id", existing[0].id);
        } else {
          await supabase.from("user_financial_data").insert(payload);
        }
        toast.success("Plan guardado en tu cuenta");
      } catch {
        // Silent fail for save
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-dark)" }}>
      <div className="container max-w-6xl py-8 px-4 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Tu Camino a Casa · España</span>
            </div>
            <div>
              {user ? (
                <Button variant="outline" size="sm" onClick={() => navigate("/portal")}>
                  <User className="h-4 w-4 mr-1" /> Mi Portal
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  <LogIn className="h-4 w-4 mr-1" /> Acceder
                </Button>
              )}
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Comprar tu casa <span className="gradient-text">está más cerca</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Descubre cuánto necesitas, cuánto puedes ahorrar y cuál es tu plan personalizado para comprar tu primera vivienda en España.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <InputForm onCalculate={handleCalculate} />
          </div>
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-6">
                <Dashboard result={result} />
                {!user && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
                      <h3 className="text-lg font-bold mb-2">💾 Guarda tu plan</h3>
                      <p className="text-sm text-muted-foreground mb-4">Crea una cuenta gratuita para guardar tu plan, hacer seguimiento de tu progreso y crear tu wishlist de propiedades.</p>
                      <Button onClick={() => navigate("/auth")}>
                        <LogIn className="h-4 w-4 mr-2" /> Crear cuenta gratuita
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-primary/50" />
                  </div>
                  <p className="text-muted-foreground text-sm">Rellena tus datos para ver tu<br />plan personalizado de compra</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
