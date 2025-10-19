import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ManualTradeExecution() {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState('');
  const [volume, setVolume] = useState('0.1');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (!symbol) {
      toast({
        title: "Missing Symbol",
        description: "Please select a trading pair",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `${type} Order Placed`,
      description: `${type} ${volume} lots of ${symbol}`,
    });

    // Reset form
    setSymbol('');
    setVolume('0.1');
    setStopLoss('');
    setTakeProfit('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-trading-profit" />
          Manual Trade Execution
        </CardTitle>
        <CardDescription>
          Available for BASIC plan - Execute trades manually with risk management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger id="symbol">
                <SelectValue placeholder="Select trading pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EURUSD">EUR/USD</SelectItem>
                <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                <SelectItem value="USDJPY">USD/JPY</SelectItem>
                <SelectItem value="XAUUSD">XAU/USD (Gold)</SelectItem>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume">Volume (Lots)</Label>
            <Input
              id="volume"
              type="number"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Input
              id="stopLoss"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="takeProfit">Take Profit</Label>
            <Input
              id="takeProfit"
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            onClick={() => handleTrade('BUY')}
            className="bg-trading-profit hover:bg-trading-profit/90 text-white"
            size="lg"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            BUY
          </Button>
          <Button
            onClick={() => handleTrade('SELL')}
            className="bg-trading-loss hover:bg-trading-loss/90 text-white"
            size="lg"
          >
            <TrendingDown className="mr-2 h-4 w-4" />
            SELL
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
