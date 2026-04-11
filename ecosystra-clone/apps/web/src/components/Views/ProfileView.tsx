import React, { useState } from 'react';
import { User, Globe, Shield, Bell, LogOut, Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { useOptionalEcosystraDictionary } from '../../../../../../shadboard/full-kit/src/components/ecosystra/ecosystra-dictionary-context';
import { Avatar, AvatarFallback } from '../../../../../../shadboard/full-kit/src/components/ui/avatar';
import { Badge } from '../../../../../../shadboard/full-kit/src/components/ui/badge';
import { Button } from '../../../../../../shadboard/full-kit/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../../shadboard/full-kit/src/components/ui/card';
import { Input } from '../../../../../../shadboard/full-kit/src/components/ui/input';
import { Label } from '../../../../../../shadboard/full-kit/src/components/ui/label';
import { Separator } from '../../../../../../shadboard/full-kit/src/components/ui/separator';
import { cn } from '../../../../../../shadboard/full-kit/src/lib/utils';

interface ProfileViewProps {
  user: any;
  onUpdateStatus: (status: string) => void;
  onLogout: () => void;
}

/** English fallback when `EcosystraDictionaryProvider` is not mounted (standalone app). */
const FALLBACK = {
  title: 'Profile & activity',
  subtitle: 'Manage your identity and preferences',
  globalStatus: 'Global status',
  setStatus: 'Set status',
  edit: 'Edit',
  save: 'Save',
  accountIdentity: 'Account identity',
  memberSince: 'Member since April 2026',
  emailAddress: 'Email address',
  workingHours: 'Working hours',
  hoursValue: '09:00 - 18:00 (GMT+7)',
  securityPrivacy: 'Security & privacy',
  changePassword: 'Change password',
  mfa: 'Multi-factor authentication',
  recommended: 'Recommended',
  signOut: 'Sign out',
} as const;

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateStatus,
  onLogout,
}) => {
  const dictionary = useOptionalEcosystraDictionary();
  const t = dictionary?.ecosystraApp.profileView ?? FALLBACK;
  const signOutLabel =
    dictionary?.navigation.userNav.signOut ?? FALLBACK.signOut;

  const [editingStatus, setEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(user?.status || '');

  const saveStatus = () => {
    onUpdateStatus(statusInput);
    setEditingStatus(false);
  };

  const initials =
    typeof user?.name === 'string' && user.name.length > 0
      ? user.name.slice(0, 2).toUpperCase()
      : '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-0 flex-1 flex-col bg-background"
    >
      <header
        className={cn(
          'flex flex-shrink-0 flex-col gap-4 border-b bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8'
        )}
      >
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {t.title}
            </h2>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="size-4" aria-hidden />
          {signOutLabel}
        </Button>
      </header>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-muted-foreground" aria-hidden />
                <CardTitle className="text-base">{t.globalStatus}</CardTitle>
              </div>
              <CardDescription>
                {t.setStatus}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingStatus ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    autoFocus
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={saveStatus}>
                    {t.save}
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingStatus(true)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3 text-left transition-colors',
                    'hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full bg-amber-500"
                    aria-hidden
                  />
                  <span className="font-medium text-foreground">
                    {user?.status || t.setStatus}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {t.edit}
                  </span>
                </button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" aria-hidden />
                <CardTitle className="text-base">{t.accountIdentity}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="size-20 rounded-2xl text-xl font-bold">
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{t.memberSince}</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
                  <Label className="text-xs text-muted-foreground">
                    {t.emailAddress}
                  </Label>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
                <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
                  <Label className="text-xs text-muted-foreground">
                    {t.workingHours}
                  </Label>
                  <p className="text-sm font-medium">{t.hoursValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" aria-hidden />
                <CardTitle className="text-base">{t.securityPrivacy}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 py-3 text-left font-medium"
                type="button"
              >
                <Shield className="size-4 text-primary" aria-hidden />
                <span className="flex-1">{t.changePassword}</span>
                <Check className="size-4 text-emerald-600" aria-hidden />
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 py-3 text-left font-medium"
                type="button"
              >
                <Bell className="size-4 text-amber-600" aria-hidden />
                <span className="flex-1">{t.mfa}</span>
                <Badge variant="secondary" className="font-normal">
                  {t.recommended}
                </Badge>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
