import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Activity, 
  AlertTriangle, 
  DollarSign, 
  Power, 
  Settings, 
  TrendingUp, 
  Zap 
} from "lucide-react";
import { BotStatus, AccountInfo } from "@/types/trading";

interface TradingHeaderProps {
  botStatus: BotStatus;
  accountInfo: AccountInfo;
  onToggleBot: () => void;
  onEmergencyStop: () => void;
}

export function TradingHeader({ 
  botStatus, 
  accountInfo, 
  onToggleBot, 
  onEmergencyStop 
}: TradingHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'status-running';
      case 'DISCONNECTED':
        return 'status-stopped';
      case 'ERROR':
        return 'status-error';
      default:
        return 'status-stopped';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: accountInfo.currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPnL = (pnl: number) => {
    const isProfit = pnl >= 0;
    return {
      amount: formatCurrency(Math.abs(pnl)),
      isProfit,
      className: isProfit ? 'text-trading-profit' : 'text-trading-loss'
    };
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left Section - Bot Status & Brand */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">PRIME AI</h1>
              <p className="text-xs text-muted-foreground">Trading Bot</p>
            </div>
          </div>

          {/* Bot Status Indicator */}
          <Card className="px-3 py-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full bg-${getStatusColor(botStatus.connectionStatus)}`} />
                <span className="text-sm font-medium">
                  {botStatus.isRunning ? 'RUNNING' : 'STOPPED'}
                </span>
              </div>
              <Badge variant={botStatus.mode === 'REAL' ? 'destructive' : 'secondary'}>
                {botStatus.mode}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Center Section - Account Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Balance</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(accountInfo.balance)}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Equity</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(accountInfo.equity)}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Daily P&L</span>
              </div>
              <p className={`text-lg font-bold ${formatPnL(accountInfo.dailyPnL).className}`}>
                {formatPnL(accountInfo.dailyPnL).amount}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Bot</span>
            <Switch 
              checked={botStatus.isRunning}
              onCheckedChange={onToggleBot}
            />
          </div>

          <Button 
            variant="destructive" 
            size="sm"
            onClick={onEmergencyStop}
            className="shadow-glow-loss"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            STOP ALL
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}