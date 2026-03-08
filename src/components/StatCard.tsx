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
}

const variantStyles = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const StatCard = ({ label, value, icon: Icon, subtitle, variant = "default", delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="glow-card h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
              {label}
            </span>
            <Icon className={`h-4 w-4 ${variantStyles[variant]}`} />
          </div>
          <div className={`stat-value ${variantStyles[variant]}`}>{value}</div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
