import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, 
  Brain, 
  BarChart3, 
  Target, 
  Shield, 
  Zap,
  Save
} from "lucide-react";
import { BotConfig } from "@/types/trading";

interface BotConfigPanelProps {
  config: BotConfig;
  onConfigChange: (config: BotConfig) => void;
  onSaveConfig: () => void;
}

export function BotConfigPanel({ config, onConfigChange, onSaveConfig }: BotConfigPanelProps) {
  const availableSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD'];
  
  const updateConfig = (field: keyof BotConfig, value: any) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trading Configuration */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Trading Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trading Mode */}
          <div className="space-y-2">
            <Label>Trading Mode</Label>
            <Select 
              value={config.tradingMode} 
              onValueChange={(value: 'REAL' | 'DEMO') => updateConfig('tradingMode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEMO">Demo Mode</SelectItem>
                <SelectItem value="REAL">Real Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Signal Mode */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <span>Signal Mode</span>
              <Badge variant={config.signalMode === 'ai' ? 'default' : 'secondary'}>
                {config.signalMode === 'ai' ? <Brain className="w-3 h-3 mr-1" /> : <BarChart3 className="w-3 h-3 mr-1" />}
                {config.signalMode.toUpperCase()}
              </Badge>
            </Label>
            <div className="flex items-center space-x-3">
              <span className="text-sm">Indicator</span>
              <Switch 
                checked={config.signalMode === 'ai'}
                onCheckedChange={(checked) => updateConfig('signalMode', checked ? 'ai' : 'indicator')}
              />
              <span className="text-sm">AI Engine</span>
            </div>
          </div>

          {/* Lot Size */}
          <div className="space-y-2">
            <Label>Lot Size</Label>
            <Input
              type="number"
              step="0.01"
              value={config.lotSize}
              onChange={(e) => updateConfig('lotSize', parseFloat(e.target.value))}
              className="font-mono"
            />
          </div>

          {/* Loop Interval */}
          <div className="space-y-2">
            <Label>Loop Interval (seconds)</Label>
            <Input
              type="number"
              value={config.loopInterval}
              onChange={(e) => updateConfig('loopInterval', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Risk Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Per Trade */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Risk Per Trade</Label>
              <span className="text-sm font-mono">{config.riskPerTrade}%</span>
            </div>
            <Slider
              value={[config.riskPerTrade]}
              onValueChange={([value]) => updateConfig('riskPerTrade', value)}
              min={0.5}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Max Daily Trades */}
          <div className="space-y-2">
            <Label>Max Daily Trades</Label>
            <Input
              type="number"
              value={config.maxDailyTrades}
              onChange={(e) => updateConfig('maxDailyTrades', parseInt(e.target.value))}
            />
          </div>

          {/* Max Concurrent Positions */}
          <div className="space-y-2">
            <Label>Max Concurrent Positions</Label>
            <Input
              type="number"
              value={config.maxConcurrentPositions}
              onChange={(e) => updateConfig('maxConcurrentPositions', parseInt(e.target.value))}
            />
          </div>

          {/* Stop Loss & Take Profit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stop Loss (pips)</Label>
              <Input
                type="number"
                value={config.stopLoss}
                onChange={(e) => updateConfig('stopLoss', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Take Profit (pips)</Label>
              <Input
                type="number"
                value={config.takeProfit}
                onChange={(e) => updateConfig('takeProfit', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Daily Loss Limit */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Daily Loss Limit</Label>
              <span className="text-sm font-mono">{config.dailyLossLimit}%</span>
            </div>
            <Slider
              value={[config.dailyLossLimit]}
              onValueChange={([value]) => updateConfig('dailyLossLimit', value)}
              min={1}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      {config.signalMode === 'ai' && (
        <Card className="bg-gradient-card border-border shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Engine Configuration</span>
              <Badge variant="outline" className="bg-trading-info/20 text-trading-info border-trading-info">
                Advanced
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Confidence Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>AI Confidence Threshold</Label>
                  <span className="text-sm font-mono">{config.aiConfidenceThreshold}%</span>
                </div>
                <Slider
                  value={[config.aiConfidenceThreshold]}
                  onValueChange={([value]) => updateConfig('aiConfidenceThreshold', value)}
                  min={50}
                  max={95}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Max Drawdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Max Drawdown</Label>
                  <span className="text-sm font-mono">{config.maxDrawdown}%</span>
                </div>
                <Slider
                  value={[config.maxDrawdown]}
                  onValueChange={([value]) => updateConfig('maxDrawdown', value)}
                  min={5}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* AI Status Indicators */}
              <div className="space-y-3">
                <Label>AI Model Status</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model Training</span>
                    <Badge variant="default" className="bg-status-running text-status-running-foreground">
                      <Zap className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prediction Accuracy</span>
                    <span className="text-sm font-mono text-trading-profit">87.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Configuration */}
      <div className="lg:col-span-2">
        <Button onClick={onSaveConfig} className="w-full shadow-glow-profit">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}