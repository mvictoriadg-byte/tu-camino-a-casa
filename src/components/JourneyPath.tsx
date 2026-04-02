import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Home, Lock, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, Zap, Target, Shield, Search,
  FileText, Handshake, Award, BookOpen, ArrowRight, GraduationCap,
} from "lucide-react";
import type { TrackerData } from "@/hooks/use-tracker-data";
import { STEP_MICROLEARNING, type MicrolearningEntry } from "@/lib/microlearning-content";

/* ═══════════════════════════════════════════════════════════
   LEARNING CONTENT PER PHASE
   ═══════════════════════════════════════════════════════════ */

interface PhaseLearn {
  essentials: string[];
  deepDive: {
    buttonLabel: string;
    title: string;
    sections: { heading: string; body: string }[];
  };
}

const PHASE_LEARNING: Record<number, PhaseLearn> = {
  1: {
    essentials: [
      "Tu capacidad de compra depende de tus ingresos, ahorros y deudas actuales",
      "Comprar una casa implica entrada (~20%) + gastos (~10%) además del precio",
      "La cuota hipotecaria no debería superar el 30-35% de tu sueldo neto",
      "El banco no solo mira cuánto ganas — mira la estabilidad de tus ingresos",
    ],
    deepDive: {
      buttonLabel: "Ver cómo calcular tu capacidad real",
      title: "¿Cómo saber si puedes comprar?",
      sections: [
        {
          heading: "La regla del 30-35%",
          body: "Los bancos suelen aprobar hipotecas cuya cuota no supere el 30-35% de tus ingresos netos mensuales. Si ganas 2.000€/mes, tu cuota máxima sería de unos 600-700€.",
        },
        {
          heading: "Ahorros necesarios",
          body: "Normalmente necesitas tener ahorrado al menos el 20% del precio de la vivienda (entrada) más un 10-12% adicional para impuestos y gastos. En una vivienda de 200.000€, eso serían unos 60.000-64.000€.",
        },
        {
          heading: "Las ayudas pueden cambiar la ecuación",
          body: "Dependiendo de tu edad, ingresos y comunidad autónoma, puedes acceder a avales públicos, subvenciones o deducciones fiscales que reducen significativamente la cantidad que necesitas ahorrar.",
        },
      ],
    },
  },
  2: {
    essentials: [
      "Necesitarás aproximadamente el 30% del valor de la vivienda (entrada + gastos)",
      "La entrada reduce tu hipoteca; los gastos son obligatorios y no la reducen",
      "Ambos deben estar disponibles antes de firmar",
    ],
    deepDive: {
      buttonLabel: "Ver desglose completo entrada vs gastos",
      title: "Entrada y gastos: todo lo que necesitas saber",
      sections: [
        {
          heading: "El 30% desglosado",
          body: "Para una vivienda de 200.000€:\n• Entrada (20%): 40.000€\n• Gastos (~10%): 20.000€\n• Total: 60.000€",
        },
        {
          heading: "Gastos: qué incluyen",
          body: "ITP o IVA (según vivienda nueva o usada), notaría, registro de la propiedad y gestoría. Son obligatorios y no reducen tu hipoteca.",
        },
      ],
    },
  },
  3: {
    essentials: [
      "Existen ayudas que pueden reducir lo que necesitas ahorrar",
      "Muchas están enfocadas en menores de 35 años — revísalas cuanto antes",
      "Pueden reducir la entrada, aumentar financiación o mejorar condiciones",
      "Tienen convocatorias con presupuesto limitado — si no aplicas a tiempo, las pierdes",
    ],
    deepDive: {
      buttonLabel: "Ver tipos de ayudas y cómo aplicar",
      title: "Ayudas para comprar vivienda",
      sections: [
        {
          heading: "🏡 Aval ICO",
          body: "Permite financiar hasta el 100%. El Estado avala parte del préstamo. Requisitos: menor de 35, primera vivienda, ingresos dentro de límites. Se solicita en el banco.",
        },
        {
          heading: "💸 Ayudas autonómicas",
          body: "Subvenciones directas que cubren parte del coste o entrada. Dependen de comunidad, ingresos y ubicación. Se solicitan por convocatoria pública.",
        },
        {
          heading: "🧾 Deducciones fiscales",
          body: "Beneficios fiscales tras la compra que reducen tus impuestos en el tiempo.",
        },
      ],
    },
  },
  4: {
    essentials: [
      "Hay 3 tipos de hipoteca: fija, variable y mixta",
      "TIN = interés puro; TAE = coste total (compara siempre la TAE)",
      "El banco normalmente financia hasta el 80%, pero puede ser más",
      "El pre-scoring es una evaluación rápida — no te compromete a nada",
      "La tasación define cuánto te prestan, no el precio de venta",
    ],
    deepDive: {
      buttonLabel: "Ver todo sobre hipotecas",
      title: "Entiende cómo funcionan las hipotecas",
      sections: [
        {
          heading: "Fija vs Variable vs Mixta",
          body: "Fija: cuota estable siempre. Variable: varía con el Euríbor. Mixta: fija los primeros años, variable después.",
        },
        {
          heading: "Negociación",
          body: "Puedes negociar intereses, comisiones y productos vinculados. Compara al menos 3 ofertas.",
        },
        {
          heading: "Pre-scoring y tasación",
          body: "El pre-scoring evalúa si tu perfil es viable. La tasación valora la vivienda oficialmente — el banco calcula la financiación sobre este valor.",
        },
      ],
    },
  },
  5: {
    essentials: [
      "Contacta al menos 2-3 bancos para comparar ofertas",
      "Pide simulaciones detalladas: cuota, interés, comisiones",
      "Un broker hipotecario puede negociar por ti y conseguir mejores condiciones",
      "La diferencia entre ofertas puede suponer 10.000-30.000€ en el total",
    ],
    deepDive: {
      buttonLabel: "Ver cómo comparar ofertas",
      title: "Cómo conseguir la mejor hipoteca",
      sections: [
        {
          heading: "Compara con criterio",
          body: "No solo mires el interés. Compara también comisiones, productos vinculados y TAE total.",
        },
        {
          heading: "¿Broker o por tu cuenta?",
          body: "El broker cobra comisión pero puede ahorrarte más de lo que cuesta. Algunos no cobran si no consiguen hipoteca.",
        },
      ],
    },
  },
  6: {
    essentials: [
      "El banco mira estabilidad laboral, deudas e historial de ahorro",
      "Cada deuda que reduces mejora directamente tu capacidad hipotecaria",
      "Prepara la documentación con antelación para agilizar el proceso",
    ],
    deepDive: {
      buttonLabel: "Ver cómo preparar tu perfil",
      title: "Prepárate para que el banco te diga que sí",
      sections: [
        {
          heading: "Documentación necesaria",
          body: "Últimas 3 nóminas, contrato de trabajo, extractos bancarios (6 meses), declaración de la renta, DNI/NIE.",
        },
        {
          heading: "Ratio de endeudamiento",
          body: "El banco suma todas tus cuotas mensuales y las compara con tus ingresos. Si superas el 35-40%, es probable que no aprueben.",
        },
        {
          heading: "Optimiza tu perfil",
          body: "Cancela tarjetas sin uso, elimina deudas pequeñas, mantén ahorro constante y evita cambios de empleo justo antes.",
        },
      ],
    },
  },
  7: {
    essentials: [
      "Separa lo imprescindible (MUST) de lo deseable (NICE)",
      "Tener claras tus prioridades te evita decisiones emocionales",
      "Conocer las red flags te protege de malas compras",
    ],
    deepDive: {
      buttonLabel: "Ver cómo definir tu checklist",
      title: "Define qué vivienda necesitas de verdad",
      sections: [
        {
          heading: "MUST vs NICE",
          body: "MUST = lo que no puedes negociar (ubicación, tamaño, presupuesto). NICE = lo que te gustaría pero puedes ceder (terraza, garaje, vistas).",
        },
        {
          heading: "Red flags",
          body: "Humedades, ruido excesivo, mala orientación, instalaciones antiguas y derramas pendientes son señales de alerta.",
        },
      ],
    },
  },
  8: {
    essentials: [
      "Los precios varían enormemente entre barrios — analiza precios por m²",
      "Evalúa infraestructura, crecimiento y servicios de cada zona",
      "Visita el barrio a diferentes horas para detectar problemas reales",
    ],
    deepDive: {
      buttonLabel: "Ver cómo analizar zonas",
      title: "Analiza zonas como una decisión inteligente",
      sections: [
        {
          heading: "Factores clave",
          body: "Transporte público, colegios, comercios, zonas verdes y perspectiva de revalorización.",
        },
        {
          heading: "Señales positivas",
          body: "Nuevas líneas de transporte, apertura de comercios, obras de mejora urbana — indican crecimiento.",
        },
      ],
    },
  },
  9: {
    essentials: [
      "Quédate con 3-5 opciones que cumplan tus MUST",
      "Las visitas presenciales revelan cosas que las fotos nunca muestran",
      "Visita a diferentes horas para detectar problemas de ruido o luz",
    ],
    deepDive: {
      buttonLabel: "Ver consejos para visitas",
      title: "Busca y visita viviendas con criterio",
      sections: [
        {
          heading: "Checklist de visita",
          body: "Revisa estado general, luz natural, ruido, humedades, zonas comunes. Pregunta por comunidad, derramas, tiempo en el mercado.",
        },
        {
          heading: "Compara con criterio",
          body: "Usa tu checklist para puntuar cada opción. Decisiones racionales, no emocionales.",
        },
      ],
    },
  },
  10: {
    essentials: [
      "La reserva asegura que nadie más se lleve la vivienda",
      "Las arras son tu compromiso formal — a partir de ahí es prácticamente tuya",
      "Revisa todos los documentos (FEIN, nota simple) antes de firmar",
      "Después de la firma ante notario, las llaves son tuyas 🏡",
    ],
    deepDive: {
      buttonLabel: "Ver los pasos finales en detalle",
      title: "Los últimos pasos de la compra",
      sections: [
        {
          heading: "La reserva (señal)",
          body: "Normalmente entre 1.000€ y 5.000€ que se descuentan del precio final.",
        },
        {
          heading: "El contrato de arras",
          body: "Contrato privado donde se fija precio, condiciones y plazo. Normalmente pagas el 10%. Si incumples, pierdes la señal. Si incumple el vendedor, te devuelve el doble.",
        },
        {
          heading: "La firma ante notario",
          body: "Se firma la escritura de compraventa y la hipoteca el mismo día. Después, solo queda inscribir en el Registro de la Propiedad. ¡Y ya tienes tu casa!",
        },
      ],
    },
  },
};

