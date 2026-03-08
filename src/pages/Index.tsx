import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InputForm from "@/components/InputForm";
import Dashboard from "@/components/Dashboard";
import { calculateAffordability, type AffordabilityResult, type UserProfile } from "@/lib/housing-data";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Home, User, LogIn, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import illustrationPlan from "@/assets/illustration-plan.png";

const Index = () => {
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCalculate = async (profile: UserProfile) => {
    const r = calculateAffordability(profile);
    setResult(r);
    if (user) {
      try {
        const { data: existing } = await supabase.from("user_financial_data").select("id").eq("user_id", user.id).limit(1);
        const payload = {
          user_id: user.id, city: profile.city, age: profile.age, employment_status: profile.employmentStatus,
          monthly_income: profile.monthlyIncome, savings: profile.savings, monthly_savings: profile.monthlySavings,
          monthly_debts: profile.monthlyDebts, num_buyers: profile.numBuyers, co_buyers: profile.coBuyers as any,
          property_type: profile.preferences.propertyType, size_sqm: Number(profile.preferences.size),
          rooms: profile.preferences.rooms, zone: profile.preferences.zone, reform_state: profile.preferences.reformState,
          mortgage_percent: profile.mortgagePercent, result_json: r as any
        };
        if (existing && existing.length > 0) {
          await supabase.from("user_financial_data").update(payload).eq("id", existing[0].id);
        } else {
          await supabase.from("user_financial_data").insert(payload);
        }
        toast.success("Plan guardado en tu cuenta");
      } catch {/* silent */}
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between h-14 px-4 sm:px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight">Tu camino a casa</span>
          </button>
          {user ?
          <Button size="sm" className="rounded-full font-semibold" onClick={() => navigate("/portal")}>
              <User className="h-4 w-4 mr-1.5" /> Mi Portal
            </Button> :

          <Button size="sm" variant="outline" className="rounded-full font-semibold" onClick={() => navigate("/auth")}>
              <LogIn className="h-4 w-4 mr-1.5" /> Acceder
            </Button>
          }
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6">
        <div className="container max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight">Comprar tu casa
está más cerca
              <br />
              <span className="gradient-text">está más cerca</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Descubre cuánto necesitas, crea tu plan personalizado y haz realidad tu primera vivienda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <InputForm onCalculate={handleCalculate} />
            </div>
            <div className="lg:col-span-8">
              {result ? <div className="space-y-6">
                  <Dashboard result={result} />
                  {!user &&
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="rounded-2xl bg-primary p-8 text-center">
                        <h3 className="text-2xl font-extrabold text-primary-foreground mb-2">Guarda tu plan gratis</h3>
                        <p className="text-sm text-primary-foreground/70 mb-5 max-w-md mx-auto">
                          Crea una cuenta para guardar tu plan, hacer seguimiento y crear tu wishlist de propiedades.
                        </p>
                        <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-base px-8" onClick={() => navigate("/auth")}>
                          Crear cuenta <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                }
                </div> :

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-center h-full min-h-[600px] pt-8">
                  <div className="text-center">
                    <div className="w-32 h-32 flex items-center justify-center mx-auto mb-8">
                      <img src={illustrationPlan} alt="Tu plan" className="w-32 h-32 object-contain" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3">Tu plan personalizado</h3>
                    <p className="text-muted-foreground text-base max-w-sm mx-auto">Rellena tus datos en el formulario para ver tu roadmap de compra</p>
                  </div>
                </motion.div>
              }
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <Home className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Tu camino a casa</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Tu camino a casa · España</p>
        </div>
      </footer>
    </div>);

};

export default Index;