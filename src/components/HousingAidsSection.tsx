import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/housing-data";
import {
  type EligibleAid,
  type AidsImpactSummary,
} from "@/lib/housing-aids";
import {
  Landmark, Shield, TrendingUp, Gift, Receipt, Sparkles, Timer, ChevronRight,
} from "lucide-react";

interface HousingAidsSectionProps {
  eligibleAids: EligibleAid[];
  impact: AidsImpactSummary;
  isYoungBuyer: boolean;
  originalYearsToSave: number;
  onToggleAids: (enabled: boolean) => void;
  aidsEnabled: boolean;
}

const impactTypeIcon: Record<string, React.ElementType> = {
  financing_increase: TrendingUp,
  downpayment_reduction: Gift,
  grant: Gift,
  tax_reduction: Receipt,
};

const impactTypeColor: Record<string, string> = {
  financing_increase: "text-primary",
  downpayment_reduction: "text-success",
  grant: "text-success",
  tax_reduction: "text-warning",
};

const HousingAidsSection = ({
  eligibleAids,
  impact,
  isYoungBuyer,
  originalYearsToSave,
  onToggleAids,
  aidsEnabled,
}: HousingAidsSectionProps) => {
  if (eligibleAids.length === 0) return null;

  const displayYearsSaved =
    impact.yearsSaved > 0
      ? `~${impact.yearsSaved} año${impact.yearsSaved !== 1 ? "s" : ""}`
      : null;

  return (
    <div className="space-y-4">
      {/* Impact summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="glow-card border-2 border-success/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="px-6 py-5 bg-success/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-success/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold">Impacto estimado de ayudas públicas</h3>
                    <p className="text-xs text-muted-foreground">
                      {eligibleAids.length} ayuda{eligibleAids.length !== 1 ? "s" : ""} aplicable{eligibleAids.length !== 1 ? "s" : ""} a tu caso
                    </p>
                  </div>
                </div>
                {isYoungBuyer && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-bold hidden sm:flex items-center gap-1">
                    <Shield className="h-3 w-3" />Joven &lt;35
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {impact.additionalFinancingPercent > 0 && (
                  <div className="rounded-xl bg-background/80 p-3 border border-border">
                    <p className="text-xs text-muted-foreground font-semibold">Financiación extra</p>
                    <p className="text-lg font-extrabold text-primary">+{impact.additionalFinancingPercent}%</p>
                  </div>
                )}
                {impact.directGrants > 0 && (
                  <div className="rounded-xl bg-background/80 p-3 border border-border">
                    <p className="text-xs text-muted-foreground font-semibold">Subvenciones</p>
                    <p className="text-lg font-extrabold text-success">{formatCurrency(impact.directGrants)}</p>
                  </div>
                )}
                {impact.estimatedTaxSavings > 0 && (
                  <div className="rounded-xl bg-background/80 p-3 border border-border">
                    <p className="text-xs text-muted-foreground font-semibold">Ahorro fiscal</p>
                    <p className="text-lg font-extrabold text-warning">{formatCurrency(impact.estimatedTaxSavings)}</p>
                  </div>
                )}
                {impact.totalBenefit > 0 && (
                  <div className="rounded-xl bg-background/80 p-3 border border-border">
                    <p className="text-xs text-muted-foreground font-semibold">Beneficio total</p>
                    <p className="text-lg font-extrabold text-foreground">{formatCurrency(impact.totalBenefit)}</p>
                  </div>
                )}
              </div>

              {displayYearsSaved && (
                <div className="mt-4 p-3 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-success shrink-0" />
                    <p className="text-sm font-bold text-success">
                      Las ayudas públicas podrían adelantarte la compra en aproximadamente {displayYearsSaved}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Individual aids list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="glow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" /> Ayudas públicas que podrían aplicarse a tu caso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eligibleAids.map((aid, i) => {
              const Icon = impactTypeIcon[aid.impact_type] || Landmark;
              const colorClass = impactTypeColor[aid.impact_type] || "text-primary";

              return (
                <motion.div
                  key={aid.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.06 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/60 border border-border"
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-muted ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold">{aid.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-semibold text-muted-foreground shrink-0">
                        {aid.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs font-bold ${colorClass}`}>{aid.estimatedImpact}</span>
                      <span className="relative group cursor-help">
                        <span className="text-xs text-muted-foreground underline decoration-dotted">¿Qué significa esto?</span>
                        <span className="absolute bottom-full left-0 mb-1 w-64 p-2 rounded-lg bg-popover border border-border text-xs shadow-lg hidden group-hover:block z-10 font-normal text-foreground">
                          {aid.benefit_description}
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HousingAidsSection;
