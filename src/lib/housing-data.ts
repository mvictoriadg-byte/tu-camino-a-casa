export interface CityData {
  name: string;
  avgHomePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  subsidies: string[];
}

export const cityData: Record<string, CityData> = {
  "new-york": {
    name: "New York",
    avgHomePrice: 750000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "SONYMA – Low-interest mortgages for first-time buyers",
      "HomeFirst Down Payment Assistance – Up to $100K",
      "FHA Loans – 3.5% down payment option",
    ],
  },
  "los-angeles": {
    name: "Los Angeles",
    avgHomePrice: 950000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "CalHFA – Down payment & closing cost assistance",
      "LA County Mortgage Credit Certificate",
      "FHA Loans – 3.5% down payment option",
    ],
  },
  chicago: {
    name: "Chicago",
    avgHomePrice: 350000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "IHDA – Illinois first-time buyer programs",
      "Chicago Home Buyer Assistance – Up to $60K",
      "FHA Loans – 3.5% down payment option",
    ],
  },
  houston: {
    name: "Houston",
    avgHomePrice: 320000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "TSAHC – Texas down payment assistance",
      "Houston Homebuyer Assistance Program",
      "FHA Loans – 3.5% down payment option",
    ],
  },
  miami: {
    name: "Miami",
    avgHomePrice: 600000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "Florida Housing – First-time buyer programs",
      "Miami-Dade Homebuyer Assistance",
      "FHA Loans – 3.5% down payment option",
    ],
  },
  seattle: {
    name: "Seattle",
    avgHomePrice: 850000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "WSHFC – Washington down payment assistance",
      "Seattle Office of Housing – Homebuyer programs",
      "FHA Loans – 3.5% down payment option",
    ],
  },
  denver: {
    name: "Denver",
    avgHomePrice: 550000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "CHFA – Colorado first-time buyer assistance",
      "Metro Mortgage Assistance Plus",
      "FHA Loans – 3.5% down payment option",
    ],
  },
  austin: {
    name: "Austin",
    avgHomePrice: 480000,
    downPaymentPercent: 20,
    mortgageRate: 6.8,
    subsidies: [
      "TSAHC – Texas down payment assistance",
      "Austin Housing Finance Corporation",
      "FHA Loans – 3.5% down payment option",
    ],
  },
};

export interface AffordabilityResult {
  city: CityData;
  monthlyIncome: number;
  savings: number;
  monthlySavings: number;
  avgHomePrice: number;
  requiredDownPayment: number;
  savingsGap: number;
  yearsToSave: number;
  maxMortgage: number;
  maxHomePrice: number;
  affordabilityRatio: number; // 0-100
  canAfford: boolean;
}

export function calculateAffordability(
  cityKey: string,
  monthlyIncome: number,
  savings: number,
  monthlySavings: number
): AffordabilityResult {
  const city = cityData[cityKey];
  const avgHomePrice = city.avgHomePrice;
  const requiredDownPayment = avgHomePrice * (city.downPaymentPercent / 100);
  const savingsGap = Math.max(0, requiredDownPayment - savings);
  const yearsToSave = monthlySavings > 0 ? savingsGap / (monthlySavings * 12) : Infinity;

  // Max mortgage: 28% of gross monthly income for housing
  const maxMonthlyPayment = monthlyIncome * 0.28;
  const monthlyRate = city.mortgageRate / 100 / 12;
  const numPayments = 30 * 12;
  const maxMortgage =
    monthlyRate > 0
      ? (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
      : maxMonthlyPayment * numPayments;

  const maxHomePrice = maxMortgage + savings;
  const affordabilityRatio = Math.min(100, (maxHomePrice / avgHomePrice) * 100);
  const canAfford = maxHomePrice >= avgHomePrice;

  return {
    city,
    monthlyIncome,
    savings,
    monthlySavings,
    avgHomePrice,
    requiredDownPayment,
    savingsGap,
    yearsToSave: Math.round(yearsToSave * 10) / 10,
    maxMortgage: Math.round(maxMortgage),
    maxHomePrice: Math.round(maxHomePrice),
    affordabilityRatio: Math.round(affordabilityRatio),
    canAfford,
  };
}
