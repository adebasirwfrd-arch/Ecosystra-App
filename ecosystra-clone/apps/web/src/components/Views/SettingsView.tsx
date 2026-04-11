import React from 'react';
import {
  Settings as SettingsIcon,
  Layout,
  Monitor,
  Lock,
  Bell,
  Sparkles,
  Sliders,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useOptionalEcosystraDictionary } from '../../../../../../shadboard/full-kit/src/components/ecosystra/ecosystra-dictionary-context';
import { Button } from '../../../../../../shadboard/full-kit/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../../shadboard/full-kit/src/components/ui/card';
import { Separator } from '../../../../../../shadboard/full-kit/src/components/ui/separator';
import { cn } from '../../../../../../shadboard/full-kit/src/lib/utils';

const FALLBACK = {
  title: 'Settings',
  subtitle: 'Workspace and preferences',
  general: 'General settings',
  privacy: 'Privacy & permissions',
  advanced: 'Advanced features',
  workspaceName: 'Workspace name',
  themeAppearance: 'Theme & appearance',
  languageRegion: 'Language & region',
  boardDefaults: 'Board defaults',
  notificationRules: 'Notification rules',
  labs: 'Ecosystra Labs',
  apiIntegrations: 'API integrations',
  valueMainWorkspace: 'Main workspace',
  valueLightMode: 'Light mode',
  valueEnglishUS: 'English (US)',
  valuePrivate: 'Private',
  valueAdaptive: 'Adaptive',
  valueEnabled: 'Enabled',
  valueThreeActive: '3 active',
  upgradeTitle: 'Upgrade to Pro',
  upgradeDescription:
    'Get advanced reporting, automations, and unlimited members.',
  learnMore: 'Learn more',
} as const;

export const SettingsView: React.FC = () => {
  const dictionary = useOptionalEcosystraDictionary();
  const t = dictionary?.ecosystraApp.settingsView ?? FALLBACK;

  const settingsSections = [
    {
      title: t.general,
      items: [
        {
          label: t.workspaceName,
          value: t.valueMainWorkspace,
          icon: Layout,
        },
        {
          label: t.themeAppearance,
          value: t.valueLightMode,
          icon: Monitor,
        },
        {
          label: t.languageRegion,
          value: t.valueEnglishUS,
          icon: Globe,
        },
      ],
    },
    {
      title: t.privacy,
      items: [
        {
          label: t.boardDefaults,
          value: t.valuePrivate,
          icon: Lock,
        },
        {
          label: t.notificationRules,
          value: t.valueAdaptive,
          icon: Bell,
        },
      ],
    },
    {
      title: t.advanced,
      items: [
        { label: t.labs, value: t.valueEnabled, icon: Sparkles },
        {
          label: t.apiIntegrations,
          value: t.valueThreeActive,
          icon: Sliders,
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-0 flex-1 flex-col bg-background"
    >
      <header
        className={cn(
          'flex flex-shrink-0 flex-col gap-1 border-b bg-card px-4 py-4 sm:px-6 md:px-8'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SettingsIcon className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {t.title}
            </h2>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </header>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {settingsSections.map((section, idx) => (
            <Card key={idx} className="overflow-hidden border-border/60 shadow-sm">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i}>
                      {i > 0 && <Separator />}
                      <button
                        type="button"
                        className={cn(
                          'flex w-full items-center gap-4 px-4 py-4 text-left transition-colors',
                          'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        )}
                      >
                        <span className="text-muted-foreground">
                          <Icon className="size-[18px]" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-primary">
                          {item.value}
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}

          <Card className="border-primary/25 bg-primary/5 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                <Sparkles className="size-6" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <CardTitle className="text-lg text-primary">
                  {t.upgradeTitle}
                </CardTitle>
                <CardDescription className="text-base">
                  {t.upgradeDescription}
                </CardDescription>
              </div>
              <Button type="button" className="shrink-0">
                {t.learnMore}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
