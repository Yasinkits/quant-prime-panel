import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle,
  XCircle,
  Wifi
} from "lucide-react";

interface MT5LoginModalProps {
  open: boolean;
  onClose: () => void;
}

interface ConnectionTest {
  status: 'idle' | 'testing' | 'success' | 'error';
  message?: string;
}

export function MT5LoginModal({ open, onClose }: MT5LoginModalProps) {
  const [isDemo, setIsDemo] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [connectionTest, setConnectionTest] = useState<ConnectionTest>({ status: 'idle' });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    server: ''
  });

  const brokerServers = {
    demo: [
      'MetaQuotes-Demo',
      'FTMO-Demo01',
      'ICMarkets-Demo01',
      'Pepperstone-Demo',
      'OANDA-Demo-1'
    ],
    live: [
      'MetaQuotes-Live',
      'FTMO-Live01',
      'ICMarkets-Live01',
      'Pepperstone-Live',
      'OANDA-Live-1'
    ]
  };

  const handleTestConnection = async () => {
    if (!formData.login || !formData.password || !formData.server) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setConnectionTest({ status: 'testing' });

    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setConnectionTest({ 
          status: 'success', 
          message: 'Connection successful! Account verified.' 
        });
        toast({
          title: "Connection Successful",
          description: "MT5 account connected successfully",
        });
      } else {
        setConnectionTest({ 
          status: 'error', 
          message: 'Connection failed. Please check your credentials.' 
        });
        toast({
          title: "Connection Failed",
          description: "Please verify your login credentials and server",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleConnect = () => {
    if (connectionTest.status === 'success') {
      toast({
        title: "Account Connected",
        description: `Connected to ${formData.server} in ${isDemo ? 'Demo' : 'Live'} mode`,
      });
      onClose();
    } else {
      toast({
        title: "Test Connection First",
        description: "Please test the connection before connecting",
        variant: "destructive"
      });
    }
  };

  const getTestIcon = () => {
    switch (connectionTest.status) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-trading-profit" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-trading-loss" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>MT5 Login</span>
          </DialogTitle>
          <DialogDescription>
            Connect to your MetaTrader 5 account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo/Live Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Trading Mode</Label>
              <p className="text-sm text-muted-foreground">
                {isDemo ? 'Demo account for testing' : 'Live account with real money'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="mode-toggle" className="text-sm">Demo</Label>
              <Switch
                id="mode-toggle"
                checked={!isDemo}
                onCheckedChange={(checked) => setIsDemo(!checked)}
              />
              <Label htmlFor="mode-toggle" className="text-sm">Live</Label>
            </div>
          </div>

          {/* Account Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="login">Account Number</Label>
              <Input
                id="login"
                placeholder="Enter your MT5 login"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="server">Broker Server</Label>
              <Select value={formData.server} onValueChange={(value) => setFormData({ ...formData, server: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select broker server" />
                </SelectTrigger>
                <SelectContent>
                  {(isDemo ? brokerServers.demo : brokerServers.live).map((server) => (
                    <SelectItem key={server} value={server}>
                      {server}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {isDemo ? 'Demo' : 'Live'}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">
              Remember credentials (encrypted storage)
            </Label>
          </div>

          {/* Connection Test */}
          <div className="space-y-2">
            <Button
              onClick={handleTestConnection}
              disabled={connectionTest.status === 'testing'}
              className="w-full"
              variant="outline"
            >
              {getTestIcon()}
              {connectionTest.status === 'testing' ? 'Testing Connection...' : 'Test Connection'}
            </Button>
            
            {connectionTest.message && (
              <div className={`text-sm p-2 rounded-md ${
                connectionTest.status === 'success' 
                  ? 'bg-trading-profit/10 text-trading-profit border border-trading-profit/20' 
                  : 'bg-trading-loss/10 text-trading-loss border border-trading-loss/20'
              }`}>
                {connectionTest.message}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={connectionTest.status !== 'success'}
              className="flex-1"
            >
              Connect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}