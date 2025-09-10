import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  X, 
  Edit, 
  TrendingUp,
  Clock,
  Calculator
} from "lucide-react";
import { Position } from "@/types/trading";
import { PositionHelpers } from './PositionHelpers';

interface PositionsTableProps {
  positions: Position[];
  onClosePosition: (id: string) => void;
  onModifyPosition: (id: string) => void;
}

export function PositionsTable({ positions, onClosePosition, onModifyPosition }: PositionsTableProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showHelpers, setShowHelpers] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(5);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getDurationString = (openTime: string) => {
    const now = new Date();
    const open = new Date(openTime);
    const diffMs = now.getTime() - open.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMins}m`;
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Open Positions</span>
            <Badge variant="secondary">{positions.length}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Total P&L: {formatCurrency(positions.reduce((sum, pos) => sum + pos.pnl, 0))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Open Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Pips</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No open positions
                  </TableCell>
                </TableRow>
              ) : (
                positions.map((position) => (
                  <TableRow key={position.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{position.symbol}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={position.type === 'BUY' ? 'default' : 'destructive'}
                        className="flex items-center space-x-1 w-fit"
                      >
                        {position.type === 'BUY' ? (
                          <ArrowUpCircle className="w-3 h-3" />
                        ) : (
                          <ArrowDownCircle className="w-3 h-3" />
                        )}
                        <span>{position.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{position.volume}</TableCell>
                    <TableCell className="font-mono">{formatPrice(position.openPrice)}</TableCell>
                    <TableCell className="font-mono">{formatPrice(position.currentPrice)}</TableCell>
                    <TableCell>
                      <div className={`font-bold ${position.pnl >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                        {formatCurrency(position.pnl)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-mono ${position.pnlPips >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                        {position.pnlPips > 0 ? '+' : ''}{position.pnlPips.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{getDurationString(position.openTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedPosition(position);
                            setShowHelpers(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Calculator className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onModifyPosition(position.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onClosePosition(position.id)}
                          className="h-8 w-8 p-0 text-trading-loss hover:text-trading-loss"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <PositionHelpers
        open={showHelpers}
        onClose={() => {
          setShowHelpers(false);
          setSelectedPosition(null);
        }}
        position={selectedPosition || undefined}
      />
    </Card>
  );
}