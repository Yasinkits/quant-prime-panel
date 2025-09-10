import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  Target, 
  TrendingUp,
  TrendingDown,
  X
} from "lucide-react";

interface PositionHelpersProps {
  open: boolean;
  onClose: () => void;
  position?: {
    id: string;
    symbol: string;
    type: 'BUY' | 'SELL';
    volume: number;
    currentPrice: number;
    stopLoss?: number;
    takeProfit?: number;
  };
}

export function PositionHelpers({ open, onClose, position }: PositionHelpersProps) {
  const [newStopLoss, setNewStopLoss] = useState(position?.stopLoss?.toString() || '');
  const [newTakeProfit, setNewTakeProfit] = useState(position?.takeProfit?.toString() || '');
  const [riskAmount, setRiskAmount] = useState('500');
  const [riskPercentage, setRiskPercentage] = useState('2');
  const { toast } = useToast();

  if (!position) return null;

  const calculatePositionSize = () => {
    const risk = parseFloat(riskAmount) || 0;
    const slDistance = Math.abs((position.currentPrice - (parseFloat(newStopLoss) || position.currentPrice)) * 10000);
    const pipValue = 10; // Simplified pip value for major pairs
    const calculatedSize = risk / (slDistance * pipValue);
    
    return {
      recommendedSize: Math.round(calculatedSize * 100) / 100,
      slPips: Math.round(slDistance),
      riskReward: newTakeProfit ? 
        Math.round((Math.abs(parseFloat(newTakeProfit) - position.currentPrice) / Math.abs((parseFloat(newStopLoss) || position.currentPrice) - position.currentPrice)) * 100) / 100 
        : 0
    };
  };

  const handleBreakeven = () => {
    setNewStopLoss(position.currentPrice.toString());
    toast({
      title: "Breakeven Set",
      description: `Stop loss moved to breakeven at ${position.currentPrice}`,
    });
  };

  const handleOneClickClose = () => {
    toast({
      title: "Position Closed",
      description: `${position.symbol} ${position.type} position closed at market price`,
    });
    onClose();
  };

  const handleModifyPosition = () => {
    toast({
      title: "Position Modified",
      description: `SL: ${newStopLoss}, TP: ${newTakeProfit}`,
    });
    onClose();
  };

  const calc = calculatePositionSize();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Position Management</span>
          </DialogTitle>
          <DialogDescription>
            {position.symbol} {position.type} - {position.volume} lots @ {position.currentPrice}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Actions</Label>
            <div className="flex space-x-2">
              <Button
                onClick={handleOneClickClose}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                <X className="h-3 w-3 mr-1" />
                Close Position
              </Button>
              <Button
                onClick={handleBreakeven}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Target className="h-3 w-3 mr-1" />
                Move to Breakeven
              </Button>
            </div>
          </div>

          {/* Modify SL/TP */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Modify Stop Loss / Take Profit</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stop-loss" className="text-xs">Stop Loss</Label>
                <Input
                  id="stop-loss"
                  type="number"
                  step="0.00001"
                  placeholder="Stop Loss"
                  value={newStopLoss}
                  onChange={(e) => setNewStopLoss(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="take-profit" className="text-xs">Take Profit</Label>
                <Input
                  id="take-profit"
                  type="number"
                  step="0.00001"
                  placeholder="Take Profit"
                  value={newTakeProfit}
                  onChange={(e) => setNewTakeProfit(e.target.value)}
                />
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 rounded bg-muted">
                <div className="font-medium">{calc.slPips}</div>
                <div className="text-muted-foreground">SL Pips</div>
              </div>
              <div className="text-center p-2 rounded bg-muted">
                <div className="font-medium">{calc.riskReward}</div>
                <div className="text-muted-foreground">Risk:Reward</div>
              </div>
              <div className="text-center p-2 rounded bg-muted">
                <div className="font-medium text-trading-profit">
                  {position.currentPrice > (parseFloat(newStopLoss) || 0) ? 
                    <TrendingUp className="h-3 w-3 mx-auto" /> : 
                    <TrendingDown className="h-3 w-3 mx-auto" />
                  }
                </div>
                <div className="text-muted-foreground">Direction</div>
              </div>
            </div>
          </div>

          {/* Position Size Calculator */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Position Size Calculator</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="risk-amount" className="text-xs">Risk Amount ($)</Label>
                <Input
                  id="risk-amount"
                  type="number"
                  placeholder="500"
                  value={riskAmount}
                  onChange={(e) => setRiskAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="risk-percentage" className="text-xs">Risk (%)</Label>
                <Input
                  id="risk-percentage"
                  type="number"
                  step="0.1"
                  placeholder="2.0"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(e.target.value)}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border">
              <div className="flex items-center justify-between text-sm">
                <span>Recommended Size:</span>
                <Badge variant="outline" className="font-mono">
                  {calc.recommendedSize} lots
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleModifyPosition} className="flex-1">
              Modify Position
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}