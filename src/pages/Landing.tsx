import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home, ArrowRight, Shield, Sparkles, PiggyBank, BarChart3,
  User, LogIn, CheckCircle2, Clock, Target, MessageSquare } from
"lucide-react";
import doodleTarget from "@/assets/doodle-target.png";
import doodleSearch from "@/assets/doodle-search.png";
import doodleChart from "@/assets/doodle-chart.png";
import doodleCelebrate from "@/assets/doodle-celebrate.png";
import doodleGovernment from "@/assets/doodle-government.png";
import doodleStrength from "@/assets/doodle-strength.png";
import logoHouse from "@/assets/logo-house.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }
  })
};

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToSimulator = () => navigate("/simulador");

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between h-14 px-4 sm:px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src={logoHouse} alt="Tu camino a casa" className="h-8 w-8 object-contain" />
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

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container max-w-5xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5">
                Tu primera casa{" "}
                <br className="hidden sm:block" />
                <span className="gradient-text">empieza con un plan</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed mb-8">
                Descubre cuánto necesitas ahorrar, qué ayudas públicas puedes aprovechar y cuándo podrías comprar tu primera vivienda.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button
                  size="lg"
                  className="rounded-full font-bold text-base px-8 h-12 shadow-lg shadow-primary/20"
                  onClick={goToSimulator}>
                  
                  Crear mi plan de compra <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-3">
                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Gratis</span>
                <span>·</span>
                <span>Anónimo</span>
                <span>·</span>
                <span>Sin email ni teléfono</span>
              </p>
            </motion.div>

            {/* Hero visual — mock dashboard preview */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="relative hidden lg:block">
              
              <div className="rounded-2xl border border-border bg-card shadow-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-destructive/50" />
                  <div className="h-3 w-3 rounded-full bg-warning/50" />
                  <div className="h-3 w-3 rounded-full bg-success/50" />
                  <span className="ml-2 text-[10px] font-mono text-muted-foreground">tucaminoacasa.app/resultados</span>
                </div>
                {/* Mock stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                  { label: "Tiempo estimado", value: "5 años", icon: Clock },
                  { label: "Progreso", value: "35%", icon: Target },
                  { label: "Ayudas elegibles", value: "3", icon: Sparkles }].
                  map((s, i) =>
                  <div key={i} className="rounded-xl bg-muted/50 border border-border p-3">
                      <s.icon className="h-3.5 w-3.5 text-primary mb-1.5" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                      <p className="text-lg font-extrabold" style={{ fontFamily: "'Space Mono', monospace" }}>{s.value}</p>
                    </div>
                  )}
                </div>
                {/* Mock progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                    <span>Progreso hacia la entrada</span>
                    <span>35%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: "35%" }} />
                  </div>
                </div>
                {/* Mock timeline */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) =>
                  <div key={n} className={`flex-1 h-1.5 rounded-full ${n <= 2 ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl bg-primary/10 -z-10 rotate-6" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT PREVIEW ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Así se verá tu plan de compra</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Obtén una estimación clara del tiempo que necesitas para comprar tu vivienda, teniendo en cuenta tu ahorro, ingresos, precio de vivienda y ayudas públicas de tu comunidad.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={1}
          className="rounded-2xl border border-border bg-card shadow-lg p-6 sm:p-8">
            
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
              { label: "Precio estimado", value: "220.000 €" },
              { label: "Entrada necesaria", value: "54.000 €" },
              { label: "Ahorros actuales", value: "18.000 €" }].
              map((item, i) =>
              <div key={i} className="rounded-xl bg-muted/50 border border-border p-4 text-center">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-xl font-extrabold" style={{ fontFamily: "'Space Mono', monospace" }}>{item.value}</p>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Tiempo estimado para comprar tu casa</p>
              <p className="text-3xl sm:text-4xl font-extrabold gradient-text">~5 años</p>
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VALUE PROPOSITIONS ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">¿Qué incluye tu plan?</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
            {
              icon: doodleSearch,
              title: "Gratis y sin fricción",
              desc: "No pedimos datos personales. Solo responde unas preguntas de forma anónima y obtén tu plan."
            },
            {
              icon: doodleGovernment,
              title: "Ayudas públicas incluidas",
              desc: "Calculamos automáticamente subvenciones y beneficios fiscales según tu comunidad, edad y situación familiar."
            },
            {
              icon: doodleChart,
              title: "Plan de ahorro claro",
              desc: "Descubre cuánto necesitas ahorrar, cuánto te falta y cuánto tardarías en llegar."
            },
            {
              icon: doodleTarget,
              title: "Seguimiento opcional",
              desc: "Crea una cuenta para convertir tu plan en un tracker de ahorro y seguir tu progreso hacia la compra."
            }].
            map((card, i) =>
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="glow-card h-full border-border">
                  <CardContent className="p-5 flex flex-col items-start gap-3">
                    <img src={card.icon} alt="" className="h-12 w-12 object-contain" />
                    <h3 className="font-extrabold text-sm">{card.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Tu plan en menos de 2 minutos</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
            {
              step: "01",
              icon: doodleSearch,
              title: "Cuéntanos tu situación",
              desc: "Edad, ahorro actual, ingresos y tipo de vivienda que buscas."
            },
            {
              step: "02",
              icon: doodleGovernment,
              title: "Calculamos ayudas y financiación",
              desc: "Incluimos ayudas públicas y capacidad hipotecaria estimada."
            },
            {
              step: "03",
              icon: doodleCelebrate,
              title: "Obtén tu plan de compra",
              desc: "Descubre cuánto te falta y cuándo podrías comprar."
            }].
            map((s, i) =>
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            className="text-center">
              
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <img src={s.icon} alt="" className="h-10 w-10 object-contain" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{s.step}</span>
                <h3 className="font-extrabold text-sm mt-1 mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            )}
          </div>
          <div className="text-center">
            <Button
              size="lg"
              className="rounded-full font-bold text-base px-8 h-12 shadow-lg shadow-primary/20"
              onClick={goToSimulator}>
              
              Calcular mi plan <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── TRUST ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0}>
            <img src={doodleStrength} alt="" className="h-16 w-16 mx-auto mb-5 object-contain" />
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
              Miles de personas quieren comprar su primera vivienda, pero no saben por dónde empezar.
              <br />
              <span className="text-foreground font-semibold">Este plan te ayuda a tener claridad</span> antes de hablar con un banco o una inmobiliaria.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-semibold">
              {[
              "No pedimos datos bancarios",
              "No guardamos información personal",
              "Puedes usarlo gratis"].
              map((t, i) =>
              <span key={i} className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-4 w-4" /> {t}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Empieza hoy tu camino hacia{" "}
              <span className="gradient-text">tu primera casa</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base">
              Solo necesitas 2 minutos para obtener tu estimación.
            </p>
            <Button
              size="lg"
              className="rounded-full font-bold text-base px-10 h-12 shadow-lg shadow-primary/20"
              onClick={goToSimulator}>
              
              Crear mi plan de compra <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoHouse} alt="Tu camino a casa" className="h-6 w-6 object-contain" />
            <span className="font-bold text-sm">Tu camino a casa</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>© 2026 Tu camino a casa · España</span>
            <span>·</span>
            <a href="/terminos" className="underline hover:text-primary transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </div>);

};

export default Landing;