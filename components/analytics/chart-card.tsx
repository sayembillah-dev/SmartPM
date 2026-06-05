import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  info?: string;
  onAskAI?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, info, onAskAI, className, children }: Props) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-1.5">
          {title}
          {info && <InfoTooltip content={info} />}
          {onAskAI && (
            <button
              onClick={onAskAI}
              className="ml-auto text-muted-foreground/40 hover:text-brand transition-colors cursor-pointer"
              title="Ask AI about this chart"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </button>
          )}
        </CardTitle>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="flex-1 pt-0">{children}</CardContent>
    </Card>
  );
}