/* ── Completion micro-rewards (toasts) ── */
const STEP_REWARDS: Record<string, string> = {
  "Definir tu presupuesto máximo de compra": "✔️ Ya sabes cuánto puedes gastar",
  "Calcular cuota mensual cómoda": "✔️ Tienes clara tu cuota máxima",
  "Validar estabilidad de ingresos": "✔️ Tu estabilidad está validada",
  "Calcular objetivo total de ahorro": "✔️ Ya conoces tu objetivo de ahorro",
  "Separar entrada vs gastos": "✔️ Tienes claro qué es entrada y qué son gastos",
  "Ver ayudas aplicables a mi perfil": "✔️ Estás aprovechando ventajas que mucha gente ignora",
  "Identificar requisitos clave": "✔️ Sabes lo que necesitas para acceder a ayudas",
  "Elegir tipo de hipoteca": "✔️ Ya entiendes los tipos de hipoteca",
  "Entender porcentajes a financiar": "✔️ Sabes cuánto puede financiar el banco",
  "Negociación con bancos": "✔️ Estás preparado para negociar",
  "Qué es el pre-scoring": "✔️ Conoces cómo te evalúa el banco",
  "Entender la tasación": "✔️ Entiendes cómo funciona la tasación",
  "Contactar 2–3 bancos": "✔️ Ya estás comparando ofertas reales",
  "Pedir simulaciones": "✔️ Tienes simulaciones para comparar",
  "Evaluar broker": "✔️ Has evaluado todas tus opciones",
  "Reunir documentación": "✔️ Tu documentación está lista",
  "Revisar deudas": "✔️ Tus deudas están bajo control",
  "Optimizar perfil financiero": "✔️ Tu perfil financiero está optimizado",
  "Crear checklist de necesidades": "✔️ Tienes claras tus prioridades",
  "Definir red flags": "✔️ Sabes qué evitar al comprar",
  "Definir zonas objetivo": "✔️ Tienes zonas definidas con criterio",
  "Evaluar riesgos de zona": "✔️ Has evaluado los riesgos de tus zonas",
  "Analizar barrio": "✔️ Conoces los barrios que te interesan",
  "Guardar favoritos": "✔️ Tienes opciones seleccionadas",
  "Realizar visitas": "✔️ Has visitado viviendas de verdad",
  "Hacer oferta": "🎉 ¡Estás cerrando la compra de tu casa!",
};

