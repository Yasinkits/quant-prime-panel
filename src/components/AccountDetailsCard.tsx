import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Activity, Users } from 'lucide-react';

interface AccountInfo {
  balance: number;
  equity: number;
  freeMargin: number;
  marginLevel: number;
  openPositions: number;
  profit: number;
  profitPercentage: number;
}

interface AccountDetailsCardProps {
  accountInfo: AccountInfo;
}

export function AccountDetailsCard({ accountInfo }: AccountDetailsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Account Balance</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(accountInfo.balance)}</p>
              <p className="text-xs text-muted-foreground mt-1">Starting capital</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Equity</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(accountInfo.equity)}</p>
              <p className={`text-xs mt-1 ${accountInfo.profit >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                {formatCurrency(accountInfo.profit)} ({formatPercentage(accountInfo.profitPercentage)})
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-trading-profit/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-trading-profit" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Free Margin</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(accountInfo.freeMargin)}</p>
              <p className="text-xs text-muted-foreground mt-1">Available for trading</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-trading-info/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-trading-info" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Positions</p>
              <p className="text-2xl font-bold mt-1">{accountInfo.openPositions}</p>
              <p className="text-xs text-muted-foreground mt-1">Active trades</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
