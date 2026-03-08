import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cityData, type UserProfile, type CoBuyer } from "@/lib/housing-data";
import {
  Home, Euro, PiggyBank, TrendingUp, Ruler, BedDouble, MapPin, Wrench,
  Building2, User, Briefcase, CreditCard, Users, Percent,
} from "lucide-react";

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
    submitted && errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null
  );

  const fieldBorder = (field: string) => submitted && errors[field] ? "border-destructive" : "";

  const SectionTitle = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <div className="border-t border-border pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
      <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-3 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />{children}
      </p>
    </div>
  );

  const FieldLabel = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5" />{children}
    </Label>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> Tu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <SectionTitle icon={User}>Datos personales</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel icon={MapPin}>Ciudad</FieldLabel>
                <Select value={city} onValueChange={v => { setCity(v); if (submitted) validate(); }}>
                  <SelectTrigger className={fieldBorder("city")}><SelectValue placeholder="Ciudad" /></SelectTrigger>
                  <SelectContent>{Object.entries(cityData).map(([key, data]) => <SelectItem key={key} value={key}>{data.name}</SelectItem>)}</SelectContent>
                </Select>
                <FieldError field="city" />
              </div>
              <div className="space-y-2">
                <FieldLabel icon={User}>Edad</FieldLabel>
                <Input type="number" placeholder="p.ej. 28" value={age} onChange={e => setAge(e.target.value)} min={18} max={70} className={fieldBorder("age")} />
                <FieldError field="age" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel icon={Briefcase}>Situación laboral</FieldLabel>
                <Select value={employmentStatus} onValueChange={v => { setEmploymentStatus(v); if (submitted) validate(); }}>
                  <SelectTrigger className={fieldBorder("employmentStatus")}><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empleado">Empleado por cuenta ajena</SelectItem>
                    <SelectItem value="autonomo">Autónomo / freelance</SelectItem>
                    <SelectItem value="funcionario">Funcionario</SelectItem>
                    <SelectItem value="temporal">Contrato temporal</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError field="employmentStatus" />
              </div>
              <div className="space-y-2">
                <FieldLabel icon={Users}>Nº compradores</FieldLabel>
                <Select value={numBuyers} onValueChange={handleNumBuyersChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 persona</SelectItem>
                    <SelectItem value="2">2 personas</SelectItem>
                    <SelectItem value="3">3 personas</SelectItem>
                    <SelectItem value="4">4 personas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SectionTitle icon={Euro}>Tu situación financiera</SectionTitle>
            <div className="space-y-2">
              <FieldLabel icon={Euro}>Tus ingresos netos mensuales (€)</FieldLabel>
              <Input type="number" placeholder="p.ej. 2500" value={income} onChange={e => setIncome(e.target.value)} min={0} className={fieldBorder("income")} />
              <FieldError field="income" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel icon={PiggyBank}>Tus ahorros (€)</FieldLabel>
                <Input type="number" placeholder="p.ej. 30000" value={savings} onChange={e => setSavings(e.target.value)} min={0} className={fieldBorder("savings")} />
                <FieldError field="savings" />
              </div>
              <div className="space-y-2">
                <FieldLabel icon={TrendingUp}>Tu ahorro/mes (€)</FieldLabel>
                <Input type="number" placeholder="p.ej. 800" value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} min={0} className={fieldBorder("monthlySavings")} />
                <FieldError field="monthlySavings" />
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel icon={CreditCard}>Tus deudas mensuales (€, opcional)</FieldLabel>
              <Input type="number" placeholder="p.ej. 200" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} min={0} />
            </div>

            {coBuyers.map((cb, i) => (
              <div key={i}>
                <SectionTitle icon={Users}>{`Comprador ${i + 2}`}</SectionTitle>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <FieldLabel icon={Euro}>Ingresos netos mensuales (€)</FieldLabel>
                    <Input type="number" placeholder="p.ej. 2000" value={cb.income} onChange={e => updateCoBuyer(i, "income", e.target.value)} min={0} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <FieldLabel icon={PiggyBank}>Ahorros (€)</FieldLabel>
                      <Input type="number" placeholder="p.ej. 15000" value={cb.savings} onChange={e => updateCoBuyer(i, "savings", e.target.value)} min={0} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel icon={TrendingUp}>Ahorro/mes (€)</FieldLabel>
                      <Input type="number" placeholder="p.ej. 500" value={cb.monthlySavings} onChange={e => updateCoBuyer(i, "monthlySavings", e.target.value)} min={0} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel icon={CreditCard}>Deudas mensuales (€, opcional)</FieldLabel>
                    <Input type="number" placeholder="p.ej. 100" value={cb.monthlyDebts} onChange={e => updateCoBuyer(i, "monthlyDebts", e.target.value)} min={0} />
                  </div>
                </div>
              </div>
            ))}

            <SectionTitle icon={Building2}>Vivienda deseada</SectionTitle>
            <div className="space-y-2">
              <FieldLabel icon={Building2}>Tipo de propiedad</FieldLabel>
              <Select value={propertyType} onValueChange={v => { setPropertyType(v); if (submitted) validate(); }}>
                <SelectTrigger className={fieldBorder("propertyType")}><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
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
              <FieldLabel icon={Ruler}>Tamaño: {size} m²</FieldLabel>
              <Slider value={[size]} onValueChange={v => setSize(v[0])} min={30} max={200} step={10} className="mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground"><span>30 m²</span><span>200 m²</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel icon={BedDouble}>Habitaciones</FieldLabel>
                <Select value={rooms} onValueChange={v => { setRooms(v); if (submitted) validate(); }}>
                  <SelectTrigger className={fieldBorder("rooms")}><SelectValue placeholder="Nº" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem><SelectItem value="4+">4+</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError field="rooms" />
              </div>
              <div className="space-y-2">
                <FieldLabel icon={MapPin}>Zona preferida</FieldLabel>
                <Select value={zone} onValueChange={v => { setZone(v); if (submitted) validate(); }}>
                  <SelectTrigger className={fieldBorder("zone")}><SelectValue placeholder="Zona" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centro">Centro</SelectItem>
                    <SelectItem value="metropolitana">Área metropolitana</SelectItem>
                    <SelectItem value="periferia">Periferia</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError field="zone" />
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel icon={Wrench}>Estado de reforma</FieldLabel>
              <Select value={reformState} onValueChange={v => { setReformState(v); if (submitted) validate(); }}>
                <SelectTrigger className={fieldBorder("reformState")}><SelectValue placeholder="Selecciona estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="listo-para-entrar">Listo para entrar</SelectItem>
                  <SelectItem value="pequena-reforma">Pequeña reforma</SelectItem>
                  <SelectItem value="reforma-completa">Reforma completa</SelectItem>
                </SelectContent>
              </Select>
              <FieldError field="reformState" />
            </div>

            <SectionTitle icon={Percent}>Hipoteca</SectionTitle>
            <div className="space-y-2">
              <FieldLabel icon={Percent}>% a hipotecar: {mortgagePercent}%</FieldLabel>
              <Slider value={[mortgagePercent]} onValueChange={v => setMortgagePercent(v[0])} min={50} max={90} step={5} className="mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground"><span>50%</span><span>90%</span></div>
              <p className="text-xs text-muted-foreground">Entrada necesaria: {100 - mortgagePercent}% del valor de la vivienda</p>
            </div>

            <Button type="submit" size="lg" className="w-full font-semibold text-base mt-2">
              🏠 Calcular mi plan
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InputForm;
