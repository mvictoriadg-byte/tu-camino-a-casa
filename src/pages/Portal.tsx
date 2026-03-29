import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dashboard from "@/components/Dashboard";
import SavingsProgressTracker from "@/components/SavingsProgressTracker";
import ScenarioComparison from "@/components/ScenarioComparison";
import InputForm from "@/components/InputForm";
import { calculateAffordability, type AffordabilityResult, type UserProfile, formatCurrency, cityData } from "@/lib/housing-data";
import { fetchHousingAids, filterEligibleAids, calculateAidsImpact, type EligibleAid, type AidsImpactSummary, type HousingAid } from "@/lib/housing-aids";
import TrackerSection from "@/components/TrackerSection";
import JourneyPath from "@/components/JourneyPath";
import { useTrackerData } from "@/hooks/use-tracker-data";
import logoHouse from "@/assets/logo-house.png";
import { Home, LogOut, User, TrendingUp, Heart, Plus, Trash2, ExternalLink, ArrowLeft, RefreshCw, Building2, AlertTriangle, Map, Compass } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WishlistItem { id: string; url: string; title: string; estimated_price: number; notes: string; created_at: string; }

const Portal = () => {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string; email: string } | null>(null);
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [savedFormData, setSavedFormData] = useState<Partial<UserProfile> | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [allAids, setAllAids] = useState<HousingAid[]>([]);
  const [eligibleAids, setEligibleAids] = useState<EligibleAid[]>([]);
  const [aidsImpact, setAidsImpact] = useState<AidsImpactSummary | null>(null);
  const [aidsEnabled, setAidsEnabled] = useState(true);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const estimatedMonths = result?.monthsToSave ?? null;
  const trackerData = useTrackerData(user?.id, estimatedMonths);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) loadData(); }, [user]);
  useEffect(() => { fetchHousingAids().then(setAllAids); }, []);

  const computeAids = (profile: UserProfile, r: AffordabilityResult, aids: HousingAid[]) => {
    const region = profile.comunidad || cityData[profile.city]?.region || "España";
    const eligible = filterEligibleAids(aids, {
      region, age: profile.age,
      annualIncome: profile.monthlyIncome * 12, estimatedPrice: r.estimatedPrice,
      firstHome: profile.firstHome,
    });
    setEligibleAids(eligible);
    if (eligible.length > 0) {
      const impact = calculateAidsImpact(eligible, {
        estimatedPrice: r.estimatedPrice, currentMortgagePercent: profile.mortgagePercent,
        totalUpfront: r.totalUpfront, totalSavings: r.totalSavings,
        totalMonthlySavings: r.totalMonthlySavings, taxesAndFees: r.taxesAndFees,
        reformCostEstimate: r.reformCostEstimate,
      });
      setAidsImpact(impact);
    } else {
      setAidsImpact(null);
    }
  };

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);
    const [p, f, w] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_financial_data").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1),
      supabase.from("user_wishlist").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (p.data) setProfile({ display_name: p.data.display_name || "", email: p.data.email || "" });
    if (f.data?.length && f.data[0].result_json) {
      const r = f.data[0].result_json as unknown as AffordabilityResult;
      setResult(r);
      const d = f.data[0];
      const formData: Partial<UserProfile> = {
        city: d.city, age: d.age, employmentStatus: d.employment_status,
        comunidad: (d as any).comunidad || undefined,
        ciudad: (d as any).ciudad || undefined,
        monthlyIncome: Number(d.monthly_income), savings: Number(d.savings),
        monthlySavings: Number(d.monthly_savings), monthlyDebts: Number(d.monthly_debts),
        numBuyers: d.num_buyers, coBuyers: d.co_buyers as any || [],
        mortgagePercent: d.mortgage_percent,
        firstHome: (d as any).first_home !== undefined ? (d as any).first_home : true,
        numberOfChildren: (d as any).number_of_children || 0,
        preferences: { propertyType: d.property_type, size: String(d.size_sqm), rooms: d.rooms, zone: d.zone, reformState: d.reform_state },
      };
      setSavedFormData(formData);
      if (allAids.length > 0) computeAids(formData as UserProfile, r, allAids);
    }
    if (w.data) setWishlist(w.data as WishlistItem[]);
    setLoadingData(false);
  };

  useEffect(() => {
    if (allAids.length > 0 && result && savedFormData?.city) {
      computeAids(savedFormData as UserProfile, result, allAids);
    }
  }, [allAids]);

  const addWishlistItem = async () => {
    if (!user || !newUrl.trim()) return;
    const { data, error } = await supabase.from("user_wishlist").insert({ user_id: user.id, url: newUrl.trim(), title: newTitle.trim() || "Sin título", estimated_price: Number(newPrice) || 0 }).select().single();
    if (error) { toast.error("Error al guardar"); return; }
    setWishlist(prev => [data as WishlistItem, ...prev]);
    setNewUrl(""); setNewTitle(""); setNewPrice("");
    toast.success("Propiedad guardada");
  };

  const removeWishlistItem = async (id: string) => {
    await supabase.from("user_wishlist").delete().eq("id", id);
    setWishlist(prev => prev.filter(w => w.id !== id));
    toast.success("Eliminada");
  };

  const resetTrackerProgress = async () => {
    if (!user) return;
    await supabase.from("savings_progress").delete().eq("user_id", user.id);
  };

  const handleRecalculate = async (profileData: UserProfile) => {
    if (!user) return;
    if (result) {
      setPendingProfile(profileData);
      setShowUpdateConfirm(true);
      return;
    }
    await executeRecalculate(profileData);
  };

  const executeRecalculate = async (profileData: UserProfile) => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const r = calculateAffordability(profileData);
    setResult(r);
    computeAids(profileData, r, allAids);
    setIsCalculating(false);
    try {
      const { data: existing } = await supabase.from("user_financial_data").select("id").eq("user_id", user!.id).limit(1);
      const payload: any = {
        user_id: user!.id, city: profileData.city, age: profileData.age, employment_status: profileData.employmentStatus,
        monthly_income: profileData.monthlyIncome, savings: profileData.savings, monthly_savings: profileData.monthlySavings,
        monthly_debts: profileData.monthlyDebts, num_buyers: profileData.numBuyers, co_buyers: profileData.coBuyers as any,
        property_type: profileData.preferences.propertyType, size_sqm: Number(profileData.preferences.size),
        rooms: profileData.preferences.rooms, zone: profileData.preferences.zone, reform_state: profileData.preferences.reformState,
        mortgage_percent: profileData.mortgagePercent, result_json: r as any,
        number_of_children: profileData.numberOfChildren, first_home: profileData.firstHome,
        comunidad: profileData.comunidad || null, ciudad: profileData.ciudad || null,
      };
      if (existing && existing.length > 0) {
        await supabase.from("user_financial_data").update(payload).eq("id", existing[0].id);
      } else {
        await supabase.from("user_financial_data").insert(payload);
      }
      setSavedFormData(profileData);
      toast.success("Plan actualizado y guardado");
    } catch { toast.error("Error al guardar"); }
  };

  const handleConfirmUpdate = async () => {
    setShowUpdateConfirm(false);
    if (!pendingProfile) return;
    await resetTrackerProgress();
    await executeRecalculate(pendingProfile);
    setPendingProfile(null);
  };

  // Compute scenario comparison data
  const getScenarioData = () => {
    if (!result || !savedFormData) return null;
    const currentYears = result.yearsToSave;
    const currentMonths = result.monthsToSave;
    const aidsYears = aidsImpact ? aidsImpact.adjustedYearsToSave : null;
    const aidsMonths = aidsImpact ? aidsImpact.adjustedMonthsToSave : null;

    // +200€/month scenario
    const extraMonthlySavings = result.totalMonthlySavings + 200;
    const gap = Math.max(0, result.totalUpfront - result.totalSavings);
    const extraMonths = extraMonthlySavings > 0 ? Math.ceil(gap / extraMonthlySavings) : 0;
    const extraYears = Math.round((extraMonths / 12) * 10) / 10;

    return { currentYears, currentMonths, aidsYears, aidsMonths, extraSavingsYears: extraYears, extraSavingsMonths: extraMonths };
  };

  if (authLoading || loadingData) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando tu portal...</p>
      </div>
    </div>
  );

  const scenarioData = getScenarioData();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between py-5 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full"><ArrowLeft className="h-5 w-5" /></Button>
            <button onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <img src={logoHouse} alt="Camino a casa" className="h-7 w-7 object-contain" />
              <span className="font-semibold text-lg">Camino a casa</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{profile?.display_name || "Usuario"}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }} className="rounded-full">
              <LogOut className="h-4 w-4 mr-1.5" /> Salir
            </Button>
          </div>
        </div>
      </nav>

      <div className="container max-w-6xl py-8 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Hola, {profile?.display_name || "usuario"} 👋</h1>
          <p className="text-muted-foreground mt-1">Tu centro de control para comprar casa</p>
        </motion.div>

        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="bg-muted rounded-full p-1 h-auto flex-wrap">
            <TabsTrigger value="roadmap" className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"><TrendingUp className="h-4 w-4 mr-1.5" /> Mi Plan</TabsTrigger>
            {import.meta.env.DEV && <TabsTrigger value="tracker" className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"><Map className="h-4 w-4 mr-1.5" /> Tracker</TabsTrigger>}
            <TabsTrigger value="wishlist" className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"><Heart className="h-4 w-4 mr-1.5" /> Wishlist</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"><User className="h-4 w-4 mr-1.5" /> Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap">
            {result ? (
              <div className="space-y-6">
                {/* 1. Dashboard: hero + plan summary + estimated time + costs + housing aids + banks */}
                <Dashboard result={result} eligibleAids={eligibleAids} aidsImpact={aidsImpact} aidsEnabled={aidsEnabled} onToggleAids={setAidsEnabled} />

                {/* 2. Savings progress tracker */}
                {user && (
                  <SavingsProgressTracker
                    userId={user.id}
                    totalUpfront={aidsEnabled && aidsImpact ? aidsImpact.adjustedTotalUpfront : result.totalUpfront}
                    monthlySavingsTarget={result.totalMonthlySavings}
                    currentSavings={result.totalSavings}
                  />
                )}

                {/* 3. Scenario comparison */}
                {scenarioData && (
                  <ScenarioComparison
                    currentYears={scenarioData.currentYears}
                    currentMonths={scenarioData.currentMonths}
                    aidsYears={scenarioData.aidsYears}
                    aidsMonths={scenarioData.aidsMonths}
                    extraSavingsYears={scenarioData.extraSavingsYears}
                    extraSavingsMonths={scenarioData.extraSavingsMonths}
                    totalUpfront={result.totalUpfront}
                    totalSavings={result.totalSavings}
                    monthlySavings={result.totalMonthlySavings}
                  />
                )}
              </div>
            ) : (
              <Card className="glow-card">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"><Home className="h-8 w-8 text-primary" /></div>
                  <h3 className="text-xl font-bold mb-2">Aún no tienes un plan</h3>
                  <p className="text-muted-foreground text-sm mb-6">Rellena el formulario para generar tu plan</p>
                  <Button className="rounded-full font-bold" onClick={() => navigate("/")}><Home className="h-4 w-4 mr-2" /> Ir al calculador</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {import.meta.env.DEV && (
          <TabsContent value="tracker">
            {result && user ? (
              <TrackerSection
                tracker={trackerData}
                userId={user.id}
                currentSavings={result.totalSavings}
                savingsTarget={aidsEnabled && aidsImpact ? aidsImpact.adjustedTotalUpfront : result.totalUpfront}
              />
            ) : (
              <Card className="glow-card">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"><Map className="h-8 w-8 text-primary" /></div>
                  <h3 className="text-xl font-bold mb-2">Tu tracker estará disponible cuando tengas un plan</h3>
                  <p className="text-muted-foreground text-sm mb-6">Primero completa el simulador para generar tu plan personalizado.</p>
                  <Button className="rounded-full font-bold" onClick={() => navigate("/")}><Home className="h-4 w-4 mr-2" /> Ir al calculador</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          )}

          <TabsContent value="wishlist">
            <Card className="glow-card mb-6">
              <CardHeader className="pb-3"><CardTitle className="text-lg font-bold flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Añadir propiedad</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">URL</Label><Input placeholder="https://idealista.com/..." value={newUrl} onChange={e => setNewUrl(e.target.value)} className="rounded-xl" /></div>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">Título</Label><Input placeholder="Piso en Madrid" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="rounded-xl" /></div>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">Precio (€)</Label><Input type="number" placeholder="250000" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="rounded-xl" /></div>
                </div>
                <Button onClick={addWishlistItem} disabled={!newUrl.trim()} className="rounded-full font-bold"><Plus className="h-4 w-4 mr-2" /> Guardar</Button>
              </CardContent>
            </Card>
            {wishlist.length === 0 ? (
              <Card className="glow-card"><CardContent className="p-12 text-center"><Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">Tu wishlist está vacía</h3><p className="text-muted-foreground text-sm">Guarda propiedades de Idealista, Fotocasa, etc.</p></CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((item, i) => {
                  const domain = (() => { try { return new URL(item.url).hostname; } catch { return ""; } })();
                  const thumbnailUrl = `https://image.thum.io/get/width/600/crop/400/${item.url}`;
                  const faviconUrl = domain ? `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://${domain}` : "";
                  const gradientColors = ["from-primary/20 to-accent/20", "from-blue-500/20 to-purple-500/20", "from-emerald-500/20 to-teal-500/20", "from-orange-500/20 to-rose-500/20"];
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="glow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="relative h-40 overflow-hidden">
                          <img src={thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={e => { const target = e.target as HTMLImageElement; target.style.display = "none"; target.nextElementSibling?.classList.remove("hidden"); }} />
                          <div className={`hidden w-full h-full bg-gradient-to-br ${gradientColors[i % gradientColors.length]} items-center justify-center absolute inset-0`}>
                            <Building2 className="h-12 w-12 text-muted-foreground/40" />
                          </div>
                          {item.estimated_price > 0 && (
                            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
                              <span className="text-sm font-extrabold">{formatCurrency(item.estimated_price)}</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {faviconUrl && <img src={faviconUrl} alt="" className="h-4 w-4 rounded-sm shrink-0" />}
                                <p className="font-bold text-sm truncate">{item.title}</p>
                              </div>
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate transition-colors">
                                <ExternalLink className="h-3 w-3 shrink-0" /> {domain || item.url}
                              </a>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeWishlistItem(item.id)} className="shrink-0 text-muted-foreground hover:text-destructive rounded-full h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card className="glow-card">
                <CardHeader><CardTitle className="text-lg font-bold flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Tu perfil</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label className="text-sm font-semibold text-muted-foreground">Nombre</Label><p className="text-base font-bold">{profile?.display_name || "—"}</p></div>
                  <div><Label className="text-sm font-semibold text-muted-foreground">Email</Label><p className="text-base font-bold">{profile?.email || "—"}</p></div>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-lg font-extrabold mb-1 flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" /> Actualizar mis datos</h3>
                <p className="text-sm text-muted-foreground mb-4">Modifica tus preferencias y recalcula tu plan sin salir de aquí.</p>
                <InputForm
                  onCalculate={handleRecalculate}
                  isCalculating={isCalculating}
                  initialValues={savedFormData || undefined}
                  submitLabel="Actualizar mi plan"
                  hideFooterNote
                />
              </div>
              <Card className="border-destructive/30">
                <CardHeader><CardTitle className="text-lg font-bold flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /> Zona de peligro</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Eliminar tu cuenta borrará permanentemente todos tus datos, incluyendo tu plan, progreso de ahorro y wishlist.</p>
                  <Button variant="destructive" className="rounded-full font-bold" onClick={() => setDeleteStep(1)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Eliminar cuenta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation dialog */}
      <AlertDialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Actualizar tu plan?</AlertDialogTitle>
            <AlertDialogDescription>
              Si actualizas tu plan con estos nuevos datos, tu progreso de ahorro se reiniciará.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingProfile(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>Actualizar mi plan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete account - Step 1 */}
      <AlertDialog open={deleteStep === 1} onOpenChange={(open) => { if (!open) setDeleteStep(0); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Eliminar cuenta</AlertDialogTitle>
            <AlertDialogDescription>
              ⚠️ Esta acción eliminará permanentemente tu cuenta. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteStep(0)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => setDeleteStep(2)}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete account - Step 2 */}
      <AlertDialog open={deleteStep === 2} onOpenChange={(open) => { if (!open && !isDeleting) setDeleteStep(0); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea eliminar la cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. Se eliminarán todos tus datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setDeleteStep(0)}>No</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                if (isDeleting) return;

                if (!session?.access_token) {
                  toast.error("Tu sesión ha expirado. Inicia sesión de nuevo.");
                  navigate("/auth");
                  return;
                }

                setIsDeleting(true);
                try {
                  const res = await supabase.functions.invoke("delete-account", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${session.access_token}` },
                  });

                  if (res.error) {
                    throw new Error(res.error.message || "Error al eliminar la cuenta");
                  }

                  toast.success("Tu cuenta y todos tus datos han sido eliminados.");
                  await signOut();
                  navigate("/");
                } catch (error) {
                  console.error("delete-account error:", error);
                  toast.error("No se pudo eliminar tu cuenta. Vuelve a iniciar sesión e inténtalo de nuevo.");
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? "Eliminando..." : "Eliminar mi cuenta definitivamente"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Portal;
