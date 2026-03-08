import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingWizard from "@/components/OnboardingWizard";
import Dashboard from "@/components/Dashboard";
import { calculateAffordability, type AffordabilityResult, type UserProfile } from "@/lib/housing-data";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Home, User, LogIn, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [phase, setPhase] = useState<"onboarding" | "loading" | "results">("onboarding");
  const [isCalculating, setIsCalculating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCalculate = async (profile: UserProfile) => {
    setIsCalculating(true);
    setPhase("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });

    await new Promise((resolve) => setTimeout(resolve, 1400));

    const r = calculateAffordability(profile);
    setResult(r);
    setIsCalculating(false);
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });

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

  const handleBackToForm = () => {
    setPhase("onboarding");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SaveCTA = () =>
    !user ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl bg-primary p-8 text-center">
          <h3 className="text-2xl font-extrabold text-primary-foreground mb-2">Guardar mi plan de ahorro</h3>
          <p className="text-sm text-primary-foreground/70 mb-1 max-w-md mx-auto">
            Crea una cuenta gratuita para guardar tu plan, hacer seguimiento y crear tu wishlist de propiedades.
          </p>
          <p className="text-xs text-primary-foreground/50 mb-5">Podrás revisarlo y ajustarlo cuando quieras.</p>
          <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-base px-8" onClick={() => navigate("/auth")}>
            Crear cuenta gratis <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    ) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between h-14 px-4 sm:px-6">
          <button onClick={() => { setPhase("onboarding"); setResult(null); }} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight">Tu camino a casa</span>
          </button>
          {user ? (
            <Button size="sm" className="rounded-full font-semibold" onClick={() => navigate("/portal")}>
              <User className="h-4 w-4 mr-1.5" /> Mi Portal
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="rounded-full font-semibold" onClick={() => navigate("/auth")}>
              <LogIn className="h-4 w-4 mr-1.5" /> Acceder
            </Button>
          )}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {phase === "onboarding" && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {/* Hero */}
            <section className="pt-10 sm:pt-14 pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="container max-w-3xl text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-[1.08] mb-3 tracking-tight">
                    Comprar tu casa{" "}
                    <br className="hidden sm:block" />
                    <span className="gradient-text">está más cerca</span>
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Responde unas preguntas y te crearemos un plan paso a paso para comprar tu casa.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Wizard */}
            <section className="pb-20 px-4 sm:px-6">
              <div className="container max-w-2xl">
                <OnboardingWizard onCalculate={handleCalculate} isCalculating={isCalculating} />
              </div>
            </section>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-5"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
              <Loader2 className="h-10 w-10 text-primary" />
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-bold">Estamos creando tu plan personalizado…</p>
              <p className="text-sm text-muted-foreground mt-1">Solo un momento</p>
            </div>
          </motion.div>
        )}

        {phase === "results" && result && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <section className="py-8 px-4 sm:px-6">
              <div className="container max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" size="sm" className="font-semibold -ml-2" onClick={handleBackToForm}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver al formulario
                  </Button>
                  <p className="text-sm font-bold text-primary">✨ Tu plan está listo</p>
                </div>
                <div className="space-y-6">
                  <Dashboard result={result} />
                  <SaveCTA />
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <Home className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Tu camino a casa</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>© 2026 Tu camino a casa · España</span>
            <span>·</span>
            <a href="/terminos" className="underline hover:text-primary transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
