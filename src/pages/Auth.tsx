import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Mail, Lock, User, ArrowRight } from "lucide-react";
import logoHouse from "@/assets/logo-house.png";
import { useEffect } from "react";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate("/portal"); }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de vuelta!");
        navigate("/portal");
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        toast.success("¡Cuenta creada! Revisa tu email.");
      }
    } catch (err: any) { toast.error(err.message || "Error"); } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/portal" });
      if (result.error) throw result.error;
    } catch (err: any) { toast.error(err.message || "Error con Google"); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container max-w-6xl flex items-center py-5 px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <img src={logoHouse} alt="Camino a casa" className="h-7 w-7 object-contain" />
            <span className="font-semibold text-lg tracking-tight">Camino a casa</span>
          </button>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}</h1>
            <p className="text-muted-foreground">{isLogin ? "Accede a tu plan y haz seguimiento" : "Guarda tu plan y accede cuando quieras"}</p>
          </div>
          <Card className="glow-card">
            <CardContent className="p-6 space-y-5">
              <Button variant="outline" className="w-full rounded-full h-12 font-semibold text-base" onClick={handleGoogleSignIn} disabled={loading}>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continuar con Google
              </Button>
              <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground font-medium">o con email</span></div></div>
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {!isLogin && (<div className="space-y-1.5"><Label className="text-sm font-semibold flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /> Nombre</Label><Input placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required={!isLogin} className="h-11 rounded-xl" /></div>)}
                <div className="space-y-1.5"><Label className="text-sm font-semibold flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email</Label><Input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-11 rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-sm font-semibold flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-muted-foreground" /> Contraseña</Label><Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="h-11 rounded-xl" /></div>
                <Button type="submit" size="lg" className="w-full rounded-full font-bold text-base h-12" disabled={loading}>{isLogin ? "Iniciar sesión" : "Crear cuenta"} <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </form>
              <p className="text-center text-sm text-muted-foreground">{isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}<button className="text-foreground font-bold hover:underline" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Regístrate" : "Inicia sesión"}</button></p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;