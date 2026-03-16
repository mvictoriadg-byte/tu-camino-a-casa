import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface JourneyPhase {
  id: string;
  name: string;
  description: string;
  order_index: number;
}

interface JourneyStep {
  id: string;
  phase_id: string;
  title: string;
  description: string;
  order_index: number;
}

interface TrackerMilestone {
  id: string;
  percentage_required: number;
  title: string;
  description: string;
}

interface UserMilestone {
  id: string;
  milestone_id: string;
  achieved_at: string;
}

interface TrackerState {
  current_phase_id: string | null;
  focus_message: string | null;
}

interface StepProgress {
  step_id: string;
  completed: boolean;
}

export interface TrackerData {
  phases: JourneyPhase[];
  steps: JourneyStep[];
  milestones: TrackerMilestone[];
  userMilestones: UserMilestone[];
  trackerState: TrackerState | null;
  stepProgress: StepProgress[];
  loading: boolean;
  toggleStep: (stepId: string, completed: boolean) => Promise<void>;
  refreshMilestones: () => Promise<void>;
}

const FOCUS_MESSAGES: Record<number, string> = {
  1: "Estás en la fase de descubrimiento. ¡Conocer tu situación es el primer gran paso!",
  2: "Es momento de construir tu base financiera. Con constancia, cada mes cuenta.",
  3: "Explorar opciones de financiación puede acercarte mucho más a tu objetivo.",
  4: "¡Ya puedes empezar a buscar! Tu momento de encontrar tu hogar se acerca.",
  5: "Estás muy cerca. Comparar hipotecas puede ahorrarte mucho dinero.",
  6: "¡Los pasos finales! Tu primera vivienda está al alcance de la mano.",
};

export function determinePhaseFromMonths(months: number): number {
  if (months <= 0) return 6;
  if (months < 12) return 4;
  if (months <= 24) return 3;
  if (months <= 72) return 2;
  return 1;
}

export function useTrackerData(userId: string | undefined, estimatedMonths: number | null): TrackerData {
  const [phases, setPhases] = useState<JourneyPhase[]>([]);
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [milestones, setMilestones] = useState<TrackerMilestone[]>([]);
  const [userMilestones, setUserMilestones] = useState<UserMilestone[]>([]);
  const [trackerState, setTrackerState] = useState<TrackerState | null>(null);
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Load reference data + user data
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      const [pRes, sRes, mRes, umRes, tsRes, spRes] = await Promise.all([
        supabase.from("journey_phases").select("*").order("order_index"),
        supabase.from("journey_steps").select("*").order("order_index"),
        supabase.from("tracker_milestones").select("*").order("percentage_required"),
        supabase.from("user_milestones").select("*").eq("user_id", userId),
        supabase.from("user_tracker_state").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_journey_progress").select("step_id, completed").eq("user_id", userId),
      ]);
      if (pRes.data) setPhases(pRes.data);
      if (sRes.data) setSteps(sRes.data);
      if (mRes.data) setMilestones(mRes.data);
      if (umRes.data) setUserMilestones(umRes.data as UserMilestone[]);
      if (tsRes.data) setTrackerState(tsRes.data as TrackerState);
      if (spRes.data) setStepProgress(spRes.data as StepProgress[]);
      setLoading(false);
    };
    load();
  }, [userId]);

  // Update tracker state when estimatedMonths changes
  useEffect(() => {
    if (!userId || estimatedMonths === null || phases.length === 0) return;
    const orderIdx = determinePhaseFromMonths(estimatedMonths);
    const phase = phases.find(p => p.order_index === orderIdx);
    if (!phase) return;

    const focusMessage = FOCUS_MESSAGES[orderIdx] || "";

    const upsert = async () => {
      const { data: existing } = await supabase
        .from("user_tracker_state")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        await supabase.from("user_tracker_state").update({
          current_phase_id: phase.id,
          focus_message: focusMessage,
          last_calculated_at: new Date().toISOString(),
        }).eq("user_id", userId);
      } else {
        await supabase.from("user_tracker_state").insert({
          user_id: userId,
          current_phase_id: phase.id,
          focus_message: focusMessage,
        });
      }
      setTrackerState({ current_phase_id: phase.id, focus_message: focusMessage });
    };
    upsert();
  }, [userId, estimatedMonths, phases]);

  const toggleStep = useCallback(async (stepId: string, completed: boolean) => {
    if (!userId) return;
    if (completed) {
      await supabase.from("user_journey_progress").upsert({
        user_id: userId,
        step_id: stepId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,step_id" });
    } else {
      await supabase.from("user_journey_progress").delete().eq("user_id", userId).eq("step_id", stepId);
    }
    setStepProgress(prev => {
      const filtered = prev.filter(p => p.step_id !== stepId);
      if (completed) filtered.push({ step_id: stepId, completed: true });
      return filtered;
    });
  }, [userId]);

  const refreshMilestones = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from("user_milestones").select("*").eq("user_id", userId);
    if (data) setUserMilestones(data as UserMilestone[]);
  }, [userId]);

  return { phases, steps, milestones, userMilestones, trackerState, stepProgress, loading, toggleStep, refreshMilestones };
}
