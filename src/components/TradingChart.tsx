import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Maximize2,
  RefreshCw
} from "lucide-react";
import { mockPriceData } from '@/data/mockData';

interface TradingChartProps {
  symbols: string[];
}

export function TradingChart({ symbols }: TradingChartProps) {
  const [activeSymbol, setActiveSymbol] = useState(symbols[0]);
  const [timeframe, setTimeframe] = useState('M15');
  
  const currentData = mockPriceData[activeSymbol as keyof typeof mockPriceData] || [];
  const currentPrice = currentData[currentData.length - 1]?.price || 0;
  const previousPrice = currentData[currentData.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const isPositive = priceChange >= 0;

  const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];

  const formatPrice = (price: number) => {
    if (activeSymbol === 'USDJPY') {
      return price.toFixed(3);
    }
    return price.toFixed(5);
  };

  const maxPrice = Math.max(...currentData.map(d => d.price));
  const minPrice = Math.min(...currentData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Price Charts</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Symbol Tabs */}
        <Tabs value={activeSymbol} onValueChange={setActiveSymbol} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {symbols.map(symbol => (
              <TabsTrigger key={symbol} value={symbol} className="text-xs">
                {symbol}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-2xl font-bold font-mono">{formatPrice(currentPrice)}</div>
              <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-trading-profit' : 'text-trading-loss'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isPositive ? '+' : ''}{formatPrice(priceChange)}</span>
                <span>({isPositive ? '+' : ''}{((priceChange / previousPrice) * 100).toFixed(2)}%)</span>
              </div>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-1">
            {timeframes.map(tf => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="text-xs px-2"
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        {/* Simple Chart Visualization */}
        <div className="bg-muted/20 rounded-lg p-4 h-64 relative overflow-hidden">
          <div className="absolute inset-4">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-full border-t border-chart-grid/30" 
                  style={{ top: `${(i / 4) * 100}%` }}
                />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute h-full border-l border-chart-grid/30" 
                  style={{ left: `${(i / 4) * 100}%` }}
                />
              ))}
            </div>
            
            {/* Price Line */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={isPositive ? "hsl(var(--trading-profit))" : "hsl(var(--trading-loss))"}
                strokeWidth="0.5"
                points={currentData.map((point, index) => {
                  const x = (index / (currentData.length - 1)) * 100;
                  const y = 100 - (((point.price - minPrice) / priceRange) * 80 + 10);
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Data Points */}
              {currentData.map((point, index) => {
                const x = (index / (currentData.length - 1)) * 100;
                const y = 100 - (((point.price - minPrice) / priceRange) * 80 + 10);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="0.8"
                    fill={isPositive ? "hsl(var(--trading-profit))" : "hsl(var(--trading-loss))"}
                  />
                );
              })}
            </svg>

            {/* Price Labels */}
            <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
              <span>{formatPrice(maxPrice)}</span>
              <span>{formatPrice(minPrice)}</span>
            </div>
            
            {/* Time Labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-muted-foreground">
              {currentData.map((point, index) => {
                if (index === 0 || index === currentData.length - 1) {
                  return <span key={index}>{point.time}</span>;
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Trading Signals */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-trading-info" />
              <span className="text-sm text-muted-foreground">Last Signal:</span>
              <Badge variant="default" className="bg-trading-profit text-white">
                BUY
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}