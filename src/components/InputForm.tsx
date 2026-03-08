import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cityData, type PropertyPreferences } from "@/lib/housing-data";
import {
  Home,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Ruler,
  BedDouble,
  MapPin,
  Wrench,
  Calendar,
  Building2,
} from "lucide-react";

interface InputFormProps {
  onCalculate: (
    city: string,
    income: number,
    savings: number,
    monthlySavings: number,
    preferences: PropertyPreferences
  ) => void;
}

const InputForm = ({ onCalculate }: InputFormProps) => {
  const [city, setCity] = useState("");
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [size, setSize] = useState("");
  const [rooms, setRooms] = useState("");
  const [zone, setZone] = useState("");
  const [reformState, setReformState] = useState("");
  const [timeline, setTimeline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !income || !savings || !monthlySavings || !propertyType || !size || !rooms || !zone || !reformState || !timeline)
      return;
    onCalculate(city, Number(income), Number(savings), Number(monthlySavings), {
      propertyType,
      size,
      rooms,
      zone,
      reformState,
      timeline,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Tu Perfil Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Financiero */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Ciudad
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger><SelectValue placeholder="Selecciona una ciudad" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(cityData).map(([key, data]) => (
                    <SelectItem key={key} value={key}>{data.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" /> Ingresos mensuales netos (€)
              </Label>
              <Input type="number" placeholder="p.ej. 2500" value={income} onChange={(e) => setIncome(e.target.value)} min={0} max={1000000} />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <PiggyBank className="h-3.5 w-3.5" /> Ahorros actuales (€)
              </Label>
              <Input type="number" placeholder="p.ej. 30000" value={savings} onChange={(e) => setSavings(e.target.value)} min={0} max={100000000} />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Ahorro mensual (€)
              </Label>
              <Input type="number" placeholder="p.ej. 800" value={monthlySavings} onChange={(e) => setMonthlySavings(e.target.value)} min={0} max={1000000} />
            </div>

            {/* Separador */}
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-3">Tipo de vivienda deseada</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Tipo de propiedad
              </Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="obra-nueva">Obra nueva</SelectItem>
                  <SelectItem value="segunda-mano">Segunda mano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Ruler className="h-3.5 w-3.5" /> Tamaño
                </Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger><SelectValue placeholder="m²" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<60">&lt;60 m²</SelectItem>
                    <SelectItem value="60-90">60–90 m²</SelectItem>
                    <SelectItem value="90-120">90–120 m²</SelectItem>
                    <SelectItem value="120+">120+ m²</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <BedDouble className="h-3.5 w-3.5" /> Habitaciones
                </Label>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger><SelectValue placeholder="Nº" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4+">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Zona preferida
              </Label>
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger><SelectValue placeholder="Selecciona zona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="metropolitana">Área metropolitana</SelectItem>
                  <SelectItem value="periferia">Periferia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" /> Estado de reforma
              </Label>
              <Select value={reformState} onValueChange={setReformState}>
                <SelectTrigger><SelectValue placeholder="Selecciona estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="listo-para-entrar">Listo para entrar</SelectItem>
                  <SelectItem value="pequena-reforma">Pequeña reforma</SelectItem>
                  <SelectItem value="reforma-completa">Reforma completa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Plazo de compra deseado
              </Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger><SelectValue placeholder="Selecciona plazo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">Lo antes posible</SelectItem>
                  <SelectItem value="2-3">2–3 años</SelectItem>
                  <SelectItem value="3-5">3–5 años</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="lg" className="w-full font-semibold text-base mt-2">
              Analizar Viabilidad
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InputForm;