/* ── Unlocked insight on checkbox complete ── */
const STEP_INSIGHTS: Record<string, string> = {
  "Definir tu presupuesto máximo de compra": "El coste real incluye precio + entrada (20%) + gastos (~10%).",
  "Calcular cuota mensual cómoda": "La cuota no debería superar el 30-35% de tu sueldo neto.",
  "Validar estabilidad de ingresos": "El banco mira la seguridad de tus ingresos, no solo la cantidad.",
  "Calcular objetivo total de ahorro": "Necesitarás aproximadamente el 30% del valor de la vivienda.",
  "Separar entrada vs gastos": "La entrada reduce tu hipoteca; los gastos son obligatorios aparte.",
  "Ver ayudas aplicables a mi perfil": "Muchas personas no aprovechan ayudas a las que tienen derecho.",
  "Identificar requisitos clave": "Revisa requisitos de edad, ingresos y primera vivienda cuanto antes.",
  "Elegir tipo de hipoteca": "Fija = estabilidad. Variable = posible ahorro con riesgo. Mixta = punto medio.",
  "Entender porcentajes a financiar": "Con avales o perfil sólido puedes conseguir más del 80%.",
  "Negociación con bancos": "Compara al menos 3 ofertas — el banco espera que negocies.",
  "Qué es el pre-scoring": "El pre-scoring te dice si eres viable sin comprometerte a nada.",
  "Entender la tasación": "El banco financia sobre el valor de tasación, no sobre el precio de compra.",
  "Contactar 2–3 bancos": "Tener varias ofertas te da poder de negociación.",
  "Pedir simulaciones": "La diferencia entre ofertas puede suponer 10.000-30.000€.",
  "Evaluar broker": "Un broker puede ahorrarte más de lo que cobra.",
  "Reunir documentación": "Preparar la documentación con antelación agiliza todo el proceso.",
  "Revisar deudas": "Cada deuda que reduces mejora tu capacidad hipotecaria.",
  "Optimizar perfil financiero": "Un perfil financiero claro es lo que los bancos miran primero.",
  "Crear checklist de necesidades": "Separar MUST de NICE te evita decisiones emocionales.",
  "Definir red flags": "Humedades, ruido y mala orientación son las red flags más comunes.",
  "Definir zonas objetivo": "Los precios varían enormemente entre barrios — compara por m².",
  "Evaluar riesgos de zona": "Infraestructura y crecimiento son indicadores clave de una buena zona.",
  "Analizar barrio": "Visita a diferentes horas para detectar problemas reales.",
  "Guardar favoritos": "3-5 opciones es el número ideal para decidir sin paralizarte.",
  "Realizar visitas": "Las visitas presenciales revelan cosas que las fotos nunca muestran.",
  "Hacer oferta": "Justifica tu oferta con datos de la zona — se toma más en serio.",
};

