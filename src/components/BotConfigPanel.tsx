import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Brain, 
  TrendingUp, 
  Shield,
  Save,
  RotateCcw
} from "lucide-react";
import { BotConfig } from "@/types/trading";

interface BotConfigPanelProps {
  config: BotConfig;
  onChange: (config: BotConfig) => void;
}

export function BotConfigPanel({ config, onChange }: BotConfigPanelProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const updateConfig = (updates: Partial<BotConfig>) => {
    const newConfig = { ...config, ...updates };
    onChange(newConfig);
    setHasChanges(true);
  };

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Bot configuration has been updated successfully",
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to default values
    const defaultConfig: BotConfig = {
      tradingMode: 'DEMO',
      symbols: ['EURUSD', 'GBPUSD', 'XAUUSD'],
      signalMode: 'ai',
      lotSize: 0.01,
      riskPerTrade: 2,
      maxDailyTrades: 10,
      maxConcurrentPositions: 3,
      loopInterval: 5,
      stopLoss: 50,
      takeProfit: 100,
      aiConfidenceThreshold: 75,
      maxDrawdown: 10,
      dailyLossLimit: 100
    };
    onChange(defaultConfig);
    setHasChanges(true);
    toast({
      title: "Configuration Reset",
      description: "All settings have been reset to defaults",
      variant: "destructive"
    });
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Bot Configuration</span>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Configure trading parameters and AI settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Trading Mode */}
            <div className="space-y-2">
              <Label>Trading Mode</Label>
              <Select 
                value={config.tradingMode} 
                onValueChange={(value: 'REAL' | 'DEMO') => updateConfig({ tradingMode: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEMO">Demo Trading</SelectItem>
                  <SelectItem value="REAL">Live Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lot Size */}
            <div className="space-y-2">
              <Label>Lot Size</Label>
              <Input
                type="number"
                step="0.01"
                value={config.lotSize}
                onChange={(e) => updateConfig({ lotSize: parseFloat(e.target.value) })}
              />
            </div>

            {/* Loop Interval */}
            <div className="space-y-2">
              <Label>Loop Interval (seconds)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[config.loopInterval]}
                  onValueChange={([value]) => updateConfig({ loopInterval: value })}
                  min={1}
                  max={60}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-12">{config.loopInterval}s</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            {/* Signal Mode */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Signal Source</span>
              </Label>
              <Select 
                value={config.signalMode} 
                onValueChange={(value: 'indicator' | 'ai') => updateConfig({ signalMode: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI-Powered Signals</SelectItem>
                  <SelectItem value="indicator">Technical Indicators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI Confidence Threshold */}
            <div className="space-y-2">
              <Label>AI Confidence Threshold (%)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[config.aiConfidenceThreshold]}
                  onValueChange={([value]) => updateConfig({ aiConfidenceThreshold: value })}
                  min={50}
                  max={95}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-12">{config.aiConfidenceThreshold}%</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            {/* Risk Per Trade */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Risk Per Trade (%)</span>
              </Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[config.riskPerTrade]}
                  onValueChange={([value]) => updateConfig({ riskPerTrade: value })}
                  min={0.5}
                  max={5}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-12">{config.riskPerTrade}%</span>
              </div>
            </div>

            {/* Max Drawdown */}
            <div className="space-y-2">
              <Label>Max Drawdown (%)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[config.maxDrawdown]}
                  onValueChange={([value]) => updateConfig({ maxDrawdown: value })}
                  min={5}
                  max={25}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-12">{config.maxDrawdown}%</span>
              </div>
            </div>

            {/* Daily Loss Limit */}
            <div className="space-y-2">
              <Label>Daily Loss Limit ($)</Label>
              <Input
                type="number"
                value={config.dailyLossLimit}
                onChange={(e) => updateConfig({ dailyLossLimit: parseFloat(e.target.value) })}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* Max Daily Trades */}
            <div className="space-y-2">
              <Label>Max Daily Trades</Label>
              <Input
                type="number"
                value={config.maxDailyTrades}
                onChange={(e) => updateConfig({ maxDailyTrades: parseInt(e.target.value) })}
              />
            </div>

            {/* Max Concurrent Positions */}
            <div className="space-y-2">
              <Label>Max Concurrent Positions</Label>
              <Input
                type="number"
                value={config.maxConcurrentPositions}
                onChange={(e) => updateConfig({ maxConcurrentPositions: parseInt(e.target.value) })}
              />
            </div>

            {/* Stop Loss */}
            <div className="space-y-2">
              <Label>Default Stop Loss (pips)</Label>
              <Input
                type="number"
                value={config.stopLoss}
                onChange={(e) => updateConfig({ stopLoss: parseInt(e.target.value) })}
              />
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <Label>Default Take Profit (pips)</Label>
              <Input
                type="number"
                value={config.takeProfit}
                onChange={(e) => updateConfig({ takeProfit: parseInt(e.target.value) })}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}