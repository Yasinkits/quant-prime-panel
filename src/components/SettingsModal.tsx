import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings,
  CreditCard,
  Trash2,
  AlertTriangle,
  User,
  Bell,
  Shield
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_status: 'cancelled',
          subscription_tier: 'trial',
          subscription_end_date: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully",
      });
      setShowCancelDialog(false);
      onClose();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      // Delete MT5 credentials
      await supabase.from('mt5_credentials').delete().eq('user_id', user?.id);
      
      // Delete trading sessions
      await supabase.from('trading_sessions').delete().eq('user_id', user?.id);
      
      // Delete user configs
      await supabase.from('user_configs').delete().eq('user_id', user?.id);
      
      // Delete profile
      await supabase.from('profiles').delete().eq('user_id', user?.id);

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });
      
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </DialogTitle>
            <DialogDescription>
              Manage your account and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Account Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Account</Label>
              </div>
              <div className="space-y-2 pl-6">
                <div className="text-sm">
                  <span className="text-muted-foreground">Email: </span>
                  <span>{user?.email}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Plan: </span>
                  <span className="capitalize">{profile?.subscription_tier || 'Trial'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Status: </span>
                  <span className="capitalize">{profile?.subscription_status || 'Inactive'}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Subscription Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Subscription</Label>
              </div>
              <div className="space-y-2 pl-6">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    onClose();
                    navigate('/subscriptions');
                  }}
                >
                  View Plans & Pricing
                </Button>
                {profile?.subscription_status === 'active' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-trading-loss"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Notifications Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Notifications</Label>
              </div>
              <div className="space-y-2 pl-6">
                <div className="text-sm text-muted-foreground">
                  Email notifications for trades and alerts
                </div>
              </div>
            </div>

            <Separator />

            {/* Security Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Security</Label>
              </div>
              <div className="space-y-2 pl-6">
                <div className="text-sm text-muted-foreground">
                  Two-factor authentication (Coming soon)
                </div>
              </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-trading-loss" />
                <Label className="text-sm font-medium text-trading-loss">Danger Zone</Label>
              </div>
              <div className="space-y-2 pl-6">
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will be cancelled and you'll lose access to premium features. 
              You can resubscribe at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription}
              disabled={isProcessing}
              className="bg-trading-loss hover:bg-trading-loss/90"
            >
              {isProcessing ? 'Cancelling...' : 'Cancel Subscription'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your data including trading history, 
              configurations, and account information will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              disabled={isProcessing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isProcessing ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
