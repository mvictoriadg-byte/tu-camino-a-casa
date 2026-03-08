export interface CityData {
  name: string;
  avgPricePerSqm: number;
  mortgageRate: number;
  subsidies: string[];
  region: string;
}

export const cityData: Record<string, CityData> = {
  madrid: {
    name: "Madrid",
    region: "Comunidad de Madrid",
    avgPricePerSqm: 4200,
    mortgageRate: 3.2,
    subsidies: [
      "Plan Vive – Vivienda pública en alquiler con opción a compra",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Deducción IRPF por compra de vivienda habitual",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  barcelona: {
    name: "Barcelona",
    region: "Cataluña",
    avgPricePerSqm: 4500,
    mortgageRate: 3.2,
    subsidies: [
      "Habitatge Jove – Programa de vivienda para jóvenes de la Generalitat",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Subvenciones de la Agència de l'Habitatge de Catalunya",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  valencia: {
    name: "Valencia",
    region: "Comunitat Valenciana",
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
    region: "Andalucía",
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
    region: "Andalucía",
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
    region: "País Vasco",
    avgPricePerSqm: 3200,
    mortgageRate: 3.2,
    subsidies: [
      "Etxebide – Servicio vasco de vivienda",
      "Avales ICO para jóvenes – Aval del 20% para menores de 35 años",
      "Gobierno Vasco – Ayudas para adquisición de vivienda",
      "Bono Alquiler Joven (250€/mes)",
    ],
  },
  zaragoza: {
    name: "Zaragoza",
    region: "Aragón",
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
    region: "País Vasco",
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
    region: "Illes Balears",
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
    region: "Canarias",
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

export interface PropertyPreferences {
  propertyType: string;
  size: string;
  rooms: string;
  zone: string;
  reformState: string;
}

export interface CoBuyer {
  monthlyIncome: number;
  savings: number;
  monthlySavings: number;
  monthlyDebts: number;
}

export interface UserProfile {
  city: string;
  age: number;
  employmentStatus: string;
  monthlyIncome: number;
  savings: number;
  monthlySavings: number;
  monthlyDebts: number;
  preferences: PropertyPreferences;
  numBuyers: number;
  coBuyers: CoBuyer[];
  mortgagePercent: number;
}

export interface ActionStep {
  icon: string;
  title: string;
  description: string;
  impact?: string;
}

export interface BankOption {
  name: string;
  rate: string;
  maxFinancing: string;
  specialCondition: string;
}

export interface OptimizationTip {
  title: string;
  description: string;
  potentialSaving: string;
}

export interface AffordabilityResult {
  city: CityData;
  preferences: PropertyPreferences;
  userProfile: UserProfile;
  estimatedPrice: number;
  reformCostEstimate: number;
  totalCost: number;
  requiredDownPayment: number;
  taxesAndFees: number;
  totalUpfront: number;
  savingsGap: number;
  yearsToSave: number;
  monthsToSave: number;
  maxMortgage: number;
  maxHomePrice: number;
  affordabilityRatio: number;
  canAfford: boolean;
  monthlyMortgagePayment: number;
  debtToIncomeRatio: number;
  savingsProgress: number;
  actionPlan: ActionStep[];
  bankOptions: BankOption[];
  optimizationTips: OptimizationTip[];
  milestones: { label: string; date: string; reached: boolean }[];
  isYoungBuyer: boolean;
  totalMonthlyIncome: number;
  totalSavings: number;
  totalMonthlySavings: number;
  totalMonthlyDebts: number;
  numBuyers: number;
  mortgagePercent: number;
  pricePerSqm: number;
  sqm: number;
}

function generateBankOptions(rate: number, mortgagePercent: number): BankOption[] {
  const maxFin = `${mortgagePercent}%`;
  return [
    { name: "Bankinter", rate: `${(rate - 0.3).toFixed(1)}% fijo`, maxFinancing: maxFin, specialCondition: "Nómina domiciliada + seguros" },
    { name: "ING", rate: `${(rate - 0.1).toFixed(1)}% fijo`, maxFinancing: maxFin, specialCondition: "Sin comisiones, 100% online" },
    { name: "CaixaBank", rate: `Euríbor + ${(rate - 2.0).toFixed(1)}%`, maxFinancing: maxFin, specialCondition: "Hipoteca joven hasta 35 años" },
    { name: "BBVA", rate: `${rate.toFixed(1)}% fijo`, maxFinancing: maxFin, specialCondition: "Valoración gratuita online" },
    { name: "Openbank", rate: `${(rate - 0.2).toFixed(1)}% fijo`, maxFinancing: maxFin, specialCondition: "100% digital, sin vinculación" },
  ];
}

function generateOptimizationTips(
  result: Partial<AffordabilityResult>,
  profile: UserProfile
): OptimizationTip[] {
  const tips: OptimizationTip[] = [];

  if (profile.preferences.zone === "centro") {
    tips.push({
      title: "Considera zona metropolitana",
      description: "Mudarte al área metropolitana puede reducir el precio hasta un 30% manteniendo buenas conexiones.",
      potentialSaving: "Hasta -30% en precio",
    });
  }

  if (profile.preferences.propertyType === "obra-nueva") {
    tips.push({
      title: "Explora segunda mano con reforma",
      description: "Una vivienda de segunda mano con pequeña reforma puede ahorrarte un 25–35% frente a obra nueva.",
      potentialSaving: "Hasta -35% en precio",
    });
  }

  if (profile.preferences.reformState === "listo-para-entrar") {
    tips.push({
      title: "Vivienda para reformar = oportunidad",
      description: "Comprar una vivienda que necesite reforma ligera permite negociar mejor precio de entrada.",
      potentialSaving: "Hasta -15% negociando",
    });
  }

  const sqm = Number(profile.preferences.size) || 70;
  if (sqm > 60) {
    tips.push({
      title: "Empieza más pequeño, crece después",
      description: "Un piso más pequeño como primera vivienda te permite entrar al mercado antes y luego mejorar.",
      potentialSaving: "Años menos de espera",
    });
  }

  tips.push({
    title: "Negocia el precio de compra",
    description: "En España, es habitual negociar un 5–10% sobre el precio publicado. ¡No aceptes el primer precio!",
    potentialSaving: "5–10% de ahorro directo",
  });

  return tips.slice(0, 4);
}

function generateActionPlan(
  result: Partial<AffordabilityResult>,
  profile: UserProfile
): ActionStep[] {
  const steps: ActionStep[] = [];
  const gap = result.savingsGap || 0;
  const canAfford = result.canAfford || false;

  if (canAfford) {
    steps.push({
      icon: "🎉",
      title: "¡Estás listo para dar el paso!",
      description: "Tienes los ahorros necesarios y capacidad hipotecaria suficiente. Es momento de buscar vivienda.",
      impact: "Puedes empezar ya",
    });
    steps.push({
      icon: "🏦",
      title: "Solicita preaprobación hipotecaria",
      description: "Contacta con 2-3 bancos para obtener una preaprobación. Esto te da poder de negociación.",
    });
    steps.push({
      icon: "🔍",
      title: "Busca tu vivienda ideal",
      description: "Con tu presupuesto claro, busca en Idealista, Fotocasa y Habitaclia. Visita al menos 10 viviendas.",
    });
  } else {
    const monthlySavingsNeeded = gap > 0 && profile.monthlySavings > 0
      ? Math.ceil(gap / profile.monthlySavings)
      : 0;

    steps.push({
      icon: "💪",
      title: "Tu meta es alcanzable",
      description: `Te faltan ${formatCurrency(gap)} para la entrada. Con tu ahorro mensual, lo conseguirás en ${monthlySavingsNeeded > 0 ? `${Math.ceil(monthlySavingsNeeded / 12)} año(s)` : "un tiempo razonable"}.`,
      impact: "Cada mes estás más cerca",
    });

    if (profile.monthlySavings < profile.monthlyIncome * 0.3) {
      const suggested = Math.round(profile.monthlyIncome * 0.3);
      steps.push({
        icon: "📊",
        title: "Optimiza tu ahorro mensual",
        description: `Intenta ahorrar ${formatCurrency(suggested)}/mes (30% de ingresos). Revisa suscripciones y gastos fijos.`,
        impact: `+${formatCurrency(suggested - profile.monthlySavings)}/mes extra`,
      });
    }

    if (profile.age <= 35) {
      steps.push({
        icon: "🏛️",
        title: "Aprovecha las ayudas para jóvenes",
        description: "Tienes acceso a avales ICO del 20% y deducciones especiales. Esto puede reducir tu entrada necesaria.",
        impact: "Hasta 20% menos de entrada",
      });
    }

    if (profile.monthlyDebts > 0) {
      steps.push({
        icon: "🎯",
        title: "Reduce tus deudas primero",
        description: `Tus deudas de ${formatCurrency(profile.monthlyDebts)}/mes reducen tu capacidad hipotecaria. Prioriza liquidarlas.`,
        impact: "Mayor capacidad de endeudamiento",
      });
    }

    steps.push({
      icon: "🏠",
      title: "Explora opciones más accesibles",
      description: "Busca viviendas en zonas limítrofes o de menor tamaño como primera compra. ¡Siempre puedes mejorar después!",
    });
  }

  return steps;
}

function generateMilestones(
  profile: UserProfile,
  totalUpfront: number,
  savingsGap: number,
  totalSavings: number,
  totalMonthlySavings: number
): { label: string; date: string; reached: boolean }[] {
  const milestones: { label: string; date: string; reached: boolean }[] = [];
  const now = new Date();

  const thresholds = [
    { pct: 0.25, label: "25% ahorrado" },
    { pct: 0.5, label: "50% ahorrado" },
    { pct: 0.75, label: "75% ahorrado" },
    { pct: 1, label: "¡Meta alcanzada!" },
  ];

  for (const t of thresholds) {
    const target = totalUpfront * t.pct;
    if (totalSavings >= target) {
      milestones.push({ label: t.label, date: "✓ Completado", reached: true });
    } else {
      const months = totalMonthlySavings > 0 ? Math.ceil((target - totalSavings) / totalMonthlySavings) : 0;
      const d = new Date(now);
      d.setMonth(d.getMonth() + months);
      milestones.push({ label: t.label, date: months > 0 ? formatDate(d) : "—", reached: false });
    }
  }

  return milestones;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function calculateAffordability(profile: UserProfile): AffordabilityResult {
  const city = cityData[profile.city];
  const sqm = Number(profile.preferences.size) || 70;
  const basePrice = city.avgPricePerSqm * sqm;
  const typeMulti = propertyTypeMultiplier[profile.preferences.propertyType] || 1;
  const zoneMulti = zoneMultiplier[profile.preferences.zone] || 1;
  const estimatedPrice = Math.round(basePrice * typeMulti * zoneMulti);
  const pricePerSqm = Math.round(city.avgPricePerSqm * typeMulti * zoneMulti);
  const reformCostEstimate = reformCost[profile.preferences.reformState] || 0;
  const totalCost = estimatedPrice + reformCostEstimate;

  const mortgagePct = profile.mortgagePercent / 100;
  const downPaymentPct = 1 - mortgagePct;

  const requiredDownPayment = Math.round(estimatedPrice * downPaymentPct);
  const taxesAndFees = Math.round(estimatedPrice * 0.10);
  const totalUpfront = requiredDownPayment + taxesAndFees + reformCostEstimate;

  // Combine financials across all buyers
  const totalMonthlyIncome = profile.monthlyIncome + profile.coBuyers.reduce((s, c) => s + c.monthlyIncome, 0);
  const totalSavings = profile.savings + profile.coBuyers.reduce((s, c) => s + c.savings, 0);
  const totalMonthlySavings = profile.monthlySavings + profile.coBuyers.reduce((s, c) => s + c.monthlySavings, 0);
  const totalMonthlyDebts = profile.monthlyDebts + profile.coBuyers.reduce((s, c) => s + c.monthlyDebts, 0);

  const savingsGap = Math.max(0, totalUpfront - totalSavings);
  const monthsToSave = totalMonthlySavings > 0 ? Math.ceil(savingsGap / totalMonthlySavings) : savingsGap > 0 ? Infinity : 0;
  const yearsToSave = monthsToSave === Infinity ? Infinity : Math.round((monthsToSave / 12) * 10) / 10;

  // Mortgage capacity: 35% of combined income minus combined debts
  const maxMonthlyPayment = Math.max(0, totalMonthlyIncome * 0.35 - totalMonthlyDebts);
  const monthlyRate = city.mortgageRate / 100 / 12;
  const numPayments = 30 * 12;
  const maxMortgage =
    monthlyRate > 0
      ? (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
      : maxMonthlyPayment * numPayments;

  const maxHomePrice = maxMortgage / mortgagePct;
  const affordabilityRatio = Math.min(100, (maxHomePrice / totalCost) * 100);
  const canAfford = maxHomePrice >= totalCost && totalSavings >= totalUpfront;

  const loanAmount = estimatedPrice * mortgagePct;
  const monthlyMortgagePayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

  const debtToIncomeRatio = totalMonthlyIncome > 0
    ? ((monthlyMortgagePayment + totalMonthlyDebts) / totalMonthlyIncome) * 100
    : 0;

  const savingsProgress = totalUpfront > 0 ? Math.min(100, (totalSavings / totalUpfront) * 100) : 100;
  const isYoungBuyer = profile.age <= 35;

  const profileForPlan = { ...profile, monthlyIncome: totalMonthlyIncome, savings: totalSavings, monthlySavings: totalMonthlySavings, monthlyDebts: totalMonthlyDebts };

  const partialResult: Partial<AffordabilityResult> = {
    savingsGap,
    canAfford,
  };

  const actionPlan = generateActionPlan(partialResult, profileForPlan);
  const bankOptions = generateBankOptions(city.mortgageRate, profile.mortgagePercent);
  const optimizationTips = generateOptimizationTips(partialResult, profileForPlan);
  const milestones = generateMilestones(profileForPlan, totalUpfront, savingsGap, totalSavings, totalMonthlySavings);

  return {
    city,
    preferences: profile.preferences,
    userProfile: profile,
    estimatedPrice,
    reformCostEstimate,
    totalCost,
    requiredDownPayment,
    taxesAndFees,
    totalUpfront,
    savingsGap,
    yearsToSave,
    monthsToSave: monthsToSave === Infinity ? -1 : monthsToSave,
    maxMortgage: Math.round(maxMortgage),
    maxHomePrice: Math.round(maxHomePrice),
    affordabilityRatio: Math.round(affordabilityRatio),
    canAfford,
    monthlyMortgagePayment: Math.round(monthlyMortgagePayment),
    debtToIncomeRatio: Math.round(debtToIncomeRatio),
    savingsProgress: Math.round(savingsProgress),
    actionPlan,
    bankOptions,
    optimizationTips,
    milestones,
    isYoungBuyer,
    totalMonthlyIncome,
    totalSavings,
    totalMonthlySavings,
    totalMonthlyDebts,
    numBuyers: profile.numBuyers,
    mortgagePercent: profile.mortgagePercent,
    pricePerSqm,
    sqm,
  };
}
