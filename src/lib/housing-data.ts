export interface CityData {
  name: string;
  avgPricePerSqm: number; // €/m² average
  mortgageRate: number;
  subsidies: string[];
}

// Precios medios por m² aproximados en España (2024-2025)
export const cityData: Record<string, CityData> = {
  madrid: {
    name: "Madrid",
    avgPricePerSqm: 4200,
    mortgageRate: 3.2,
    subsidies: [
      "Plan Vive – Vivienda pública en alquiler con opción a compra (Comunidad de Madrid)",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Deducción IRPF por compra de vivienda habitual (según condiciones)",
      "Ayudas al alquiler joven – Bono Alquiler Joven (250€/mes)",
    ],
  },
  barcelona: {
    name: "Barcelona",
    avgPricePerSqm: 4500,
    mortgageRate: 3.2,
    subsidies: [
      "Habitatge Jove – Programa de vivienda para jóvenes de la Generalitat",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Subvenciones de la Agència de l'Habitatge de Catalunya",
      "Bono Alquiler Joven (250€/mes) – Plan Estatal de Vivienda",
    ],
  },
  valencia: {
    name: "Valencia",
    avgPricePerSqm: 2200,
    mortgageRate: 3.2,
    subsidies: [
      "Plan Estatal de Vivienda – Ayuda directa a la compra para jóvenes",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "GVA Jove – Programa autonómico de vivienda joven",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  sevilla: {
    name: "Sevilla",
    avgPricePerSqm: 2000,
    mortgageRate: 3.2,
    subsidies: [
      "Plan Vive en Andalucía – Ayudas a la adquisición de primera vivienda",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Deducción autonómica IRPF por compra de vivienda habitual",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  malaga: {
    name: "Málaga",
    avgPricePerSqm: 2800,
    mortgageRate: 3.2,
    subsidies: [
      "Plan Vive en Andalucía – Ayudas a adquisición",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Ayuntamiento de Málaga – Programa de vivienda protegida",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  bilbao: {
    name: "Bilbao",
    avgPricePerSqm: 3200,
    mortgageRate: 3.2,
    subsidies: [
      "Etxebide – Servicio vasco de vivienda (alquiler y compra protegida)",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Gobierno Vasco – Ayudas para adquisición de vivienda",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  zaragoza: {
    name: "Zaragoza",
    avgPricePerSqm: 1700,
    mortgageRate: 3.2,
    subsidies: [
      "Gobierno de Aragón – Ayudas a la compra de vivienda habitual",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Deducción autonómica IRPF por adquisición de vivienda",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  "san-sebastian": {
    name: "San Sebastián",
    avgPricePerSqm: 5000,
    mortgageRate: 3.2,
    subsidies: [
      "Etxebide – Vivienda protegida del Gobierno Vasco",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Diputación Foral de Gipuzkoa – Ayudas a la compra",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  palma: {
    name: "Palma de Mallorca",
    avgPricePerSqm: 3600,
    mortgageRate: 3.2,
    subsidies: [
      "IBAVI – Instituto Balear de la Vivienda",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Govern de les Illes Balears – Ayudas a primera vivienda",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  "las-palmas": {
    name: "Las Palmas de Gran Canaria",
    avgPricePerSqm: 2100,
    mortgageRate: 3.2,
    subsidies: [
      "Gobierno de Canarias – Plan de vivienda",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "IGVS Canarias – Ayudas a adquisición de vivienda protegida",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
};

// Multiplicadores de precio según preferencias
export const propertyTypeMultiplier: Record<string, number> = {
  apartamento: 1.0,
  casa: 1.25,
  "obra-nueva": 1.3,
  "segunda-mano": 0.85,
};

export const zoneMultiplier: Record<string, number> = {
  centro: 1.4,
  metropolitana: 1.0,
  periferia: 0.7,
};

export const reformCost: Record<string, number> = {
  "listo-para-entrar": 0,
  "pequena-reforma": 15000,
  "reforma-completa": 45000,
};

export const sizeOptions: Record<string, number> = {
  "<60": 50,
  "60-90": 75,
  "90-120": 105,
  "120+": 135,
};

export interface PropertyPreferences {
  propertyType: string;
  size: string;
  rooms: string;
  zone: string;
  reformState: string;
  timeline: string;
}

export interface AffordabilityResult {
  city: CityData;
  preferences: PropertyPreferences;
  monthlyIncome: number;
  savings: number;
  monthlySavings: number;
  estimatedPrice: number;
  reformCostEstimate: number;
  totalCost: number;
  requiredDownPayment: number;
  taxesAndFees: number;
  totalUpfront: number;
  savingsGap: number;
  yearsToSave: number;
  maxMortgage: number;
  maxHomePrice: number;
  affordabilityRatio: number;
  canAfford: boolean;
  monthlyMortgagePayment: number;
}

export function calculateAffordability(
  cityKey: string,
  monthlyIncome: number,
  savings: number,
  monthlySavings: number,
  preferences: PropertyPreferences
): AffordabilityResult {
  const city = cityData[cityKey];
  const sqm = sizeOptions[preferences.size] || 75;
  const basePrice = city.avgPricePerSqm * sqm;
  const typeMulti = propertyTypeMultiplier[preferences.propertyType] || 1;
  const zoneMulti = zoneMultiplier[preferences.zone] || 1;
  const estimatedPrice = Math.round(basePrice * typeMulti * zoneMulti);
  const reformCostEstimate = reformCost[preferences.reformState] || 0;
  const totalCost = estimatedPrice + reformCostEstimate;

  // En España: entrada del 20% + ~10% impuestos y gastos
  const downPaymentPercent = 20;
  const requiredDownPayment = Math.round(estimatedPrice * (downPaymentPercent / 100));
  const taxesAndFees = Math.round(estimatedPrice * 0.10); // ITP/IVA + notaría + registro + gestoría
  const totalUpfront = requiredDownPayment + taxesAndFees + reformCostEstimate;

  const savingsGap = Math.max(0, totalUpfront - savings);
  const yearsToSave = monthlySavings > 0 ? savingsGap / (monthlySavings * 12) : savingsGap > 0 ? Infinity : 0;

  // Hipoteca máxima: 35% de ingresos brutos mensuales (criterio bancario español)
  const maxMonthlyPayment = monthlyIncome * 0.35;
  const monthlyRate = city.mortgageRate / 100 / 12;
  const numPayments = 30 * 12;
  const maxMortgage =
    monthlyRate > 0
      ? (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
      : maxMonthlyPayment * numPayments;

  const maxHomePrice = maxMortgage + savings;
  const affordabilityRatio = Math.min(100, (maxHomePrice / totalCost) * 100);
  const canAfford = maxHomePrice >= totalCost && savings >= totalUpfront;

  // Cuota mensual real de la hipoteca necesaria
  const loanAmount = estimatedPrice * 0.8; // 80% financiado
  const monthlyMortgagePayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

  return {
    city,
    preferences,
    monthlyIncome,
    savings,
    monthlySavings,
    estimatedPrice,
    reformCostEstimate,
    totalCost,
    requiredDownPayment,
    taxesAndFees,
    totalUpfront,
    savingsGap,
    yearsToSave: Math.round(yearsToSave * 10) / 10,
    maxMortgage: Math.round(maxMortgage),
    maxHomePrice: Math.round(maxHomePrice),
    affordabilityRatio: Math.round(affordabilityRatio),
    canAfford,
    monthlyMortgagePayment: Math.round(monthlyMortgagePayment),
  };
}
