import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2, Circle, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LockedTrackerCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <div className="relative">
        {/* Blurred background tracker */}
        <Card className="glow-card overflow-hidden select-none pointer-events-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Tu progreso hacia la entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 blur-[6px] opacity-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Meta entrada", "Ahorro mensual", "Total ahorrado", "Restante"].map(label => (
                <div key={label} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground font-semibold">{label}</p>
                  <p className="text-base font-extrabold">€ ---</p>
                </div>
              ))}
            </div>
            <Progress value={35} className="h-3" />
            <div className="grid grid-cols-4 gap-2">
              {[true, true, false, false].map((done, i) => (
                <div key={i} className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border ${done ? "bg-success/10 border-success/30" : "bg-muted/30 border-border"}`}>
                  {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground/40" />}
                  <span className="text-[10px] font-semibold text-muted-foreground">mes {i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-lg">
          <div className="text-center max-w-sm px-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-extrabold mb-3">Con el tracker puedes:</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5 text-left mb-5">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" /> Registrar tu ahorro mensual</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" /> Ver tu progreso hacia la entrada</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" /> Actualizar tu plan automáticamente</li>
            </ul>
            <Button
              className="rounded-full font-bold text-base px-8"
              size="lg"
              onClick={() => navigate("/auth")}
            >
              Crear cuenta <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LockedTrackerCTA;
