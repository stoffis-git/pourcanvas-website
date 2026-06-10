import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PricingCards from "./PricingCards";

interface PaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Paywall = ({ open, onOpenChange }: PaywallProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border/60 bg-card p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="px-6 pt-7 pb-5 text-center border-b border-border/50 bg-gradient-to-b from-primary/10 to-transparent">
          <DialogHeader className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
              <Sparkles className="h-6 w-6 text-foreground" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Your new space is ready
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground max-w-md mx-auto">
              Unlock this redesign in full resolution and keep exploring looks —
              pick the plan that fits your project.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <PricingCards compact />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Paywall;
