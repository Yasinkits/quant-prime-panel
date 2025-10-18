import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Wifi, 
  WifiOff, 
  Activity,
  Clock,
  Zap
} from "lucide-react";
import { BotStatus } from "@/types/trading";

interface ConnectionStatusProps {
  botStatus: BotStatus;
  onStart: () => void;
  onStop: () => void;
  canStartBot?: boolean;
  subscriptionTier?: string;
}

export function ConnectionStatus({ botStatus, onStart, onStop, canStartBot = true, subscriptionTier }: ConnectionStatusProps) {
  const getStatusColor = () => {
    switch (botStatus.connectionStatus) {
      case 'CONNECTED':
        return 'text-trading-profit';
      case 'ERROR':
        return 'text-trading-loss';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (botStatus.connectionStatus) {
      case 'CONNECTED':
        return <Wifi className="w-4 h-4" />;
      case 'ERROR':
        return <WifiOff className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Bot Status</span>
          </div>
          <Badge 
            variant={botStatus.isRunning ? "default" : "secondary"}
            className={botStatus.isRunning ? "shadow-glow-profit" : ""}
          >
            {botStatus.isRunning ? 'RUNNING' : 'STOPPED'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Current bot status and controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={getStatusColor()}>
              {getStatusIcon()}
            </div>
            <span className="text-sm">MT5 Connection</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} border-current`}
          >
            {botStatus.connectionStatus}
          </Badge>
        </div>

        {/* Trading Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Trading Mode</span>
          </div>
          <Badge variant={botStatus.mode === 'REAL' ? "destructive" : "secondary"}>
            {botStatus.mode}
          </Badge>
        </div>

        {/* Uptime */}
        {botStatus.isRunning && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Uptime</span>
            </div>
            <span className="text-sm font-mono">{formatUptime(botStatus.uptime)}</span>
          </div>
        )}

        {/* Last Update */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Update</span>
          <span className="text-xs font-mono">
            {new Date(botStatus.lastUpdate).toLocaleTimeString()}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="pt-4 border-t space-y-2">
          {botStatus.isRunning ? (
            <Button 
              onClick={onStop}
              variant="destructive" 
              className="w-full shadow-glow-loss"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Bot
            </Button>
          ) : (
            <>
              <Button 
                onClick={onStart}
                disabled={!canStartBot}
                className="w-full shadow-glow-profit"
                title={!canStartBot ? 'Upgrade to access bot trading' : ''}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Bot
              </Button>
              {!canStartBot && (
                <p className="text-xs text-muted-foreground text-center">
                  {subscriptionTier === 'basic' ? 'Upgrade to Pro or Premium' : 'Subscribe to start bot'}
                </p>
              )}
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-trading-profit">+$247</div>
            <div className="text-xs text-muted-foreground">Today's P&L</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">12</div>
            <div className="text-xs text-muted-foreground">Trades Today</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}