import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Link as LinkIcon, TrendingUp, Settings, LogOut, User } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { SettingsModal } from './SettingsModal';

interface Profile {
  id: string;
  user_id: string;
  display_name?: string | null;
  subscription_status: string | null;
  subscription_tier?: string | null;
  trial_sessions_used?: number;
  created_at: string;
  updated_at: string;
}

interface DashboardSidebarProps {
  user: SupabaseUser | null;
  profile: Profile | null;
  onSignOut: () => Promise<void>;
}

export function DashboardSidebar({ user, profile, onSignOut }: DashboardSidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  const navItems = [
    { to: '', label: 'Dashboard', icon: LayoutDashboard },
    { to: 'mt5-account', label: 'MT5 Account', icon: LinkIcon },
    { to: 'performance', label: 'Performance', icon: TrendingUp },
  ];

  return (
    <>
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <aside className="w-64 border-r border-border bg-card flex flex-col h-screen">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold gradient-text">Prime AI Bot</h1>
          <Badge variant="secondary" className="mt-2">v2.1.0</Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Separator />

        {/* User Section */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {profile?.subscription_tier || 'Trial'} Plan
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
