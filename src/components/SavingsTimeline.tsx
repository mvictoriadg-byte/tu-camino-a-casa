import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/housing-data";
import { Flag } from "lucide-react";

import milestoneStart from "@/assets/milestone-start.png";
import milestoneCoins from "@/assets/milestone-coins.png";
import milestoneFlag from "@/assets/milestone-flag.png";
import milestoneKeys from "@/assets/milestone-keys.png";
import milestoneHouse from "@/assets/milestone-house.png";

interface Milestone {
  label: string;
  date: string;
  reached: boolean;
}

interface SavingsTimelineProps {
  milestones: Milestone[];
  totalSavings: number;
  totalUpfront: number;
  savingsProgress: number;
}

const TIMELINE_DATA = [
  {
    illustration: milestoneStart,
    title: "Empiezas tu camino",
    description: "¡Vámonos!",
    pct: 0,
  },
  {
    illustration: milestoneCoins,
    title: "Primer gran paso",
    description: "Has alcanzado el 25% del ahorro necesario.",
    pct: 25,
  },
  {
    illustration: milestoneFlag,
    title: "¡Mitad del camino!",
    description: "¡Vas genial!",
    pct: 50,
  },
  {
    illustration: milestoneKeys,
    title: "Casi lo tienes",
    description: "El 75% está listo. ¡Ya queda muy poco!",
    pct: 75,
  },
  {
    illustration: milestoneHouse,
    title: "¡Tu casa te espera!",
    description: "Entrada completa. Estás listo para comprar.",
    pct: 100,
  },
];

const SavingsTimeline = ({ milestones, totalSavings, totalUpfront, savingsProgress }: SavingsTimelineProps) => {
  // Map milestones reached status: index 0 is "start" (always reached), then 1-4 map to milestones[0-3]
  const getReached = (index: number) => {
    if (index === 0) return true; // start is always reached
    return milestones[index - 1]?.reached ?? false;
  };

  const getDate = (index: number) => {
    if (index === 0) return "✓ Hoy";
    return milestones[index - 1]?.date ?? "—";
  };

  // Find current active node (first unreached, or last if all reached)
  const currentIndex = TIMELINE_DATA.findIndex((_, i) => !getReached(i));
  const activeIndex = currentIndex === -1 ? TIMELINE_DATA.length - 1 : Math.max(0, currentIndex - 1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
      <Card className="glow-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" /> Tu Roadmap de Ahorro
          </CardTitle>
          <p className="text-sm text-muted-foreground">Estás en camino. Cada paso te acerca más a tu hogar.</p>
        </CardHeader>
        <CardContent className="pb-6">
          <ScrollArea className="w-full">
            <div className="flex items-start gap-0 min-w-[700px] px-2 pt-2 pb-4">
              {TIMELINE_DATA.map((node, i) => {
                const reached = getReached(i);
                const isActive = i === activeIndex + 1 && !reached;
                const isLast = i === TIMELINE_DATA.length - 1;

                return (
                  <div key={i} className="flex items-start flex-1 min-w-0">
                    {/* Node */}
                    <div className="flex flex-col items-center text-center w-full">
                      {/* Illustration */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`relative mb-2 ${isActive ? "animate-pulse" : ""}`}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                          reached
                            ? "bg-success/10 ring-2 ring-success/30"
                            : isActive
                              ? "bg-primary/10 ring-2 ring-primary/40 shadow-lg shadow-primary/20"
                              : "bg-muted/60"
                        }`}>
                          <img
                            src={node.illustration}
                            alt={node.title}
                            className={`w-12 h-12 object-contain transition-all ${reached || isActive ? "opacity-100" : "opacity-40 grayscale"}`}
                          />
                        </div>
                        {isActive && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            Estás aquí
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Title & description */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="mt-1 px-1"
                      >
                        <p className={`text-xs font-bold leading-tight ${reached ? "text-success" : isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {node.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight max-w-[120px] mx-auto">
                          {node.description}
                        </p>
                        <p className={`text-[10px] font-mono font-bold mt-1 ${reached ? "text-success" : "text-muted-foreground"}`}>
                          {getDate(i)}
                        </p>
                      </motion.div>
                    </div>

                    {/* Connector line */}
                    {!isLast && (
                      <div className="flex items-center mt-8 -mx-1 flex-shrink-0" style={{ width: "100%", maxWidth: 80 }}>
                        <div className="h-1 w-full rounded-full bg-muted relative overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: "var(--gradient-primary)" }}
                            initial={{ width: "0%" }}
                            animate={{
                              width: reached && getReached(i + 1) ? "100%" : reached ? `${Math.min(100, Math.max(0, (savingsProgress - node.pct) / (TIMELINE_DATA[i + 1].pct - node.pct) * 100))}%` : "0%",
                            }}
                            transition={{ duration: 1, delay: 0.7 + i * 0.15 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Motivational footer */}
          <div className="mt-3 pt-3 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {savingsProgress >= 100 ? (
                <span className="text-success font-bold">🎉 ¡Felicidades! Ya tienes todo listo para dar el gran paso.</span>
              ) : savingsProgress >= 75 ? (
                <span>🔑 <span className="font-bold">¡Ya casi lo tienes!</span> Solo faltan unos pasos más.</span>
              ) : savingsProgress >= 50 ? (
                <span>🚀 <span className="font-bold">¡Vas por la mitad!</span> Sigues avanzando hacia tu casa.</span>
              ) : savingsProgress >= 25 ? (
                <span>💪 <span className="font-bold">¡Buen ritmo!</span> Cada mes estás más cerca.</span>
              ) : (
                <span>🌱 <span className="font-bold">El viaje ha empezado.</span> Cada euro cuenta.</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavingsTimeline;
