import type { PhaseSchedule } from '@/types/review';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GANTT_GRID_TEMPLATE, GANTT_MONTHS, PHASE_COLORS } from '@/config/constants';

interface GanttChartProps {
  phases: PhaseSchedule[];
  duration: string;
}

export function GanttChart({ phases, duration }: GanttChartProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">일정 계획</h3>
        <span className="text-xs text-muted-foreground">{duration}</span>
      </div>
      <div className="space-y-2">
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: GANTT_GRID_TEMPLATE }}>
          <div />
          <div />
          <div className="grid grid-cols-7 text-[10px] text-muted-foreground text-center">
            {GANTT_MONTHS.map(m => <span key={m}>M{m}</span>)}
          </div>
        </div>
        {phases.map(p => (
          <Tooltip key={p.phase}>
            <TooltipTrigger asChild>
              <div className="grid items-center gap-2" style={{ gridTemplateColumns: GANTT_GRID_TEMPLATE }}>
                <span className="text-xs font-medium text-foreground truncate">{p.phase}</span>
                <span className="text-[10px] text-muted-foreground">{p.ratio}</span>
                <div className="grid grid-cols-7 h-6 gap-px">
                  {GANTT_MONTHS.map(m => {
                    const inRange = m >= p.startMonth && m <= p.endMonth;
                    const isStart = m === p.startMonth;
                    const isEnd = m === p.endMonth;
                    return (
                      <div key={m} className="relative">
                        {inRange && (
                          <div
                            className="absolute inset-y-1 inset-x-0"
                            style={{
                              backgroundColor: PHASE_COLORS[p.phase] || 'hsl(var(--muted))',
                              borderRadius: `${isStart ? '4px' : '0'} ${isEnd ? '4px' : '0'} ${isEnd ? '4px' : '0'} ${isStart ? '4px' : '0'}`,
                              opacity: 0.8,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{p.phase} — {p.ratio}, M{p.startMonth}~M{p.endMonth}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: GANTT_GRID_TEMPLATE }}>
          <span className="text-xs font-medium text-muted-foreground">PM</span>
          <span className="text-[10px] text-muted-foreground">전체</span>
          <div className="grid grid-cols-7 h-4 gap-px">
            {GANTT_MONTHS.map(m => (
              <div key={m} className="relative">
                <div className="absolute inset-y-0.5 inset-x-0 bg-muted-foreground/20 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
