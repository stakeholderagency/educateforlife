import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UserPlus, Send, Check, Clock, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InviteToConnectDialogProps {
  recipientName: string;
  toUserId?: string | null;
  toLegacyId?: string | null;
}

const messageSchema = z
  .string()
  .trim()
  .max(500, { message: 'Keep it under 500 characters.' });

const InviteToConnectDialog = ({ recipientName, toUserId, toLegacyId }: InviteToConnectDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingStatus, setExistingStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);

  useEffect(() => {
    if (!user) return;
    const checkExisting = async () => {
      let q = supabase.from('connection_requests').select('status').eq('from_user_id', user.id);
      if (toUserId) q = q.eq('to_user_id', toUserId);
      else if (toLegacyId) q = q.eq('to_legacy_id', toLegacyId);
      const { data } = await q.order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (data) setExistingStatus(data.status as any);
    };
    checkExisting();
  }, [user, toUserId, toLegacyId]);

  if (!user) {
    return (
      <Button variant="hero" size="sm" asChild>
        <Link to="/auth?mode=login"><Lock className="w-4 h-4 mr-1" /> Sign in to connect</Link>
      </Button>
    );
  }

  if (existingStatus === 'pending') {
    return (
      <Button variant="outline" size="sm" disabled>
        <Clock className="w-4 h-4 mr-1" /> Invite pending
      </Button>
    );
  }
  if (existingStatus === 'accepted') {
    return (
      <Button variant="outline" size="sm" disabled>
        <Check className="w-4 h-4 mr-1" /> Connected
      </Button>
    );
  }

  const submit = async () => {
    const parsed = messageSchema.safeParse(message);
    if (!parsed.success) {
      toast({ title: 'Message too long', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('connection_requests').insert({
      from_user_id: user.id,
      to_user_id: toUserId ?? null,
      to_legacy_id: toLegacyId ?? null,
      message: parsed.data || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Could not send invite', description: error.message, variant: 'destructive' });
      return;
    }
    setExistingStatus('pending');
    setOpen(false);
    setMessage('');
    toast({ title: 'Invite sent', description: `${recipientName} will see your request.` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm">
          <UserPlus className="w-4 h-4 mr-1" /> Invite to Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite {recipientName} to connect</DialogTitle>
          <DialogDescription>
            Add a short note so they know why you'd like to connect. Optional.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi ${recipientName.split(' ')[0]}, I'd love to connect because…`}
          rows={5}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">{message.length}/500</p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="hero" onClick={submit} disabled={submitting}>
            <Send className="w-4 h-4 mr-1" /> {submitting ? 'Sending…' : 'Send invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteToConnectDialog;
