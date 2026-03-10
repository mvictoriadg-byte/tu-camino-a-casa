import { supabase } from "@/integrations/supabase/client";

export interface HousingAid {
  id: string;
  name: string;
  region: string;
  aid_type: string;
  benefit_description: string;
  benefit_amount_estimate: number | null;
  impact_type: "financing_increase" | "downpayment_reduction" | "grant" | "tax_reduction";
  max_financing_percent: number | null;
  age_limit: number | null;
  min_age: number | null;
  income_limit: number | null;
  property_price_limit: number | null;
  first_home_required: boolean;
  residency_years_required: number | null;
  family_conditions: string | null;
  notes: string | null;
  active: boolean;
}

export interface EligibleAid extends HousingAid {
  estimatedImpact: string;
  impactValue: number; // numeric value of impact in euros
}

export interface AidsImpactSummary {
  additionalFinancingPercent: number;
  directGrants: number;
  estimatedTaxSavings: number;
  totalBenefit: number;
  adjustedDownPayment: number;
  adjustedTotalUpfront: number;
  adjustedMonthsToSave: number;
  adjustedYearsToSave: number;
  yearsSaved: number;
}

export async function fetchHousingAids(): Promise<HousingAid[]> {
  const { data, error } = await supabase
    .from("housing_aids")
    .select("*");

  if (error) {
    console.error("Error fetching housing aids:", error);
    return [];
  }

  return (data || []) as unknown as HousingAid[];
}

export function filterEligibleAids(
  aids: HousingAid[],
  params: {
    region: string;
    age: number;
    annualIncome: number;
    estimatedPrice: number;
    firstHome: boolean;
  }
): EligibleAid[] {
  const seen = new Set<string>();
  return aids
    .filter((aid) => {
      // Active check
      if (aid.active === false) return false;

      // Deduplicate
      if (seen.has(aid.id)) return false;
      seen.add(aid.id);

      // Region match: national ("España") or user's region
      if (aid.region !== "España" && aid.region !== params.region) return false;

      // Age limit (max age)
      if (aid.age_limit && params.age > aid.age_limit) return false;

      // Min age
      if (aid.min_age && params.age < aid.min_age) return false;

      // Income limit (annual)
      if (aid.income_limit && params.annualIncome > aid.income_limit) return false;

      // Property price limit
      if (aid.property_price_limit && params.estimatedPrice > aid.property_price_limit) return false;

      // First home required
      if (aid.first_home_required && !params.firstHome) return false;

      return true;
    })
    .map((aid) => {
      let estimatedImpact = "";
      let impactValue = 0;

      switch (aid.impact_type) {
        case "financing_increase":
          estimatedImpact = `Podrías financiar hasta el ${aid.max_financing_percent || 100}% del valor de la vivienda.`;
          // Impact = how much less down payment needed (difference from standard 80%)
          const extraPercent = (aid.max_financing_percent || 100) - 80;
          impactValue = Math.round(params.estimatedPrice * (extraPercent / 100));
          break;
        case "downpayment_reduction":
          if (aid.benefit_amount_estimate) {
            estimatedImpact = `Subvención estimada de hasta ${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(aid.benefit_amount_estimate)}.`;
            impactValue = aid.benefit_amount_estimate;
          } else {
            estimatedImpact = "Subvención directa para reducir la entrada necesaria.";
            impactValue = 0;
          }
          break;
        case "grant":
          if (aid.benefit_amount_estimate) {
            estimatedImpact = `Ayuda directa de hasta ${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(aid.benefit_amount_estimate)}.`;
            impactValue = aid.benefit_amount_estimate;
          } else {
            estimatedImpact = "Ayuda directa para la compra de vivienda.";
            impactValue = 0;
          }
          break;
        case "tax_reduction":
          // Estimate ~3000€ savings for tax reductions
          estimatedImpact = "Reducción fiscal estimada en impuestos de compraventa.";
          impactValue = 3000;
          break;
      }

      return { ...aid, estimatedImpact, impactValue };
    });
}

export function calculateAidsImpact(
  eligibleAids: EligibleAid[],
  params: {
    estimatedPrice: number;
    currentMortgagePercent: number;
    totalUpfront: number;
    totalSavings: number;
    totalMonthlySavings: number;
    taxesAndFees: number;
    reformCostEstimate: number;
  }
): AidsImpactSummary {
  let additionalFinancingPercent = 0;
  let directGrants = 0;
  let estimatedTaxSavings = 0;

  for (const aid of eligibleAids) {
    switch (aid.impact_type) {
      case "financing_increase":
        const maxFin = aid.max_financing_percent || 100;
        const extra = maxFin - params.currentMortgagePercent;
        if (extra > additionalFinancingPercent) {
          additionalFinancingPercent = extra;
        }
        break;
      case "downpayment_reduction":
      case "grant":
        directGrants += aid.impactValue;
        break;
      case "tax_reduction":
        estimatedTaxSavings += aid.impactValue;
        break;
    }
  }

  // Recalculate with aids
  const newMortgagePercent = Math.min(100, params.currentMortgagePercent + additionalFinancingPercent);
  const newDownPayment = Math.round(params.estimatedPrice * (1 - newMortgagePercent / 100));
  const adjustedTaxes = Math.max(0, params.taxesAndFees - estimatedTaxSavings);
  const adjustedTotalUpfront = Math.max(0, newDownPayment + adjustedTaxes + params.reformCostEstimate - directGrants);

  const adjustedGap = Math.max(0, adjustedTotalUpfront - params.totalSavings);
  const adjustedMonthsToSave = params.totalMonthlySavings > 0
    ? Math.ceil(adjustedGap / params.totalMonthlySavings)
    : adjustedGap > 0 ? Infinity : 0;
  const adjustedYearsToSave = adjustedMonthsToSave === Infinity
    ? Infinity
    : Math.round((adjustedMonthsToSave / 12) * 10) / 10;

  const originalGap = Math.max(0, params.totalUpfront - params.totalSavings);
  const originalMonths = params.totalMonthlySavings > 0
    ? Math.ceil(originalGap / params.totalMonthlySavings)
    : 0;
  const yearsSaved = Math.max(0, Math.round(((originalMonths - adjustedMonthsToSave) / 12) * 10) / 10);

  const totalBenefit = Math.round(
    params.estimatedPrice * (additionalFinancingPercent / 100) + directGrants + estimatedTaxSavings
  );

  return {
    additionalFinancingPercent,
    directGrants,
    estimatedTaxSavings,
    totalBenefit,
    adjustedDownPayment: newDownPayment,
    adjustedTotalUpfront,
    adjustedMonthsToSave: adjustedMonthsToSave === Infinity ? -1 : adjustedMonthsToSave,
    adjustedYearsToSave: adjustedYearsToSave === Infinity ? Infinity : adjustedYearsToSave,
    yearsSaved,
  };
}