/* ── Mission icons ── */
const PHASE_ICONS: Record<number, React.ReactNode> = {
  1: <Target className="h-5 w-5" />,
  2: <Shield className="h-5 w-5" />,
  3: <Zap className="h-5 w-5" />,
  4: <FileText className="h-5 w-5" />,
  5: <Handshake className="h-5 w-5" />,
  6: <Shield className="h-5 w-5" />,
  7: <Home className="h-5 w-5" />,
  8: <Search className="h-5 w-5" />,
  9: <Search className="h-5 w-5" />,
  10: <Handshake className="h-5 w-5" />,
};

/* ── Helpers ── */
function getGlobalMessage(percent: number): string {
  if (percent >= 100) return "🏡 ¡Lo has conseguido! Tu camino está completo.";
  if (percent >= 75) return "¡Estás muy cerca! La recta final de tu camino.";
  if (percent >= 50) return "Muchos se quedan aquí — tú ya estás avanzando.";
  if (percent >= 25) return "Ya has recorrido una parte importante del camino.";
  if (percent > 0) return "Buen comienzo. Cada paso te acerca a tu casa.";
  return "Tu camino empieza aquí. ¡Vamos a ello!";
}

function getMissionFeedback(completedCount: number, totalCount: number): string {
  if (completedCount === totalCount && totalCount > 0) return "¡Misión completada! 🎉";
  if (completedCount >= Math.ceil(totalCount / 2)) return "¡Vas por muy buen camino! 👏";
  if (completedCount > 0) return "Buen comienzo 👏";
  return "";
}

