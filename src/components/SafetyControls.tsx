import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Shield, 
  StopCircle,
  Zap,
  DollarSign,
  Lock
} from "lucide-react";

export function SafetyControls() {
  const [maxExposure, setMaxExposure] = useState([25]);
  const [killSwitchEnabled, setKillSwitchEnabled] = useState(true);
  const [brokerDisabled, setBrokerDisabled] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const { toast } = useToast();

  const handleStopAll = () => {
    setEmergencyMode(true);
    toast({
      title: "EMERGENCY STOP ACTIVATED",
      description: "All trading activities have been halted immediately",
      variant: "destructive",
    });
    
    // Reset after 5 seconds for demo
    setTimeout(() => setEmergencyMode(false), 5000);
  };

  const handleKillSwitch = () => {
    toast({
      title: "Kill Switch Activated",
      description: "All positions closed, trading stopped",
      variant: "destructive",
    });
  };

  const handleBrokerDisable = (enabled: boolean) => {
    setBrokerDisabled(enabled);
    toast({
      title: enabled ? "Broker Connection Disabled" : "Broker Connection Enabled",
      description: enabled 
        ? "No new orders will be sent to broker" 
        : "Broker connection restored",
      variant: enabled ? "destructive" : "default",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Safety Controls</span>
        </CardTitle>
        <CardDescription>
          Emergency controls and risk limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Stop */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Emergency Controls</Label>
            {emergencyMode && (
              <Badge variant="destructive" className="animate-pulse">
                EMERGENCY MODE
              </Badge>
            )}
          </div>
          <Button
            onClick={handleStopAll}
            variant="destructive"
            className="w-full shadow-glow-loss"
            disabled={emergencyMode}
          >
            <StopCircle className="h-4 w-4 mr-2" />
            {emergencyMode ? 'EMERGENCY MODE ACTIVE' : 'STOP ALL TRADING'}
          </Button>
        </div>

        {/* Max Exposure */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Max Portfolio Exposure</Label>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span className="text-sm font-mono">{maxExposure[0]}%</span>
            </div>
          </div>
          <Slider
            value={maxExposure}
            onValueChange={setMaxExposure}
            max={100}
            min={5}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5%</span>
            <span>Conservative: 25%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Kill Switch */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Kill Switch</Label>
            <p className="text-xs text-muted-foreground">
              Instantly close all positions on trigger
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={killSwitchEnabled}
              onCheckedChange={setKillSwitchEnabled}
            />
            {killSwitchEnabled && (
              <Button
                onClick={handleKillSwitch}
                size="sm"
                variant="destructive"
              >
                <Zap className="h-3 w-3 mr-1" />
                TRIGGER
              </Button>
            )}
          </div>
        </div>

        {/* Broker Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Broker Disable</Label>
            <p className="text-xs text-muted-foreground">
              Prevent new orders from being sent
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={brokerDisabled}
              onCheckedChange={handleBrokerDisable}
            />
            {brokerDisabled && (
              <Badge variant="destructive" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                DISABLED
              </Badge>
            )}
          </div>
        </div>

        {/* Risk Status */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Current Exposure:</span>
              <span className="text-yellow-500">18.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Drawdown:</span>
              <span className="text-trading-profit">-2.1%</span>
            </div>
            <div className="flex justify-between">
              <span>Safety Status:</span>
              <Badge variant="outline" className="text-xs">
                PROTECTED
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}