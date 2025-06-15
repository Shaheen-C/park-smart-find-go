
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CashPaymentToggleProps {
  acceptsCash: boolean;
  onToggle: (accepts: boolean) => void;
}

const CashPaymentToggle = ({ acceptsCash, onToggle }: CashPaymentToggleProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="cash-payment" className="text-sm font-medium">
        Payment Options
      </Label>
      <div className="flex items-center space-x-2">
        <Switch
          id="cash-payment"
          checked={acceptsCash}
          onCheckedChange={onToggle}
        />
        <Label htmlFor="cash-payment" className="text-sm">
          Accept cash payment on arrival
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Allow customers to pay in cash when they arrive at your parking space
      </p>
    </div>
  );
};

export default CashPaymentToggle;