/* ── Component ── */
interface JourneyPathProps {
  tracker: TrackerData;
  userId: string;
}

const JourneyPath = ({ tracker, userId }: JourneyPathProps) => {
  const { phases, steps, stepProgress, toggleStep, trackerState } = tracker;
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [unlockedInsight, setUnlockedInsight] = useState<{ title: string; text: string } | null>(null);
  const [deepDivePhase, setDeepDivePhase] = useState<number | null>(null);
  const [microlearnModal, setMicrolearnModal] = useState<MicrolearningEntry | null>(null);

  // Track which steps have been "learned" — persisted in localStorage
  const [learnedSteps, setLearnedSteps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`learned_steps_${userId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const markAsLearned = useCallback((stepTitle: string) => {
    setLearnedSteps(prev => {
      const next = new Set(prev);
      next.add(stepTitle);
      localStorage.setItem(`learned_steps_${userId}`, JSON.stringify([...next]));
      return next;
    });
    toast.success("✔️ Ya entiendes este paso", { duration: 2000 });
  }, [userId]);

  const completedStepIds = new Set(stepProgress.filter(s => s.completed).map(s => s.step_id));
  const totalSteps = steps.length;

  // A phase is fully complete when all actions are checked AND all microlearnings are done
  const isPhaseFullyComplete = useCallback((phaseId: string) => {
    const phaseSteps = steps.filter(s => s.phase_id === phaseId);
    if (phaseSteps.length === 0) return false;
    const allActionsComplete = phaseSteps.every(s => completedStepIds.has(s.id));
    const allLearned = phaseSteps.every(s => {
      const hasMicrolearn = !!STEP_MICROLEARNING[s.title];
      return !hasMicrolearn || learnedSteps.has(s.title);
    });
    return allActionsComplete && allLearned;
  }, [steps, completedStepIds, learnedSteps]);

  // Count completed steps (actions + microlearnings both done)
  const fullyCompletedCount = steps.filter(s => {
    const actionDone = completedStepIds.has(s.id);
    const hasMicrolearn = !!STEP_MICROLEARNING[s.title];
    const learnDone = !hasMicrolearn || learnedSteps.has(s.title);
    return actionDone && learnDone;
  }).length;

  const globalPercent = totalSteps > 0 ? Math.round((fullyCompletedCount / totalSteps) * 100) : 0;

  // Current phase = first phase not fully complete (progress-based, not time-based)
  const sortedPhases = [...phases].sort((a, b) => a.order_index - b.order_index);
  const currentPhase = sortedPhases.find(p => !isPhaseFullyComplete(p.id)) || sortedPhases[sortedPhases.length - 1];
  const currentOrderIdx = currentPhase?.order_index ?? 1;

  useEffect(() => {
    if (currentPhase && !expandedPhase) setExpandedPhase(currentPhase.id);
  }, [currentPhase?.id]);

  const handleToggleStep = useCallback(async (stepId: string, checked: boolean, stepTitle: string) => {
    await toggleStep(stepId, checked);
    if (checked) {
      const reward = STEP_REWARDS[stepTitle] || "✔️ Un paso más completado";
      toast.success(reward, { duration: 2500 });
      const insight = STEP_INSIGHTS[stepTitle];
      if (insight) {
        setTimeout(() => {
          setUnlockedInsight({ title: stepTitle, text: insight });
          setTimeout(() => setUnlockedInsight(null), 5000);
        }, 800);
      }
    }
  }, [toggleStep]);

  const isMissionUnlocked = (phase: typeof phases[0]) => {
    if (phase.order_index <= currentOrderIdx) return true;
    if (phase.order_index === currentOrderIdx + 1) return true;
    const prevPhase = phases.find(p => p.order_index === phase.order_index - 1);
    if (prevPhase && isPhaseFullyComplete(prevPhase.id)) return true;
    return false;
  };

  const activeDeepDive = deepDivePhase !== null ? PHASE_LEARNING[deepDivePhase] : null;

  return (
    <div className="space-y-6">
      {/* ── Global Progress ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-5 sm:gap-8">
            {/* Circular progress */}
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - globalPercent / 100)}`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-extrabold text-primary leading-none">{globalPercent}%</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1">Tu camino hacia tu casa</h2>
              <p className="text-sm text-muted-foreground mb-2">{getGlobalMessage(globalPercent)}</p>
              <p className="text-xs text-muted-foreground">
                {fullyCompletedCount} de {totalSteps} pasos completados
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Unlocked Insight Overlay ── */}
      <AnimatePresence>
        {unlockedInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50"
          >
            <Card className="border-primary/30 bg-card shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-warning/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-warning mb-1">
                      💡 Lo que acabas de aprender
                    </p>
                    <p className="text-sm text-foreground">{unlockedInsight.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Deep Dive Modal ── */}
      <Dialog open={deepDivePhase !== null} onOpenChange={(open) => !open && setDeepDivePhase(null)}>
        {activeDeepDive && (
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {activeDeepDive.deepDive.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Información detallada para que tomes mejores decisiones
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              {activeDeepDive.deepDive.sections.map((section, i) => (
                <div key={i}>
                  <h4 className="font-bold text-sm text-foreground mb-1.5">{section.heading}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Microlearning Modal ── */}
      <Dialog open={microlearnModal !== null} onOpenChange={(open) => !open && setMicrolearnModal(null)}>
        {microlearnModal && (
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {microlearnModal.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Aprende lo esencial sobre este paso
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              {microlearnModal.sections.map((section, i) => (
                <div key={i}>
                  <h4 className="font-bold text-sm text-foreground mb-1.5">{section.heading}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.body}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Mission Blocks ── */}
      {phases.map((phase, idx) => {
        const phaseSteps = steps.filter(s => s.phase_id === phase.id);
        const phaseCompletedCount = phaseSteps.filter(s => completedStepIds.has(s.id)).length;
        const phaseLearnedCount = phaseSteps.filter(s => {
          const hasMicrolearn = !!STEP_MICROLEARNING[s.title];
          return !hasMicrolearn || learnedSteps.has(s.title);
        }).length;
        const phaseTotal = phaseSteps.length;
        const phaseFullyDone = phaseSteps.filter(s => {
          const actionDone = completedStepIds.has(s.id);
          const hasMicrolearn = !!STEP_MICROLEARNING[s.title];
          const learnDone = !hasMicrolearn || learnedSteps.has(s.title);
          return actionDone && learnDone;
        }).length;
        const phasePercent = phaseTotal > 0 ? Math.round((phaseFullyDone / phaseTotal) * 100) : 0;
        const allComplete = phaseTotal > 0 && phaseFullyDone === phaseTotal;
        const isCurrent = currentPhase?.id === phase.id;
        const unlocked = isMissionUnlocked(phase);
        const isExpanded = expandedPhase === phase.id;
        const feedback = getMissionFeedback(phaseCompletedCount, phaseTotal);
        const isAidsMission = phase.order_index === 3;
        const learning = PHASE_LEARNING[phase.order_index];

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
          >
            <Card
              className={`glow-card transition-all duration-300 ${
                !unlocked ? "opacity-50 blur-[1px]" : ""
              } ${isCurrent ? "border-2 border-primary/40 ring-2 ring-primary/10" : ""} ${
                allComplete ? "border-success/30 bg-success/[0.03]" : ""
              } ${isAidsMission && unlocked ? "border-warning/30" : ""}`}
            >
              {/* Mission Header */}
              <button
                onClick={() => unlocked && setExpandedPhase(isExpanded ? null : phase.id)}
                disabled={!unlocked}
                className="w-full text-left p-5 pb-3"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    allComplete
                      ? "bg-success/15 text-success"
                      : isCurrent
                        ? "bg-primary/20 text-primary"
                        : unlocked
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/60 text-muted-foreground/50"
                  }`}>
                    {!unlocked ? (
                      <Lock className="h-5 w-5" />
                    ) : allComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      PHASE_ICONS[phase.order_index] || <Target className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className={`font-bold text-base ${unlocked ? "text-foreground" : "text-muted-foreground/60"}`}>
                        {phase.name}
                      </h3>
                      {isCurrent && !allComplete && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          En progreso
                        </span>
                      )}
                      {allComplete && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-success/20 text-success px-2 py-0.5 rounded-full">
                          Completada
                        </span>
                      )}
                      {isAidsMission && unlocked && !allComplete && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                          💡 Puede acelerar tu compra
                        </span>
                      )}
                    </div>

                    {!unlocked && (
                      <p className="text-xs text-muted-foreground/50 mt-1">
                        🔒 Se desbloquea cuando completes el paso anterior
                      </p>
                    )}

                    {unlocked && feedback && (
                      <p className="text-xs text-muted-foreground mt-0.5">{feedback}</p>
                    )}

                    {unlocked && phaseTotal > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <Progress value={phasePercent} className="h-1.5 flex-1" />
                          <span className="text-xs font-semibold text-muted-foreground">{phaseCompletedCount}/{phaseTotal}</span>
                        </div>
                        {!allComplete && phaseCompletedCount > 0 && (
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Te {phaseTotal - phaseCompletedCount === 1 ? "queda" : "quedan"} {phaseTotal - phaseCompletedCount} paso{phaseTotal - phaseCompletedCount !== 1 ? "s" : ""} para completar esta fase
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {unlocked && (
                    <div className="shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Content: Actions + Learning */}
              <AnimatePresence>
                {isExpanded && unlocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1">
                      {/* ── 1. Actions (checklist) ── */}
                      <div className="space-y-1.5 ml-14">
                        {phaseSteps.map(step => {
                          const isCompleted = completedStepIds.has(step.id);
                          const microlearn = STEP_MICROLEARNING[step.title];
                          const isLearned = learnedSteps.has(step.title);
                          return (
                            <div key={step.id} className="space-y-1">
                              <label
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group"
                              >
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={(checked) => handleToggleStep(step.id, !!checked, step.title)}
                                  className="shrink-0 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className={`text-sm font-medium block ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                    {step.title}
                                  </span>
                                  {step.description && (
                                    <span className="text-xs text-muted-foreground block mt-0.5">
                                      {step.description}
                                    </span>
                                  )}
                                </div>
                                {isCompleted && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                  </motion.div>
                                )}
                              </label>

                              {/* Microlearning button or learned badge */}
                              {microlearn && (
                                <div className="ml-10 pl-2">
                                  {isLearned ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMicrolearnModal(microlearn);
                                      }}
                                      className="inline-flex items-center gap-1.5 text-xs text-success font-medium hover:underline transition-colors cursor-pointer"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Ya entiendes este paso
                                      <span className="text-muted-foreground ml-1">· Repasar</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMicrolearnModal(microlearn);
                                        markAsLearned(step.title);
                                      }}
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
                                    >
                                      <GraduationCap className="h-3.5 w-3.5" />
                                      Aprende sobre esta sección
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>


                      {/* Mission complete message */}
                      {allComplete && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 ml-14 p-3 rounded-xl bg-success/10 border border-success/20"
                        >
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-success shrink-0" />
                            <p className="text-sm font-semibold text-success">Un paso más cerca de tu casa 🏡</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        );
      })}

      {/* ── Bottom encouragement ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <p className="text-sm text-muted-foreground italic">
          Con constancia en tu ahorro, tu objetivo está cada vez más cerca. 💪
        </p>
      </motion.div>
    </div>
  );
};

export default JourneyPath;
