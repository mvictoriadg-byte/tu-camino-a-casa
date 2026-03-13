import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { type UserProfile, type CoBuyer } from "@/lib/housing-data";
import { useLocationPrices } from "@/hooks/use-location-prices";
import { Switch } from "@/components/ui/switch";
import {
  Euro, PiggyBank, TrendingUp, Ruler, BedDouble, MapPin,
  Building2, User, CreditCard, Users, Percent, ArrowRight, Loader2, Home,
} from "lucide-react";
import illustrationPersonal from "@/assets/illustration-personal.png";
import illustrationFinance from "@/assets/illustration-finance.png";
import illustrationHousing from "@/assets/illustration-housing.png";
import illustrationMortgage from "@/assets/illustration-mortgage.png";

interface InputFormProps {
  onCalculate: (profile: UserProfile) => void;
  isCalculating?: boolean;
  initialValues?: Partial<UserProfile>;
  submitLabel?: string;
  hideFooterNote?: boolean;
}

const InputForm = ({ onCalculate, isCalculating, initialValues, submitLabel, hideFooterNote }: InputFormProps) => {
  const iv = initialValues;
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
  const [reformState] = useState(iv?.preferences?.reformState || "listo-para-entrar");
  const [mortgagePercent, setMortgagePercent] = useState(iv?.mortgagePercent || 80);
  const [firstHome, setFirstHome] = useState(iv?.firstHome !== undefined ? iv.firstHome : true);
  const [numberOfChildren, setNumberOfChildren] = useState(iv?.numberOfChildren !== undefined ? String(iv.numberOfChildren) : "0");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!comunidad) e.comunidad = "Campo obligatorio";
    if (!age) e.age = "Campo obligatorio";
    
    if (!income) e.income = "Campo obligatorio";
    if (!savings) e.savings = "Campo obligatorio";
    if (!monthlySavings) e.monthlySavings = "Campo obligatorio";
    if (!propertyType) e.propertyType = "Campo obligatorio";
    if (!rooms) e.rooms = "Campo obligatorio";
    if (!zone) e.zone = "Campo obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

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
    submitted && errors[field] ? <p className="text-xs text-destructive mt-1 font-medium">{errors[field]}</p> : null
  );
  const fieldBorder = (field: string) => submitted && errors[field] ? "border-destructive ring-destructive/20 ring-2" : "";

  const FieldLabel = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <Label className="text-sm font-semibold flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />{children}
    </Label>
  );

  const SectionHeader = ({ title, subtitle, illustration, step }: { title: string; subtitle: string; illustration: string; step: number }) => (
    <div className="flex items-center gap-3 mb-5">
      <img src={illustration} alt="" className="h-12 w-12 object-contain" />
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-0.5">Paso {step} de 4</p>
        <h3 className="text-base font-extrabold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-5">
        <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
          📋 Vamos paso a paso
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Rellena tu información para crear tu plan personalizado.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* SECTION 1: Personal */}
        <Card className="glow-card">
          <CardContent className="p-5 sm:p-6">
            <SectionHeader title="Sobre ti" subtitle="Cuéntanos un poco sobre ti" illustration={illustrationPersonal} step={1} />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <FieldLabel icon={MapPin}>Comunidad Autónoma</FieldLabel>
                  <Select value={comunidad} onValueChange={v => { setComunidad(v); setCiudad(""); setCity(v); if (submitted) validate(); }}>
                    <SelectTrigger className={`rounded-xl ${fieldBorder("comunidad")}`}><SelectValue placeholder="Elige tu comunidad" /></SelectTrigger>
                    <SelectContent>{comunidades.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldError field="comunidad" />
                </div>
                {comunidad && getCiudades(comunidad).length > 0 && (
                  <div className="space-y-1.5 col-span-2">
                    <FieldLabel icon={Building2}>Ciudad <span className="text-muted-foreground font-normal">(opcional)</span></FieldLabel>
                    <Select value={ciudad || "__comunidad_avg__"} onValueChange={v => { const val = v === "__comunidad_avg__" ? "" : v; setCiudad(val); setCity(val || comunidad); }}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Precio promedio en la comunidad" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__comunidad_avg__">Precio promedio en {comunidad}</SelectItem>
                        {getCiudades(comunidad).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-1.5">
                  <FieldLabel icon={User}>¿Cuántos años tienes?</FieldLabel>
                  <Input type="number" placeholder="Ej: 28" value={age} onChange={e => setAge(e.target.value)} min={18} max={70} className={`rounded-xl ${fieldBorder("age")}`} />
                  <FieldError field="age" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={Users}>¿Compráis juntos?</FieldLabel>
                  <Select value={numBuyers} onValueChange={handleNumBuyersChange}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Solo yo</SelectItem>
                      <SelectItem value="2">2 personas</SelectItem>
                      <SelectItem value="3">3 personas</SelectItem>
                      <SelectItem value="4">4 personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={Users}>¿Tienes hijos?</FieldLabel>
                  <Select value={numberOfChildren} onValueChange={setNumberOfChildren}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No tengo hijos</SelectItem>
                      <SelectItem value="1">1 hijo</SelectItem>
                      <SelectItem value="2">2 hijos</SelectItem>
                      <SelectItem value="3">3 hijos</SelectItem>
                      <SelectItem value="4">4 o más hijos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border h-full">
                  <div>
                    <FieldLabel icon={Home}>¿Primera vivienda?</FieldLabel>
                  </div>
                  <Switch checked={firstHome} onCheckedChange={setFirstHome} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Finances */}
        <Card className="glow-card">
          <CardContent className="p-5 sm:p-6">
            <SectionHeader title="Tu economía" subtitle="Para calcular tu capacidad de compra" illustration={illustrationFinance} step={2} />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <FieldLabel icon={Euro}>¿Cuánto ganas al mes? (neto)</FieldLabel>
                <Input type="number" placeholder="Ej: 2.500 €" value={income} onChange={e => setIncome(e.target.value)} min={0} className={`rounded-xl ${fieldBorder("income")}`} />
                <FieldError field="income" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={PiggyBank}>¿Cuánto tienes ahorrado?</FieldLabel>
                  <Input type="number" placeholder="Ej: 30.000 €" value={savings} onChange={e => setSavings(e.target.value)} min={0} className={`rounded-xl ${fieldBorder("savings")}`} />
                  <FieldError field="savings" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={TrendingUp}>¿Cuánto ahorras al mes?</FieldLabel>
                  <Input type="number" placeholder="Ej: 800 €" value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} min={0} className={`rounded-xl ${fieldBorder("monthlySavings")}`} />
                  <FieldError field="monthlySavings" />
                </div>
              </div>
              <div className="space-y-1.5">
                <FieldLabel icon={CreditCard}>¿Tienes deudas mensuales? (opcional)</FieldLabel>
                <Input type="number" placeholder="Ej: 200 € (préstamos, tarjetas…)" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} min={0} className="rounded-xl" />
              </div>

              {coBuyers.map((cb, i) => (
                <div key={i} className="border-t border-border pt-4 mt-4">
                  <p className="text-sm font-bold flex items-center gap-1.5 mb-3"><Users className="h-3.5 w-3.5 text-muted-foreground" /> Comprador {i + 2}</p>
                  <div className="space-y-4">
                    <div className="space-y-1.5"><FieldLabel icon={Euro}>¿Cuánto gana al mes?</FieldLabel><Input type="number" placeholder="Ej: 2.000 €" value={cb.income} onChange={e => updateCoBuyer(i, "income", e.target.value)} min={0} className="rounded-xl" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><FieldLabel icon={PiggyBank}>Ahorros</FieldLabel><Input type="number" placeholder="Ej: 15.000 €" value={cb.savings} onChange={e => updateCoBuyer(i, "savings", e.target.value)} min={0} className="rounded-xl" /></div>
                      <div className="space-y-1.5"><FieldLabel icon={TrendingUp}>Ahorro/mes</FieldLabel><Input type="number" placeholder="Ej: 500 €" value={cb.monthlySavings} onChange={e => updateCoBuyer(i, "monthlySavings", e.target.value)} min={0} className="rounded-xl" /></div>
                    </div>
                    <div className="space-y-1.5"><FieldLabel icon={CreditCard}>Deudas mensuales</FieldLabel><Input type="number" placeholder="Ej: 100 €" value={cb.monthlyDebts} onChange={e => updateCoBuyer(i, "monthlyDebts", e.target.value)} min={0} className="rounded-xl" /></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Housing */}
        <Card className="glow-card">
          <CardContent className="p-5 sm:p-6">
            <SectionHeader title="Tu casa ideal" subtitle="¿Cómo imaginas tu futuro hogar?" illustration={illustrationHousing} step={3} />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <FieldLabel icon={Building2}>¿Qué tipo de vivienda buscas?</FieldLabel>
                <Select value={propertyType} onValueChange={v => { setPropertyType(v); if (submitted) validate(); }}>
                  <SelectTrigger className={`rounded-xl ${fieldBorder("propertyType")}`}><SelectValue placeholder="Elige un tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="obra-nueva">Obra nueva</SelectItem>
                    <SelectItem value="segunda-mano">Segunda mano</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError field="propertyType" />
              </div>
              <div className="space-y-1.5">
                <FieldLabel icon={Ruler}>¿De qué tamaño? {size} m²</FieldLabel>
                <Slider value={[size]} onValueChange={v => setSize(v[0])} min={30} max={200} step={10} className="mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>30 m²</span><span>200 m²</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={BedDouble}>¿Cuántas habitaciones?</FieldLabel>
                  <Select value={rooms} onValueChange={v => { setRooms(v); if (submitted) validate(); }}>
                    <SelectTrigger className={`rounded-xl ${fieldBorder("rooms")}`}><SelectValue placeholder="Nº" /></SelectTrigger>
                    <SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4+">4+</SelectItem></SelectContent>
                  </Select>
                  <FieldError field="rooms" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={MapPin}>¿En qué zona?</FieldLabel>
                  <Select value={zone} onValueChange={v => { setZone(v); if (submitted) validate(); }}>
                    <SelectTrigger className={`rounded-xl ${fieldBorder("zone")}`}><SelectValue placeholder="Zona" /></SelectTrigger>
                    <SelectContent><SelectItem value="centro">Centro</SelectItem><SelectItem value="metropolitana">Metropolitana</SelectItem><SelectItem value="periferia">Periferia</SelectItem></SelectContent>
                  </Select>
                  <FieldError field="zone" />
                </div>
              </div>
{/* Reform state hidden - default value used */}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: Financing */}
        <Card className="glow-card">
          <CardContent className="p-5 sm:p-6">
            <SectionHeader title="Tu hipoteca" subtitle="¿Cuánto quieres financiar?" illustration={illustrationMortgage} step={4} />
            <div className="space-y-1.5">
              <FieldLabel icon={Percent}>Porcentaje a hipotecar: {mortgagePercent}%</FieldLabel>
              <Slider value={[mortgagePercent]} onValueChange={v => setMortgagePercent(v[0])} min={50} max={100} step={5} className="mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>50%</span><span>100%</span></div>
              <p className="text-xs text-muted-foreground">Tu entrada sería el {100 - mortgagePercent}% del precio de la vivienda</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button type="submit" size="lg" className="w-full rounded-full font-bold text-base h-14 shadow-lg shadow-primary/20" disabled={isCalculating}>
            {isCalculating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creando tu plan…
              </>
            ) : (
              <>
                {submitLabel || "Calcular mi plan"} <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          {!hideFooterNote && (
            <p className="text-center text-xs text-muted-foreground">
              Es gratis y no necesitas registrarte
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default InputForm;
