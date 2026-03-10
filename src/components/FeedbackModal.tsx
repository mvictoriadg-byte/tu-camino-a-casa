import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Step = "select" | "feedback" | "contact" | "success";

const pageContextMap: Record<string, string> = {
  "/": "landing",
  "/simulador": "simulation",
  "/portal": "portal",
  "/auth": "auth",
  "/terminos": "terms",
};

export function FeedbackModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState<Step>("select");
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const { toast } = useToast();

  // Feedback form state
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");

  const resetAndClose = () => {
    setStep("select");
    setFeedbackMsg("");
    setFeedbackEmail("");
    setContactName("");
    setContactEmail("");
    setContactMsg("");
    onOpenChange(false);
  };

  const pageContext = pageContextMap[pathname] || pathname;

  const handleSubmitFeedback = async () => {
    if (!feedbackMsg.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("user_messages").insert({
      type: "feedback",
      message: feedbackMsg.trim(),
      email: feedbackEmail.trim() || null,
      page_context: pageContext,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "No se pudo enviar. Inténtalo de nuevo.", variant: "destructive" });
      return;
    }
    setStep("success");
  };

  const handleSubmitContact = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("user_messages").insert({
      type: "contact",
      message: contactMsg.trim(),
      name: contactName.trim(),
      email: contactEmail.trim(),
      page_context: pageContext,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "No se pudo enviar. Inténtalo de nuevo.", variant: "destructive" });
      return;
    }
    setStep("success");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); else onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>¿En qué podemos ayudarte?</DialogTitle>
              <DialogDescription>Tu feedback nos ayuda a mejorar la herramienta.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-2">
              <Button variant="outline" className="justify-start gap-3 h-auto py-4 text-left" onClick={() => setStep("feedback")}>
                <MessageSquare className="h-5 w-5 shrink-0 text-primary" />
                <span>Dar feedback sobre la herramienta</span>
              </Button>
              <Button variant="outline" className="justify-start gap-3 h-auto py-4 text-left" onClick={() => setStep("contact")}>
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>Contactar con el equipo</span>
              </Button>
            </div>
          </>
        )}

        {step === "feedback" && (
          <>
            <DialogHeader>
              <DialogTitle>Dar feedback</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="feedback-msg">¿Qué podríamos mejorar?</Label>
                <Textarea
                  id="feedback-msg"
                  placeholder="Cuéntanos qué te ha parecido la herramienta o qué mejorarías."
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-email">Email (opcional)</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="Solo si quieres que te respondamos"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setStep("select")}>Atrás</Button>
                <Button onClick={handleSubmitFeedback} disabled={!feedbackMsg.trim() || loading}>
                  {loading ? "Enviando..." : "Enviar feedback"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "contact" && (
          <>
            <DialogHeader>
              <DialogTitle>Contactar con el equipo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Nombre</Label>
                <Input id="contact-name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-msg">Mensaje</Label>
                <Textarea id="contact-msg" placeholder="Escribe tu mensaje" value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} rows={4} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setStep("select")}>Atrás</Button>
                <Button onClick={handleSubmitContact} disabled={!contactName.trim() || !contactEmail.trim() || !contactMsg.trim() || loading}>
                  {loading ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <p className="text-lg font-medium">¡Gracias por tu mensaje!</p>
            <p className="text-sm text-muted-foreground">Nos ayuda a mejorar la herramienta.</p>
            <Button onClick={resetAndClose}>Cerrar</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
