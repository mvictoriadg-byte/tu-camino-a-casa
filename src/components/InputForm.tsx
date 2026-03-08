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
import { cityData, type UserProfile, type CoBuyer } from "@/lib/housing-data";
import {
  Euro, PiggyBank, TrendingUp, Ruler, BedDouble, MapPin, Wrench,
  Building2, User, Briefcase, CreditCard, Users, Percent, ArrowRight,
} from "lucide-react";
import illustrationPersonal from "@/assets/illustration-personal.png";
import illustrationFinance from "@/assets/illustration-finance.png";
import illustrationHousing from "@/assets/illustration-housing.png";
import illustrationMortgage from "@/assets/illustration-mortgage.png";

interface InputFormProps {
  onCalculate: (profile: UserProfile) => void;
}

const InputForm = ({ onCalculate }: InputFormProps) => {
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [monthlyDebts, setMonthlyDebts] = useState("");
  const [numBuyers, setNumBuyers] = useState("1");
  const [coBuyers, setCoBuyers] = useState<{ income: string; savings: string; monthlySavings: string; monthlyDebts: string }[]>([]);
  const [propertyType, setPropertyType] = useState("");
  const [size, setSize] = useState(70);
  const [rooms, setRooms] = useState("");
  const [zone, setZone] = useState("");
  const [reformState, setReformState] = useState("");
  const [mortgagePercent, setMortgagePercent] = useState(80);
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
    if (!city) e.city = "Campo obligatorio";
    if (!age) e.age = "Campo obligatorio";
    if (!employmentStatus) e.employmentStatus = "Campo obligatorio";
    if (!income) e.income = "Campo obligatorio";
    if (!savings) e.savings = "Campo obligatorio";
    if (!monthlySavings) e.monthlySavings = "Campo obligatorio";
    if (!propertyType) e.propertyType = "Campo obligatorio";
    if (!rooms) e.rooms = "Campo obligatorio";
    if (!zone) e.zone = "Campo obligatorio";
    if (!reformState) e.reformState = "Campo obligatorio";
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

    onCalculate({
      city, age: Number(age), employmentStatus, monthlyIncome: Number(income),
      savings: Number(savings), monthlySavings: Number(monthlySavings),
      monthlyDebts: Number(monthlyDebts) || 0,
      preferences: { propertyType, size: String(size), rooms, zone, reformState },
      numBuyers: Number(numBuyers), coBuyers: parsedCoBuyers, mortgagePercent,
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

  const SectionHeader = ({ title, subtitle, illustration }: { title: string; subtitle: string; illustration: string }) => (
    <div className="flex items-center gap-3 mb-4">
      <img src={illustration} alt="" className="h-12 w-12 object-contain" />
      <div>
        <h3 className="text-base font-extrabold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SECTION 1: Personal */}
        <Card className="glow-card">
          <CardContent className="p-5">
            <SectionHeader title="Información personal" subtitle="Cuéntanos sobre ti y tu grupo" illustration={illustrationPersonal} />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={MapPin}>Ciudad</FieldLabel>
                  <Select value={city} onValueChange={v => { setCity(v); if (submitted) validate(); }}>
                    <SelectTrigger className={`rounded-xl ${fieldBorder("city")}`}><SelectValue placeholder="Ciudad" /></SelectTrigger>
                    <SelectContent>{Object.entries(cityData).map(([key, data]) => <SelectItem key={key} value={key}>{data.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldError field="city" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={User}>Edad</FieldLabel>
                  <Input type="number" placeholder="p.ej. 28" value={age} onChange={e => setAge(e.target.value)} min={18} max={70} className={`rounded-xl ${fieldBorder("age")}`} />
                  <FieldError field="age" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={Briefcase}>Situación laboral</FieldLabel>
                  <Select value={employmentStatus} onValueChange={v => { setEmploymentStatus(v); if (submitted) validate(); }}>
                    <SelectTrigger className={`rounded-xl ${fieldBorder("employmentStatus")}`}><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empleado">Empleado</SelectItem>
                      <SelectItem value="autonomo">Autónomo</SelectItem>
                      <SelectItem value="funcionario">Funcionario</SelectItem>
                      <SelectItem value="temporal">Temporal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError field="employmentStatus" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={Users}>Nº compradores</FieldLabel>
                  <Select value={numBuyers} onValueChange={handleNumBuyersChange}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 persona</SelectItem>
                      <SelectItem value="2">2 personas</SelectItem>
                      <SelectItem value="3">3 personas</SelectItem>
                      <SelectItem value="4">4 personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Finances */}
        <Card className="glow-card">
          <CardContent className="p-5">
            <SectionHeader title="Situación financiera" subtitle="Tus ingresos, ahorros y deudas" illustration={illustrationFinance} />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <FieldLabel icon={Euro}>Ingresos netos mensuales (€)</FieldLabel>
                <Input type="number" placeholder="p.ej. 2500" value={income} onChange={e => setIncome(e.target.value)} min={0} className={`rounded-xl ${fieldBorder("income")}`} />
                <FieldError field="income" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={PiggyBank}>Ahorros actuales (€)</FieldLabel>
                  <Input type="number" placeholder="p.ej. 30000" value={savings} onChange={e => setSavings(e.target.value)} min={0} className={`rounded-xl ${fieldBorder("savings")}`} />
                  <FieldError field="savings" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={TrendingUp}>Ahorro/mes (€)</FieldLabel>
                  <Input type="number" placeholder="p.ej. 800" value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} min={0} className={`rounded-xl ${fieldBorder("monthlySavings")}`} />
                  <FieldError field="monthlySavings" />
                </div>
              </div>
              <div className="space-y-1.5">
                <FieldLabel icon={CreditCard}>Deudas mensuales (€, opcional)</FieldLabel>
                <Input type="number" placeholder="p.ej. 200" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} min={0} className="rounded-xl" />
              </div>

              {coBuyers.map((cb, i) => (
                <div key={i} className="border-t border-border pt-4 mt-4">
                  <p className="text-sm font-bold flex items-center gap-1.5 mb-3"><Users className="h-3.5 w-3.5 text-muted-foreground" /> Comprador {i + 2}</p>
                  <div className="space-y-3">
                    <div className="space-y-1.5"><FieldLabel icon={Euro}>Ingresos mensuales (€)</FieldLabel><Input type="number" placeholder="p.ej. 2000" value={cb.income} onChange={e => updateCoBuyer(i, "income", e.target.value)} min={0} className="rounded-xl" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><FieldLabel icon={PiggyBank}>Ahorros (€)</FieldLabel><Input type="number" placeholder="p.ej. 15000" value={cb.savings} onChange={e => updateCoBuyer(i, "savings", e.target.value)} min={0} className="rounded-xl" /></div>
                      <div className="space-y-1.5"><FieldLabel icon={TrendingUp}>Ahorro/mes (€)</FieldLabel><Input type="number" placeholder="p.ej. 500" value={cb.monthlySavings} onChange={e => updateCoBuyer(i, "monthlySavings", e.target.value)} min={0} className="rounded-xl" /></div>
                    </div>
                    <div className="space-y-1.5"><FieldLabel icon={CreditCard}>Deudas (€)</FieldLabel><Input type="number" placeholder="p.ej. 100" value={cb.monthlyDebts} onChange={e => updateCoBuyer(i, "monthlyDebts", e.target.value)} min={0} className="rounded-xl" /></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Housing */}
        <Card className="glow-card">
          <CardContent className="p-5">
            <SectionHeader title="Preferencias de vivienda" subtitle="¿Cómo imaginas tu casa ideal?" illustration={illustrationHousing} />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <FieldLabel icon={Building2}>Tipo de propiedad</FieldLabel>
                <Select value={propertyType} onValueChange={v => { setPropertyType(v); if (submitted) validate(); }}>
                  <SelectTrigger className={`rounded-xl ${fieldBorder("propertyType")}`}><SelectValue placeholder="Selecciona" /></SelectTrigger>
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
                <FieldLabel icon={Ruler}>Tamaño: {size} m²</FieldLabel>
                <Slider value={[size]} onValueChange={v => setSize(v[0])} min={30} max={200} step={10} className="mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>30 m²</span><span>200 m²</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={BedDouble}>Habitaciones</FieldLabel>
                  <Select value={rooms} onValueChange={v => { setRooms(v); if (submitted) validate(); }}>
                    <SelectTrigger className={`rounded-xl ${fieldBorder("rooms")}`}><SelectValue placeholder="Nº" /></SelectTrigger>
                    <SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4+">4+</SelectItem></SelectContent>
                  </Select>
                  <FieldError field="rooms" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={MapPin}>Zona</FieldLabel>
                  <Select value={zone} onValueChange={v => { setZone(v); if (submitted) validate(); }}>
                    <SelectTrigger className={`rounded-xl ${fieldBorder("zone")}`}><SelectValue placeholder="Zona" /></SelectTrigger>
                    <SelectContent><SelectItem value="centro">Centro</SelectItem><SelectItem value="metropolitana">Metropolitana</SelectItem><SelectItem value="periferia">Periferia</SelectItem></SelectContent>
                  </Select>
                  <FieldError field="zone" />
                </div>
              </div>
              <div className="space-y-1.5">
                <FieldLabel icon={Wrench}>Estado de reforma</FieldLabel>
                <Select value={reformState} onValueChange={v => { setReformState(v); if (submitted) validate(); }}>
                  <SelectTrigger className={`rounded-xl ${fieldBorder("reformState")}`}><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent><SelectItem value="listo-para-entrar">Listo para entrar</SelectItem><SelectItem value="pequena-reforma">Pequeña reforma</SelectItem><SelectItem value="reforma-completa">Reforma completa</SelectItem></SelectContent>
                </Select>
                <FieldError field="reformState" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: Financing */}
        <Card className="glow-card">
          <CardContent className="p-5">
            <SectionHeader title="Financiación" subtitle="Configura tu hipoteca ideal" illustration={illustrationMortgage} />
            <div className="space-y-1.5">
              <FieldLabel icon={Percent}>Porcentaje a hipotecar: {mortgagePercent}%</FieldLabel>
              <Slider value={[mortgagePercent]} onValueChange={v => setMortgagePercent(v[0])} min={50} max={90} step={5} className="mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>50%</span><span>90%</span></div>
              <p className="text-xs text-muted-foreground">Entrada necesaria: {100 - mortgagePercent}% del valor</p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full rounded-full font-bold text-base h-12">
          Calcular mi plan <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </motion.div>
  );
};

export default InputForm;