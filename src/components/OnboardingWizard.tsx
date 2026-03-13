import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { type UserProfile, type CoBuyer } from "@/lib/housing-data";
import { useLocationPrices } from "@/hooks/use-location-prices";
import {
  Euro, PiggyBank, TrendingUp, Ruler, BedDouble, MapPin, Wrench,
  Building2, User, Briefcase, CreditCard, Users, Percent, ArrowRight, ArrowLeft, Loader2, Home,
} from "lucide-react";
import illustrationPersonal from "@/assets/illustration-personal.png";
import illustrationFinance from "@/assets/illustration-finance.png";
import illustrationHousing from "@/assets/illustration-housing.png";
import illustrationMortgage from "@/assets/illustration-mortgage.png";

const TOTAL_STEPS = 4;

interface OnboardingWizardProps {
  onCalculate: (profile: UserProfile) => void;
  isCalculating?: boolean;
  initialValues?: Partial<UserProfile>;
  submitLabel?: string;
}

const OnboardingWizard = ({ onCalculate, isCalculating, initialValues, submitLabel }: OnboardingWizardProps) => {
  const iv = initialValues;
  const [step, setStep] = useState(1);
  const [comunidad, setComunidad] = useState(iv?.comunidad || "");
  const [ciudad, setCiudad] = useState(iv?.ciudad || "");
  const [city, setCity] = useState(iv?.city || "");
  const { comunidades, getCiudades, getAvgPriceM2, getMortgageRate } = useLocationPrices();
  const [age, setAge] = useState(iv?.age ? String(iv.age) : "");
  const [employmentStatus] = useState(iv?.employmentStatus || "empleado");
  const [income, setIncome] = useState(iv?.monthlyIncome ? String(iv.monthlyIncome) : "");
  const [savings, setSavings] = useState(iv?.savings ? String(iv.savings) : "");
  const [monthlySavings, setMonthlySavings] = useState(iv?.monthlySavings ? String(iv.monthlySavings) : "");
  const [monthlyDebts, setMonthlyDebts] = useState(iv?.monthlyDebts ? String(iv.monthlyDebts) : "");
  const [numBuyers, setNumBuyers] = useState(iv?.numBuyers ? String(iv.numBuyers) : "1");
  const [coBuyers, setCoBuyers] = useState<{ income: string; savings: string; monthlySavings: string; monthlyDebts: string }[]>(
    iv?.coBuyers?.map(cb => ({ income: String(cb.monthlyIncome || ""), savings: String(cb.savings || ""), monthlySavings: String(cb.monthlySavings || ""), monthlyDebts: String(cb.monthlyDebts || "") })) || []
  );
  const [propertyType, setPropertyType] = useState(iv?.preferences?.propertyType || "");
  const [size, setSize] = useState(iv?.preferences?.size ? Number(iv.preferences.size) : 70);
  const [rooms, setRooms] = useState(iv?.preferences?.rooms || "");
  const [zone, setZone] = useState(iv?.preferences?.zone || "");
  const [reformState, setReformState] = useState(iv?.preferences?.reformState || "listo-para-entrar");
  const [mortgagePercent, setMortgagePercent] = useState(iv?.mortgagePercent || 80);
  const [firstHome, setFirstHome] = useState(iv?.firstHome !== undefined ? iv.firstHome : true);
  const [numberOfChildren, setNumberOfChildren] = useState(iv?.numberOfChildren !== undefined ? String(iv.numberOfChildren) : "0");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNumBuyersChange = (val: string) => {
    setNumBuyers(val);
    const n = Number(val) - 1;
    setCoBuyers(prev => {
      if (n <= 0) return [];
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill(null).map(() => ({ income: "", savings: "", monthlySavings: "", monthlyDebts: "" }))];
      return prev.slice(0, n);
    });
  };

  const updateCoBuyer = (index: number, field: string, value: string) => {
    setCoBuyers(prev => prev.map((cb, i) => i === index ? { ...cb, [field]: value } : cb));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!comunidad) e.comunidad = "Obligatorio";
      if (!age) e.age = "Obligatorio";
      if (!employmentStatus) e.employmentStatus = "Obligatorio";
    } else if (s === 2) {
      if (!income) e.income = "Obligatorio";
      if (!savings) e.savings = "Obligatorio";
      if (!monthlySavings) e.monthlySavings = "Obligatorio";
    } else if (s === 3) {
      if (!propertyType) e.propertyType = "Obligatorio";
      if (!rooms) e.rooms = "Obligatorio";
      if (!zone) e.zone = "Obligatorio";
      
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    const parsedCoBuyers: CoBuyer[] = coBuyers.map(cb => ({
      monthlyIncome: Number(cb.income) || 0, savings: Number(cb.savings) || 0,
      monthlySavings: Number(cb.monthlySavings) || 0, monthlyDebts: Number(cb.monthlyDebts) || 0,
    }));
    const avgPriceM2 = getAvgPriceM2(comunidad, ciudad || undefined);
    const mortgageRate = getMortgageRate(comunidad, ciudad || undefined);
    onCalculate({
      city: ciudad || comunidad, comunidad, ciudad: ciudad || undefined,
      age: Number(age), employmentStatus, monthlyIncome: Number(income),
      savings: Number(savings), monthlySavings: Number(monthlySavings),
      monthlyDebts: Number(monthlyDebts) || 0,
      preferences: { propertyType, size: String(size), rooms, zone, reformState },
      numBuyers: Number(numBuyers), coBuyers: parsedCoBuyers, mortgagePercent,
      firstHome, numberOfChildren: Number(numberOfChildren) || 0,
      avgPricePerSqm: avgPriceM2, mortgageRate,
    });
  };

  const FieldError = ({ field }: { field: string }) => (
    errors[field] ? <p className="text-xs text-destructive mt-1 font-medium">{errors[field]}</p> : null
  );
  const fieldBorder = (field: string) => errors[field] ? "border-destructive ring-destructive/20 ring-2" : "";

  const FieldLabel = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <Label className="text-sm font-semibold flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />{children}
    </Label>
  );

  const stepConfig = [
    { title: "Sobre ti", subtitle: "Cuéntanos un poco sobre ti", illustration: illustrationPersonal, emoji: "👋" },
    { title: "Tu economía", subtitle: "Para calcular tu capacidad de compra", illustration: illustrationFinance, emoji: "💰" },
    { title: "Tu casa ideal", subtitle: "¿Cómo imaginas tu futuro hogar?", illustration: illustrationHousing, emoji: "🏡" },
    { title: "Tu hipoteca", subtitle: "¿Cuánto quieres financiar?", illustration: illustrationMortgage, emoji: "🏦" },
  ];

  const current = stepConfig[step - 1];
  const progressValue = (step / TOTAL_STEPS) * 100;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const handleNext = () => { setDirection(1); goNext(); };
  const handleBack = () => { setDirection(-1); goBack(); };

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-muted-foreground">Paso {step} de {TOTAL_STEPS}</span>
          <span className="text-xs text-muted-foreground">{Math.round(progressValue)}% completado</span>
        </div>
        <Progress value={progressValue} className="h-2 rounded-full" />
      </div>

      {/* Step header */}
      <motion.div
        key={`header-${step}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 sm:py-10"
      >
        <img src={current.illustration} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">{current.title}</h2>
        <p className="text-sm text-muted-foreground">{current.subtitle}</p>
      </motion.div>

      {/* Step content */}
      <div className="flex-1 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <FieldLabel icon={MapPin}>Comunidad Autónoma</FieldLabel>
                  <Select value={comunidad} onValueChange={(v) => { setComunidad(v); setCiudad(""); setCity(v); }}>
                    <SelectTrigger className={`rounded-xl h-12 text-base ${fieldBorder("comunidad")}`}><SelectValue placeholder="Elige tu comunidad" /></SelectTrigger>
                    <SelectContent>{comunidades.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldError field="comunidad" />
                </div>
                {comunidad && getCiudades(comunidad).length > 0 && (
                  <div className="space-y-2">
                    <FieldLabel icon={Building2}>Ciudad <span className="text-muted-foreground font-normal">(opcional)</span></FieldLabel>
                    <Select value={ciudad || "__comunidad_avg__"} onValueChange={(v) => { const val = v === "__comunidad_avg__" ? "" : v; setCiudad(val); setCity(val || comunidad); }}>
                      <SelectTrigger className="rounded-xl h-12 text-base"><SelectValue placeholder="Usa media de la comunidad" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__comunidad_avg__">Media de {comunidad}</SelectItem>
                        {getCiudades(comunidad).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <FieldLabel icon={User}>¿Cuántos años tienes?</FieldLabel>
                  <Input type="number" placeholder="Ej: 28" value={age} onChange={e => setAge(e.target.value)} min={18} max={70} className={`rounded-xl h-12 text-base ${fieldBorder("age")}`} />
                  <FieldError field="age" />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={Briefcase}>¿En qué trabajas?</FieldLabel>
                  <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                    <SelectTrigger className={`rounded-xl h-12 text-base ${fieldBorder("employmentStatus")}`}><SelectValue placeholder="Tu situación laboral" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empleado">Empleado/a</SelectItem>
                      <SelectItem value="autonomo">Autónomo/a</SelectItem>
                      <SelectItem value="funcionario">Funcionario/a</SelectItem>
                      <SelectItem value="temporal">Contrato temporal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError field="employmentStatus" />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={Users}>¿Compráis juntos?</FieldLabel>
                  <Select value={numBuyers} onValueChange={handleNumBuyersChange}>
                    <SelectTrigger className="rounded-xl h-12 text-base"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Solo yo</SelectItem>
                      <SelectItem value="2">2 personas</SelectItem>
                      <SelectItem value="3">3 personas</SelectItem>
                      <SelectItem value="4">4 personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={Users}>¿Tienes hijos?</FieldLabel>
                  <Select value={numberOfChildren} onValueChange={setNumberOfChildren}>
                    <SelectTrigger className="rounded-xl h-12 text-base"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No tengo hijos</SelectItem>
                      <SelectItem value="1">1 hijo</SelectItem>
                      <SelectItem value="2">2 hijos</SelectItem>
                      <SelectItem value="3">3 hijos</SelectItem>
                      <SelectItem value="4">4 o más hijos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                {Number(numBuyers) > 1 && (
                  <p className="text-sm font-bold flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /> Comprador 1 (tú)</p>
                )}
                <div className="space-y-2">
                  <FieldLabel icon={Euro}>¿Cuánto ganas al mes? (neto)</FieldLabel>
                  <Input type="number" placeholder="Ej: 2.500 €" value={income} onChange={e => setIncome(e.target.value)} min={0} className={`rounded-xl h-12 text-base ${fieldBorder("income")}`} />
                  <FieldError field="income" />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={PiggyBank}>¿Cuánto tienes ahorrado?</FieldLabel>
                  <Input type="number" placeholder="Ej: 30.000 €" value={savings} onChange={e => setSavings(e.target.value)} min={0} className={`rounded-xl h-12 text-base ${fieldBorder("savings")}`} />
                  <FieldError field="savings" />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={TrendingUp}>¿Cuánto ahorras al mes?</FieldLabel>
                  <Input type="number" placeholder="Ej: 800 €" value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} min={0} className={`rounded-xl h-12 text-base ${fieldBorder("monthlySavings")}`} />
                  <FieldError field="monthlySavings" />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={CreditCard}>¿Tienes deudas mensuales? (opcional)</FieldLabel>
                  <Input type="number" placeholder="Ej: 200 € (préstamos, tarjetas…)" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} min={0} className="rounded-xl h-12 text-base" />
                </div>

                {coBuyers.map((cb, i) => (
                  <div key={i} className="border-t border-border pt-5 mt-5">
                    <p className="text-sm font-bold flex items-center gap-1.5 mb-4"><Users className="h-3.5 w-3.5 text-muted-foreground" /> Comprador {i + 2}</p>
                    <div className="space-y-4">
                      <div className="space-y-2"><FieldLabel icon={Euro}>¿Cuánto gana al mes?</FieldLabel><Input type="number" placeholder="Ej: 2.000 €" value={cb.income} onChange={e => updateCoBuyer(i, "income", e.target.value)} min={0} className="rounded-xl h-12 text-base" /></div>
                      <div className="space-y-2"><FieldLabel icon={PiggyBank}>Ahorros</FieldLabel><Input type="number" placeholder="Ej: 15.000 €" value={cb.savings} onChange={e => updateCoBuyer(i, "savings", e.target.value)} min={0} className="rounded-xl h-12 text-base" /></div>
                      <div className="space-y-2"><FieldLabel icon={TrendingUp}>Ahorro/mes</FieldLabel><Input type="number" placeholder="Ej: 500 €" value={cb.monthlySavings} onChange={e => updateCoBuyer(i, "monthlySavings", e.target.value)} min={0} className="rounded-xl h-12 text-base" /></div>
                      <div className="space-y-2"><FieldLabel icon={CreditCard}>Deudas mensuales</FieldLabel><Input type="number" placeholder="Ej: 100 €" value={cb.monthlyDebts} onChange={e => updateCoBuyer(i, "monthlyDebts", e.target.value)} min={0} className="rounded-xl h-12 text-base" /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <FieldLabel icon={Building2}>¿Qué tipo de vivienda buscas?</FieldLabel>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className={`rounded-xl h-12 text-base ${fieldBorder("propertyType")}`}><SelectValue placeholder="Elige un tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="obra-nueva">Obra nueva</SelectItem>
                      <SelectItem value="segunda-mano">Segunda mano</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError field="propertyType" />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={Ruler}>¿De qué tamaño? <span className="font-mono text-foreground ml-1">{size} m²</span></FieldLabel>
                  <Slider value={[size]} onValueChange={v => setSize(v[0])} min={30} max={200} step={10} className="mt-3" />
                  <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>30 m²</span><span>200 m²</span></div>
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={BedDouble}>¿Cuántas habitaciones?</FieldLabel>
                  <Select value={rooms} onValueChange={setRooms}>
                    <SelectTrigger className={`rounded-xl h-12 text-base ${fieldBorder("rooms")}`}><SelectValue placeholder="Nº habitaciones" /></SelectTrigger>
                    <SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4+">4+</SelectItem></SelectContent>
                  </Select>
                  <FieldError field="rooms" />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={MapPin}>¿En qué zona?</FieldLabel>
                  <Select value={zone} onValueChange={setZone}>
                    <SelectTrigger className={`rounded-xl h-12 text-base ${fieldBorder("zone")}`}><SelectValue placeholder="Zona preferida" /></SelectTrigger>
                    <SelectContent><SelectItem value="centro">Centro</SelectItem><SelectItem value="metropolitana">Metropolitana</SelectItem><SelectItem value="periferia">Periferia</SelectItem></SelectContent>
                  </Select>
                  <FieldError field="zone" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/60 border border-border">
                  <div>
                    <FieldLabel icon={Home}>¿Es tu primera vivienda?</FieldLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">Necesario para acceder a ayudas públicas</p>
                  </div>
                  <Switch checked={firstHome} onCheckedChange={setFirstHome} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <FieldLabel icon={Percent}>Porcentaje a hipotecar: <span className="font-mono text-foreground ml-1">{mortgagePercent}%</span></FieldLabel>
                  <Slider value={[mortgagePercent]} onValueChange={v => setMortgagePercent(v[0])} min={50} max={100} step={5} className="mt-3" />
                  <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>50%</span><span>100%</span></div>
                </div>
                <div className="rounded-2xl bg-muted/60 p-5 text-center">
                  <p className="text-sm text-muted-foreground">Tu entrada sería el</p>
                  <p className="text-4xl font-extrabold tracking-tight my-2">{100 - mortgagePercent}%</p>
                  <p className="text-sm text-muted-foreground">del precio de la vivienda</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 max-w-lg mx-auto w-full">
        <div className="flex gap-3">
          {step > 1 && (
            <Button type="button" variant="outline" size="lg" className="rounded-full font-bold h-14 px-6" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Atrás
            </Button>
          )}
          <Button
            type="button"
            size="lg"
            className="rounded-full font-bold text-base h-14 flex-1 shadow-lg shadow-primary/20"
            onClick={handleNext}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creando tu plan…</>
            ) : step === TOTAL_STEPS ? (
              <>{submitLabel || "Ver mi plan"} <ArrowRight className="h-4 w-4 ml-2" /></>
            ) : (
              <>Siguiente <ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </div>
        {step === 1 && (
          <p className="text-center text-xs text-muted-foreground mt-3">⏱ Solo te llevará 1 minuto · Es gratis</p>
        )}
        {step === TOTAL_STEPS && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            Al enviar tus datos, aceptas nuestros{" "}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">
              Términos y Condiciones
            </a>{" "}
            y la{" "}
            <a href="/terminos#proteccion-datos" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">
              Política de Protección de Datos
            </a>{" "}
            conforme al RGPD (UE) y la LOPDGDD (España).
          </p>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
