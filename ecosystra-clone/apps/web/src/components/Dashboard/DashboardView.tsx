import React, { useMemo } from 'react';
import {
  Filter,
  MoreHorizontal,
  Plus,
  Star,
} from 'lucide-react';

import { useOptionalEcosystraDictionary } from '../../../../../../shadboard/full-kit/src/components/ecosystra/ecosystra-dictionary-context';
import { Button } from '../../../../../../shadboard/full-kit/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../../../shadboard/full-kit/src/components/ui/card';
import { Input } from '../../../../../../shadboard/full-kit/src/components/ui/input';

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <Card className="border-border/60 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="flex gap-1 text-muted-foreground">
        <Filter className="size-3.5" aria-hidden />
        <MoreHorizontal className="size-3.5" aria-hidden />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </CardContent>
  </Card>
);

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

const PieChart: React.FC<{ data: PieSlice[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  const slices = data.map((d) => {
    const start = cumulative;
    cumulative += d.value;
    const startAngle = (start / total) * 360;
    const endAngle = (cumulative / total) * 360;
    return { ...d, startAngle, endAngle };
  });

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
  ) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (
    cx: number,
    cy: number,
    r: number,
    start: number,
    end: number
  ) => {
    const s = polarToCartesian(cx, cy, r, end);
    const e = polarToCartesian(cx, cy, r, start);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y} Z`;
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <svg className="mx-auto size-[200px] shrink-0" viewBox="0 0 200 200" aria-hidden>
        {slices.map((s, i) => (
          <path
            key={i}
            d={describeArc(100, 100, 90, s.startAngle, s.endAngle)}
            fill={s.color}
          />
        ))}
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ background: d.color }}
            />
            <span className="text-foreground">
              {d.label}:{' '}
              {total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BarData {
  label: string;
  value: number;
  initials: string;
}

const BarChart: React.FC<{ data: BarData[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex min-h-[220px] items-end justify-around gap-2 px-2 pt-4">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex min-w-0 flex-1 flex-col items-center gap-2"
        >
          <span className="text-sm font-semibold text-foreground">
            {d.value}
          </span>
          <div
            className="w-full max-w-[48px] rounded-t-md bg-primary/80 transition-all"
            style={{
              height: `${Math.max((d.value / max) * 160, 20)}px`,
            }}
          />
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {d.initials}
            </div>
            <span className="max-w-[100px] truncate text-xs text-muted-foreground">
              {d.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const FALLBACK = {
  defaultTitle: 'Dashboard and reporting',
  export: 'Export',
  invite: 'Invite',
  addWidget: 'Add widget',
  connectedBoards: '1 connected board',
  filterPlaceholder: 'Type to filter',
  allTasks: 'All tasks',
  inProgress: 'In progress',
  stuck: 'Stuck',
  done: 'Done',
  tasksByStatus: 'Tasks by status',
  tasksByOwner: 'Tasks by owner',
  workingOnIt: 'Working on it',
  sampleOwner: 'Ade Basir',
} as const;

interface BoardItem {
  id: string;
  name: string;
  groupId?: string | null;
  dynamicData?: Record<string, unknown>;
}

interface BoardGroup {
  id: string;
  name: string;
  color?: string;
}

interface DashboardViewProps {
  boardTitle?: string;
  items?: BoardItem[];
  groups?: BoardGroup[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  boardTitle,
  items = [],
  groups = [],
}) => {
  const dictionary = useOptionalEcosystraDictionary();
  const t = dictionary?.ecosystraApp.dashboardView ?? FALLBACK;

  const title = boardTitle ?? t.defaultTitle;

  const statusCounts = useMemo(() => {
    let done = 0, working = 0, stuck = 0, blank = 0;
    for (const item of items) {
      const s = ((item.dynamicData?.status as string) || '').toLowerCase();
      if (s === 'done') done++;
      else if (s === 'working on it') working++;
      else if (s === 'stuck') stuck++;
      else blank++;
    }
    return { done, working, stuck, blank, total: items.length };
  }, [items]);

  const statsData = useMemo(
    () => [
      { title: t.allTasks, value: statusCounts.total },
      { title: t.inProgress, value: statusCounts.working },
      { title: t.stuck, value: statusCounts.stuck },
      { title: t.done, value: statusCounts.done },
    ],
    [t, statusCounts]
  );

  const pieData: PieSlice[] = useMemo(() => {
    const w = statusCounts.working;
    const d = statusCounts.done;
    const s = statusCounts.stuck;
    const b = statusCounts.blank;
    const total = w + d + s + b;
    if (total === 0) return [{ label: t.workingOnIt, value: 1, color: '#ddd' }];
    return [
      ...(w > 0 ? [{ label: t.workingOnIt, value: w, color: '#FDAB3D' }] : []),
      ...(d > 0 ? [{ label: t.done, value: d, color: '#00C875' }] : []),
      ...(s > 0 ? [{ label: t.stuck, value: s, color: '#E2445C' }] : []),
      ...(b > 0 ? [{ label: 'Not started', value: b, color: '#C4C4C4' }] : []),
    ];
  }, [t, statusCounts]);

  const barData: BarData[] = useMemo(() => {
    const ownerMap: Record<string, { name: string; count: number }> = {};
    for (const item of items) {
      const ownerName = (item.dynamicData?.owner_name as string) || 'Unassigned';
      if (!ownerMap[ownerName]) {
        ownerMap[ownerName] = { name: ownerName, count: 0 };
      }
      ownerMap[ownerName].count++;
    }
    return Object.values(ownerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map(o => ({
        label: o.name,
        value: o.count,
        initials: o.name.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '?',
      }));
  }, [items]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {title}
          </h1>
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Star"
          >
            <Star className="size-[18px]" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" type="button">
            {t.export} ▾
          </Button>
          <Button variant="secondary" size="sm" type="button">
            {t.invite}
          </Button>
          <button
            type="button"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="More"
          >
            <MoreHorizontal className="size-[18px]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button size="sm" type="button" className="w-fit gap-1.5">
          <Plus className="size-4" aria-hidden />
          {t.addWidget}
        </Button>
        <Button variant="outline" size="sm" type="button">
          {t.connectedBoards}
        </Button>
        <div className="min-w-[200px] flex-1 sm:max-w-xs">
          <Input placeholder={t.filterPlaceholder} className="h-9" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              {t.tasksByStatus}
            </CardTitle>
            <div className="flex gap-1 text-muted-foreground">
              <Filter className="size-3.5" aria-hidden />
              <MoreHorizontal className="size-3.5" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <PieChart data={pieData} />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              {t.tasksByOwner}
            </CardTitle>
            <div className="flex gap-1 text-muted-foreground">
              <Filter className="size-3.5" aria-hidden />
              <MoreHorizontal className="size-3.5" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={barData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
