import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LocationPrice {
  id: string;
  comunidad: string;
  ciudad: string | null;
  avg_price_m2: number;
  mortgage_rate: number;
}

const SPAIN_AVG_PRICE_M2 = 2100;
const DEFAULT_MORTGAGE_RATE = 3.2;

export function useLocationPrices() {
  const [locations, setLocations] = useState<LocationPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("location_prices")
      .select("*")
      .order("comunidad")
      .order("ciudad")
      .then(({ data }) => {
        if (data) setLocations(data as LocationPrice[]);
        setLoading(false);
      });
  }, []);

  const comunidades = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((l) => set.add(l.comunidad));
    return Array.from(set).sort();
  }, [locations]);

  const getCiudades = (comunidad: string): string[] => {
    return locations
      .filter((l) => l.comunidad === comunidad && l.ciudad)
      .map((l) => l.ciudad!)
      .sort();
  };

  const getAvgPriceM2 = (comunidad: string, ciudad?: string): number => {
    if (ciudad) {
      const cityRow = locations.find(
        (l) => l.comunidad === comunidad && l.ciudad === ciudad
      );
      if (cityRow) return Number(cityRow.avg_price_m2);
    }
    // Fallback to comunidad average
    const comRow = locations.find(
      (l) => l.comunidad === comunidad && !l.ciudad
    );
    if (comRow) return Number(comRow.avg_price_m2);
    return SPAIN_AVG_PRICE_M2;
  };

  const getMortgageRate = (comunidad: string, ciudad?: string): number => {
    if (ciudad) {
      const cityRow = locations.find(
        (l) => l.comunidad === comunidad && l.ciudad === ciudad
      );
      if (cityRow) return Number(cityRow.mortgage_rate);
    }
    const comRow = locations.find(
      (l) => l.comunidad === comunidad && !l.ciudad
    );
    if (comRow) return Number(comRow.mortgage_rate);
    return DEFAULT_MORTGAGE_RATE;
  };

  return { locations, loading, comunidades, getCiudades, getAvgPriceM2, getMortgageRate };
}
