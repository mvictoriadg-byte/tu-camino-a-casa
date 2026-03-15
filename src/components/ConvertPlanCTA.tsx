import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, CalendarCheck, TrendingDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  { icon: Target, text: "Guarda tu objetivo de compra" },
  { icon: CalendarCheck, text: "Sigue tu ahorro mes a mes" },
  { icon: TrendingDown, text: "Ve cuánto te falta para alcanzar tu entrada" },
];

const ConvertPlanCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Card className="glow-card overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-extrabold mb-2 text-center">
            Convierte este resultado en tu plan para comprar casa
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto mb-6">
            Crea tu cuenta gratis para guardar esta estimación y hacer seguimiento de tu ahorro mes a mes hasta alcanzar la entrada de tu vivienda.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3.5">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
                  <b.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">{b.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <Button
              size="lg"
              className="rounded-full font-bold text-base px-8"
              onClick={() => navigate("/auth")}
            >
              Crear mi plan <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConvertPlanCTA;
