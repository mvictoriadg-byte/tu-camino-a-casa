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
import { cityData } from "@/lib/housing-data";
import { Home, DollarSign, PiggyBank, TrendingUp } from "lucide-react";

interface InputFormProps {
  onCalculate: (city: string, income: number, savings: number, monthlySavings: number) => void;
}

const InputForm = ({ onCalculate }: InputFormProps) => {
  const [city, setCity] = useState("");
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !income || !savings || !monthlySavings) return;
    onCalculate(city, Number(income), Number(savings), Number(monthlySavings));
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
            Your Financial Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
                City
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(cityData).map(([key, data]) => (
                    <SelectItem key={key} value={key}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income" className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                Monthly Income
              </Label>
              <Input
                id="income"
                type="number"
                placeholder="e.g. 8000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                min={0}
                max={1000000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="savings" className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <PiggyBank className="h-3.5 w-3.5" />
                Total Savings
              </Label>
              <Input
                id="savings"
                type="number"
                placeholder="e.g. 50000"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                min={0}
                max={100000000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlySavings" className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Monthly Savings
              </Label>
              <Input
                id="monthlySavings"
                type="number"
                placeholder="e.g. 2000"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(e.target.value)}
                min={0}
                max={1000000}
              />
            </div>

            <Button type="submit" size="lg" className="w-full font-semibold text-base mt-2">
              Analyze Affordability
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InputForm;
