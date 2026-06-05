import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: string | number;
  suffix?: string;
  hint?: string;
  info?: string;
  onAskAI?: () => void;
  className?: string;
}

export function KpiCard({ title, value, suffix, hint, info, onAskAI, className }: Props) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          {title}
          {info && <InfoTooltip content={info} />}
          {onAskAI && (
            <button
              onClick={onAskAI}
              className="ml-auto text-muted-foreground/40 hover:text-brand transition-colors cursor-pointer"
              title="Ask AI about this metric"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {suffix && <span className="text-base font-medium text-muted-foreground">{suffix}</span>}
        </div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}
