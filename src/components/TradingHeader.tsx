import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings, Wifi } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { SettingsModal } from './SettingsModal';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  subscription_status: string | null;
  subscription_tier?: string | null;
  trial_sessions_used?: number;
  created_at: string;
  updated_at: string;
}

interface TradingHeaderProps {
  user: SupabaseUser | null;
  profile: Profile | null;
  onSignOut: () => Promise<void>;
  onMT5Connect: () => void;
}

export function TradingHeader({ user, profile, onSignOut, onMT5Connect }: TradingHeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();
  
  return (
    <>
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold gradient-text">Prime AI Bot</h1>
          <Badge variant="secondary">v2.1.0</Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onMT5Connect}
            className="flex items-center space-x-2"
          >
            <Wifi className="h-4 w-4" />
            <span>MT5 Connect</span>
          </Button>
          
          <div className="text-right">
            <div className="text-sm font-medium">{displayName}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {profile?.subscription_tier || 'Trial'} Plan
            </div>
          </div>
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
    </>
  );
}