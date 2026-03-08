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
import { calculateAffordability, type AffordabilityResult, type UserProfile, formatCurrency } from "@/lib/housing-data";
import {
  Home, LogOut, User, TrendingUp, Heart, Plus, Trash2, ExternalLink, ArrowLeft, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WishlistItem {
  id: string;
  url: string;
  title: string;
  estimated_price: number;
  notes: string;
  created_at: string;
}

const Portal = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string; email: string } | null>(null);
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);

    const [profileRes, financialRes, wishlistRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("user_financial_data").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1),
      supabase.from("user_wishlist").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    if (profileRes.data) setProfile({ display_name: profileRes.data.display_name || "", email: profileRes.data.email || "" });

    if (financialRes.data && financialRes.data.length > 0) {
      const fd = financialRes.data[0];
      if (fd.result_json) {
        setResult(fd.result_json as unknown as AffordabilityResult);
      }
    }

    if (wishlistRes.data) setWishlist(wishlistRes.data as WishlistItem[]);

    setLoadingData(false);
  };

  const addWishlistItem = async () => {
    if (!user || !newUrl.trim()) return;
    const { data, error } = await supabase.from("user_wishlist").insert({
      user_id: user.id,
      url: newUrl.trim(),
      title: newTitle.trim() || "Sin título",
      estimated_price: Number(newPrice) || 0,
    }).select().single();

    if (error) {
      toast.error("Error al guardar");
      return;
    }
    setWishlist(prev => [data as WishlistItem, ...prev]);
    setNewUrl("");
    setNewTitle("");
    setNewPrice("");
    toast.success("Propiedad guardada en tu wishlist");
  };

  const removeWishlistItem = async (id: string) => {
    await supabase.from("user_wishlist").delete().eq("id", id);
    setWishlist(prev => prev.filter(w => w.id !== id));
    toast.success("Eliminada de tu wishlist");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-dark)" }}>
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-dark)" }}>
      <div className="container max-w-6xl py-6 px-4 sm:px-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Hola, {profile?.display_name || "usuario"} 👋</h1>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
          </Button>
        </motion.header>

        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="roadmap" className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" /> Mi Plan
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap">
            {result ? (
              <Dashboard result={result} />
            ) : (
              <Card className="glow-card">
                <CardContent className="p-12 text-center">
                  <Home className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aún no tienes un plan</h3>
                  <p className="text-muted-foreground text-sm mb-6">Rellena el formulario en la página principal para generar tu plan personalizado</p>
                  <Button onClick={() => navigate("/")}>
                    <Home className="h-4 w-4 mr-2" /> Ir al calculador
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            <Card className="glow-card mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Añadir propiedad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">URL (Idealista, Fotocasa...)</Label>
                    <Input placeholder="https://idealista.com/..." value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Título</Label>
                    <Input placeholder="Piso en Madrid centro" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Precio estimado (€)</Label>
                    <Input type="number" placeholder="250000" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                  </div>
                </div>
                <Button onClick={addWishlistItem} disabled={!newUrl.trim()} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" /> Guardar propiedad
                </Button>
              </CardContent>
            </Card>

            {wishlist.length === 0 ? (
              <Card className="glow-card">
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tu wishlist está vacía</h3>
                  <p className="text-muted-foreground text-sm">Guarda propiedades que te interesen de Idealista, Fotocasa, etc.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {wishlist.map(item => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glow-card">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{item.title}</p>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 truncate">
                            <ExternalLink className="h-3 w-3 shrink-0" /> {item.url}
                          </a>
                          {item.estimated_price > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(item.estimated_price)}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeWishlistItem(item.id)} className="shrink-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Tu perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Nombre</Label>
                  <p className="text-sm font-medium">{profile?.display_name || "—"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{profile?.email || "—"}</p>
                </div>
                <Button variant="outline" onClick={() => navigate("/")}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Actualizar mi plan financiero
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portal;
