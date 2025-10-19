import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface MT5StatusIndicatorProps {
  isConnected: boolean;
}

export function MT5StatusIndicator({ isConnected }: MT5StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4 text-trading-profit" />
          <span className="text-sm font-medium">MT5 Connected</span>
          <Badge variant="default" className="bg-trading-profit text-white">Active</Badge>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">MT5 Disconnected</span>
          <Badge variant="secondary">Inactive</Badge>
        </>
      )}
    </div>
  );
}
