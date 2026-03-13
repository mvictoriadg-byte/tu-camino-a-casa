/**
 * City-level pricing data for estimated property prices.
 * Separated from housing-aids logic — used only for price estimation.
 */

export type ZoneKey = "centrico" | "cerca_centro" | "afueras" | "municipio_cercano";
export type PropertyStateKey = "nueva" | "pequena_reforma" | "reforma_integral";

export interface CityPricing {
  region: string;
  base_price_m2: number;
  zone_factors: Record<ZoneKey, number>;
}

/** State multipliers (transversal, same for all cities) */
export const STATE_FACTORS: Record<PropertyStateKey, number> = {
  nueva: 1.12,
  pequena_reforma: 0.95,
  reforma_integral: 0.80,
};

/** Default zone factors when a city is not in the dataset */
export const DEFAULT_ZONE_FACTORS: Record<ZoneKey, number> = {
  centrico: 1.15,
  cerca_centro: 1.04,
  afueras: 0.90,
  municipio_cercano: 0.80,
};

/** National fallback price per m² */
export const FALLBACK_PRICE_M2 = 2400;

/** Per-city pricing data */
export const CITY_PRICING: Record<string, CityPricing> = {
  Madrid: {
    region: "Comunidad de Madrid",
    base_price_m2: 4900,
    zone_factors: { centrico: 1.22, cerca_centro: 1.08, afueras: 0.88, municipio_cercano: 0.72 },
  },
  Barcelona: {
    region: "Cataluña",
    base_price_m2: 4700,
    zone_factors: { centrico: 1.20, cerca_centro: 1.07, afueras: 0.90, municipio_cercano: 0.75 },
  },
  Valencia: {
    region: "Comunitat Valenciana",
    base_price_m2: 2800,
    zone_factors: { centrico: 1.16, cerca_centro: 1.05, afueras: 0.90, municipio_cercano: 0.78 },
  },
  Sevilla: {
    region: "Andalucía",
    base_price_m2: 2400,
    zone_factors: { centrico: 1.15, cerca_centro: 1.04, afueras: 0.89, municipio_cercano: 0.77 },
  },
  Málaga: {
    region: "Andalucía",
    base_price_m2: 3200,
    zone_factors: { centrico: 1.18, cerca_centro: 1.06, afueras: 0.90, municipio_cercano: 0.76 },
  },
  Bilbao: {
    region: "País Vasco",
    base_price_m2: 3500,
    zone_factors: { centrico: 1.17, cerca_centro: 1.06, afueras: 0.91, municipio_cercano: 0.79 },
  },
  Zaragoza: {
    region: "Aragón",
    base_price_m2: 2300,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Palma: {
    region: "Illes Balears",
    base_price_m2: 3900,
    zone_factors: { centrico: 1.18, cerca_centro: 1.06, afueras: 0.91, municipio_cercano: 0.80 },
  },
  Alicante: {
    region: "Comunitat Valenciana",
    base_price_m2: 2500,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Murcia: {
    region: "Región de Murcia",
    base_price_m2: 1800,
    zone_factors: { centrico: 1.13, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  "Las Palmas de Gran Canaria": {
    region: "Canarias",
    base_price_m2: 2200,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  "Santa Cruz de Tenerife": {
    region: "Canarias",
    base_price_m2: 2000,
    zone_factors: { centrico: 1.13, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  "A Coruña": {
    region: "Galicia",
    base_price_m2: 2200,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Vigo: {
    region: "Galicia",
    base_price_m2: 2100,
    zone_factors: { centrico: 1.13, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Oviedo: {
    region: "Principado de Asturias",
    base_price_m2: 2000,
    zone_factors: { centrico: 1.13, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  Gijón: {
    region: "Principado de Asturias",
    base_price_m2: 1900,
    zone_factors: { centrico: 1.12, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  Valladolid: {
    region: "Castilla y León",
    base_price_m2: 1800,
    zone_factors: { centrico: 1.13, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  Granada: {
    region: "Andalucía",
    base_price_m2: 2100,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Córdoba: {
    region: "Andalucía",
    base_price_m2: 1700,
    zone_factors: { centrico: 1.12, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  "San Sebastián": {
    region: "País Vasco",
    base_price_m2: 5200,
    zone_factors: { centrico: 1.20, cerca_centro: 1.08, afueras: 0.90, municipio_cercano: 0.75 },
  },
  Pamplona: {
    region: "Comunidad Foral de Navarra",
    base_price_m2: 2600,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Santander: {
    region: "Cantabria",
    base_price_m2: 2400,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Girona: {
    region: "Cataluña",
    base_price_m2: 2800,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Tarragona: {
    region: "Cataluña",
    base_price_m2: 2200,
    zone_factors: { centrico: 1.13, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.80 },
  },
  Castellón: {
    region: "Comunitat Valenciana",
    base_price_m2: 1600,
    zone_factors: { centrico: 1.12, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  Salamanca: {
    region: "Castilla y León",
    base_price_m2: 2000,
    zone_factors: { centrico: 1.13, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  Toledo: {
    region: "Castilla-La Mancha",
    base_price_m2: 1600,
    zone_factors: { centrico: 1.12, cerca_centro: 1.03, afueras: 0.90, municipio_cercano: 0.82 },
  },
  Cádiz: {
    region: "Andalucía",
    base_price_m2: 2300,
    zone_factors: { centrico: 1.14, cerca_centro: 1.04, afueras: 0.90, municipio_cercano: 0.80 },
  },
};

/**
 * Average base_price_m2 by region (comunidad autónoma), derived from CITY_PRICING.
 * Used as fallback when a city is not in the dataset.
 */
const _regionAvgCache: Record<string, number> = {};
function getRegionAvgPriceM2(region: string): number {
  if (_regionAvgCache[region] !== undefined) return _regionAvgCache[region];
  const cities = Object.values(CITY_PRICING).filter(c => c.region === region);
  if (cities.length === 0) return FALLBACK_PRICE_M2;
  const avg = Math.round(cities.reduce((s, c) => s + c.base_price_m2, 0) / cities.length);
  _regionAvgCache[region] = avg;
  return avg;
}

/**
 * Get the adjusted price per m² for a given city/region + zone + state.
 */
export function getAdjustedPriceM2(
  ciudad: string | undefined,
  comunidad: string | undefined,
  zone: ZoneKey | string,
  state: PropertyStateKey | string
): number {
  // 1. Base price
  let basePrice = FALLBACK_PRICE_M2;
  let zoneFactors = DEFAULT_ZONE_FACTORS;

  if (ciudad && CITY_PRICING[ciudad]) {
    basePrice = CITY_PRICING[ciudad].base_price_m2;
    zoneFactors = CITY_PRICING[ciudad].zone_factors;
  } else if (comunidad) {
    basePrice = getRegionAvgPriceM2(comunidad);
  }

  // 2. Zone factor
  const zoneFactor = zoneFactors[zone as ZoneKey] ?? DEFAULT_ZONE_FACTORS[zone as ZoneKey] ?? 1.0;

  // 3. State factor
  const stateFactor = STATE_FACTORS[state as PropertyStateKey] ?? 1.0;

  return Math.round(basePrice * zoneFactor * stateFactor);
}

/**
 * Estimate total property price.
 */
export function estimatePropertyPrice(
  ciudad: string | undefined,
  comunidad: string | undefined,
  zone: ZoneKey | string,
  state: PropertyStateKey | string,
  sqm: number
): number {
  return Math.round(getAdjustedPriceM2(ciudad, comunidad, zone, state) * sqm);
}

/** Human-readable labels for zone keys */
export const ZONE_LABELS: Record<ZoneKey, string> = {
  centrico: "Céntrico",
  cerca_centro: "Cerca del centro",
  afueras: "Barrio en las afueras",
  municipio_cercano: "En un municipio cercano",
};

/** Human-readable labels for state keys */
export const STATE_LABELS: Record<PropertyStateKey, string> = {
  nueva: "Nueva",
  pequena_reforma: "Necesita pequeña reforma",
  reforma_integral: "Necesita reforma integral",
};
