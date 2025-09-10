import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Activity, 
  Zap,
  Brain,
  Shield
} from "lucide-react";
import { AccountInfo, RiskMetrics, TradingSignal } from "@/types/trading";

interface TradingOverviewProps {
  accountInfo: AccountInfo;
  riskMetrics: RiskMetrics;
  signals: TradingSignal[];
}

export function TradingOverview({ accountInfo, riskMetrics, signals }: TradingOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: accountInfo.currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const latestSignals = signals.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Account Performance */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <TrendingUp className="h-4 w-4 text-trading-profit" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold text-trading-profit">
                {formatCurrency(accountInfo.totalPnL)}
              </div>
              <p className="text-xs text-muted-foreground">Total P&L</p>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-sm font-medium">{formatPercentage(riskMetrics.winRate)}</div>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{riskMetrics.totalTrades}</div>
                <p className="text-xs text-muted-foreground">Total Trades</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Management</CardTitle>
          <Shield className="h-4 w-4 text-trading-warning" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold text-trading-loss">
                {formatPercentage(riskMetrics.currentDrawdown)}
              </div>
              <p className="text-xs text-muted-foreground">Current Drawdown</p>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-sm font-medium">{riskMetrics.profitFactor.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Profit Factor</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{riskMetrics.sharpeRatio.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Signals */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Signals</CardTitle>
          <Brain className="h-4 w-4 text-trading-info" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {latestSignals.map((signal, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={signal.signal === 'BUY' ? 'default' : signal.signal === 'SELL' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {signal.signal}
                  </Badge>
                  <span className="text-sm font-medium">{signal.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{signal.confidence}%</div>
                  <div className="text-xs text-muted-foreground">
                    {signal.source === 'AI' ? <Brain className="w-3 h-3 inline" /> : <BarChart3 className="w-3 h-3 inline" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Status */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activity</CardTitle>
          <Activity className="h-4 w-4 text-status-running" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold">
                {formatCurrency(accountInfo.freeMargin)}
              </div>
              <p className="text-xs text-muted-foreground">Free Margin</p>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-sm font-medium">{accountInfo.marginLevel.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">Margin Level</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-status-running" />
                  <span className="text-sm font-medium text-status-running">LIVE</span>
                </div>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}