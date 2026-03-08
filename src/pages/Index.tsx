import { useState } from "react";
import { motion } from "framer-motion";
import InputForm from "@/components/InputForm";
import Dashboard from "@/components/Dashboard";
import { calculateAffordability, type AffordabilityResult, type UserProfile } from "@/lib/housing-data";
import { Home } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const handleCalculate = (profile: UserProfile) => {
    const r = calculateAffordability(profile);
    setResult(r);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-dark)" }}>
      <div className="container max-w-6xl py-8 px-4 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Home className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Tu Camino a Casa · España
            </span>
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
              <Dashboard result={result} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full min-h-[400px]"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-primary/50" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Rellena tus datos para ver tu<br />plan personalizado de compra
                  </p>
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
