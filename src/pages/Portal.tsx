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
import { type AffordabilityResult, formatCurrency } from "@/lib/housing-data";
import { Home, LogOut, User, TrendingUp, Heart, Plus, Trash2, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WishlistItem { id: string; url: string; title: string; estimated_price: number; notes: string; created_at: string; }

const Portal = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string; email: string } | null>(null);
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [newUrl, setNewUrl] = useState(""); const [newTitle, setNewTitle] = useState(""); const [newPrice, setNewPrice] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return; setLoadingData(true);
    const [p, f, w] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("user_financial_data").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1),
      supabase.from("user_wishlist").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (p.data) setProfile({ display_name: p.data.display_name || "", email: p.data.email || "" });
    if (f.data?.length && f.data[0].result_json) setResult(f.data[0].result_json as unknown as AffordabilityResult);
    if (w.data) setWishlist(w.data as WishlistItem[]);
    setLoadingData(false);
  };

  const addWishlistItem = async () => {
    if (!user || !newUrl.trim()) return;
    const { data, error } = await supabase.from("user_wishlist").insert({ user_id: user.id, url: newUrl.trim(), title: newTitle.trim() || "Sin título", estimated_price: Number(newPrice) || 0 }).select().single();
    if (error) { toast.error("Error al guardar"); return; }
    setWishlist(prev => [data as WishlistItem, ...prev]); setNewUrl(""); setNewTitle(""); setNewPrice("");
    toast.success("Propiedad guardada");
  };

  const removeWishlistItem = async (id: string) => { await supabase.from("user_wishlist").delete().eq("id", id); setWishlist(prev => prev.filter(w => w.id !== id)); toast.success("Eliminada"); };

  if (authLoading || loadingData) return (
    <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-center"><RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" /><p className="text-muted-foreground">Cargando tu portal...</p></div></div>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full"><ArrowLeft className="h-5 w-5" /></Button>
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center"><Home className="h-4 w-4 text-primary-foreground" /></div>
              <span className="font-extrabold text-lg">Tu camino a casa</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block"><p className="text-sm font-bold">{profile?.display_name || "Usuario"}</p><p className="text-xs text-muted-foreground">{profile?.email}</p></div>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }} className="rounded-full"><LogOut className="h-4 w-4 mr-1.5" /> Salir</Button>
          </div>
        </div>
      </nav>
      <div className="container max-w-6xl py-8 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Hola, {profile?.display_name || "usuario"} 👋</h1>
          <p className="text-muted-foreground mt-1">Tu centro de control para comprar casa</p>
        </motion.div>
        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="bg-muted rounded-full p-1 h-auto">
            <TabsTrigger value="roadmap" className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"><TrendingUp className="h-4 w-4 mr-1.5" /> Mi Plan</TabsTrigger>
            <TabsTrigger value="wishlist" className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"><Heart className="h-4 w-4 mr-1.5" /> Wishlist</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"><User className="h-4 w-4 mr-1.5" /> Perfil</TabsTrigger>
          </TabsList>
          <TabsContent value="roadmap">
            {result ? <Dashboard result={result} /> : (
              <Card className="glow-card"><CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"><Home className="h-8 w-8 text-primary" /></div>
                <h3 className="text-xl font-bold mb-2">Aún no tienes un plan</h3><p className="text-muted-foreground text-sm mb-6">Rellena el formulario para generar tu plan</p>
                <Button className="rounded-full font-bold" onClick={() => navigate("/")}><Home className="h-4 w-4 mr-2" /> Ir al calculador</Button>
              </CardContent></Card>
            )}
          </TabsContent>
          <TabsContent value="wishlist">
            <Card className="glow-card mb-6"><CardHeader className="pb-3"><CardTitle className="text-lg font-bold flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Añadir propiedad</CardTitle></CardHeader>
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
              <div className="space-y-3">{wishlist.map(item => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Card className="glow-card"><CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{item.title}</p><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 truncate"><ExternalLink className="h-3 w-3 shrink-0" /> {item.url}</a>{item.estimated_price > 0 && <p className="text-sm font-bold mt-1">{formatCurrency(item.estimated_price)}</p>}</div>
                  <Button variant="ghost" size="icon" onClick={() => removeWishlistItem(item.id)} className="shrink-0 text-destructive hover:text-destructive rounded-full"><Trash2 className="h-4 w-4" /></Button>
                </CardContent></Card></motion.div>
              ))}</div>
            )}
          </TabsContent>
          <TabsContent value="profile">
            <Card className="glow-card"><CardHeader><CardTitle className="text-lg font-bold flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Tu perfil</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label className="text-sm font-semibold text-muted-foreground">Nombre</Label><p className="text-base font-bold">{profile?.display_name || "—"}</p></div>
                <div><Label className="text-sm font-semibold text-muted-foreground">Email</Label><p className="text-base font-bold">{profile?.email || "—"}</p></div>
                <Button variant="outline" className="rounded-full font-bold" onClick={() => navigate("/")}><RefreshCw className="h-4 w-4 mr-2" /> Actualizar mi plan</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portal;