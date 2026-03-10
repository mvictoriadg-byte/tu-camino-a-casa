import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

export function AppFooter() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-border/40 py-4 mt-auto">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircleQuestion className="h-4 w-4" />
            Ayuda y feedback
          </button>
        </div>
      </footer>
      <FeedbackModal open={open} onOpenChange={setOpen} />
    </>
  );
}
