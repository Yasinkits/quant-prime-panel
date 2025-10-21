import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Brain, Target } from 'lucide-react';

export function PremiumStrategies() {
  const strategies = [
    {
      name: 'Smart Money Concepts',
      icon: Brain,
      description: 'Institutional trading patterns and order flow analysis'
    },
    {
      name: 'Break and Retest',
      icon: Target,
      description: 'Key level breakout confirmation strategy'
    },
    {
      name: 'Support and Resistance',
      icon: TrendingUp,
      description: 'Key price level identification and trading'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Advanced Strategies
        </CardTitle>
        <CardDescription>
          Premium advanced trading strategies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {strategies.map((strategy) => (
          <div
            key={strategy.name}
            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30"
          >
            <div className="p-2 rounded-md bg-primary/10">
              <strategy.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{strategy.name}</h4>
              <p className="text-xs text-muted-foreground">{strategy.description}</p>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <Badge variant="secondary" className="text-xs">COMING SOON</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
