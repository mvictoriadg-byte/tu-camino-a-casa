import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "destructive";
  delay?: number;
  size?: "default" | "large";
}

const variantIconStyles = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const StatCard = ({ label, value, icon: Icon, subtitle, variant = "default", delay = 0, size = "default" }: StatCardProps) => {
  const isLarge = size === "large";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <Card className="glow-card h-full">
        <CardContent className={isLarge ? "p-5" : "p-4"}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
            <Icon className={`h-4 w-4 ${variantIconStyles[variant]}`} />
          </div>
          <div className={`stat-value text-foreground ${isLarge ? "" : "text-2xl"}`}>{value}</div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1.5 font-medium">{subtitle}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;