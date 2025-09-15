import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const completed = localStorage.getItem('primeai_tutorial_completed');
    if (completed) {
      setTutorialCompleted(true);
    } else {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('primeai_tutorial_completed', 'true');
    setTutorialCompleted(true);
    setShowTutorial(false);
  };

  const mockPrices = [
    { pair: 'EURUSD', price: '1.0875', change: '+0.0012', positive: true },
    { pair: 'GBPUSD', price: '1.2634', change: '-0.0023', positive: false },
    { pair: 'XAUUSD', price: '2024.50', change: '+12.30', positive: true },
    { pair: 'BTCUSD', price: '43,250', change: '+850', positive: true },
    { pair: 'USDJPY', price: '149.25', change: '-0.45', positive: false },
  ];

  const features = [
    {
      title: 'Transparency',
      description: 'Full visibility into all trading decisions and performance metrics'
    },
    {
      title: 'Reliability',
      description: 'Advanced AI algorithms with proven track record in forex markets'
    },
    {
      title: 'Support',
      description: '24/7 customer support and comprehensive documentation'
    },
    {
      title: 'Profitability',
      description: 'Optimized risk management and profit maximization strategies'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Prime AI Bot</h1>
          <div className="flex gap-2">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth?mode=login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth?mode=signup')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Trust Prime AI Bot
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Advanced AI-powered trading robot. 1.1K traders rely on us.
          </p>
          
          {/* Live Prices */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {mockPrices.map((item) => (
              <Card key={item.pair} className="bg-card">
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">{item.pair}</div>
                  <div className="text-lg font-bold">{item.price}</div>
                  <Badge variant={item.positive ? "default" : "destructive"}>
                    {item.change}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            size="lg" 
            className="mb-4"
            onClick={() => tutorialCompleted ? navigate('/subscriptions') : setShowTutorial(true)}
            disabled={!tutorialCompleted}
          >
            Trade on the Go with Prime Bot
          </Button>
          
          {!tutorialCompleted && (
            <p className="text-sm text-muted-foreground">
              Complete the tutorial to get started
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose Prime Bot
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Recommended Partner</h3>
          <Card className="inline-block">
            <CardContent className="p-8">
              <div className="text-6xl font-bold text-primary mb-4">FBS</div>
              <p className="text-muted-foreground">Trusted forex broker partner</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-muted/10">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            <strong>Disclaimer:</strong> Trading forex and CFDs involves significant risk and may not be suitable for all investors. 
            Past performance does not guarantee future results. Please consider your investment objectives and risk tolerance 
            before trading. Prime AI Bot is a trading tool and does not provide investment advice.
          </p>
        </div>
      </section>

      {/* Tutorial Modal */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Welcome to Prime AI Bot</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🎥</div>
                <div>Tutorial Video Placeholder</div>
                <div className="text-sm text-muted-foreground">
                  Learn how to use Prime AI Bot effectively
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleTutorialComplete}>
                Mark as Completed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;