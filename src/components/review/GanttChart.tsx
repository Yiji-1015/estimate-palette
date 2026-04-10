import type { PhaseSchedule } from '@/types/review';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const phaseColors: Record<string, string> = {
  '분석/설계': 'hsl(217, 91%, 60%)',
  '개발': 'hsl(142, 71%, 45%)',
  '테스트': 'hsl(25, 95%, 53%)',
  '이관/안정화': 'hsl(262, 83%, 58%)',
};

interface GanttChartProps {
  phases: PhaseSchedule[];
  duration: string;
}

export function GanttChart({ phases, duration }: GanttChartProps) {
  const months = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">일정 계획</h3>
        <span className="text-xs text-muted-foreground">{duration}</span>
      </div>
      <div className="space-y-2">
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: '100px 40px 1fr' }}>
          <div />
          <div />
          <div className="grid grid-cols-7 text-[10px] text-muted-foreground text-center">
            {months.map(m => <span key={m}>M{m}</span>)}
          </div>
        </div>
        {phases.map(p => (
          <Tooltip key={p.phase}>
            <TooltipTrigger asChild>
              <div className="grid items-center gap-2" style={{ gridTemplateColumns: '100px 40px 1fr' }}>
                <span className="text-xs font-medium text-foreground truncate">{p.phase}</span>
                <span className="text-[10px] text-muted-foreground">{p.ratio}</span>
                <div className="grid grid-cols-7 h-6 gap-px">
                  {months.map(m => {
                    const inRange = m >= p.startMonth && m <= p.endMonth;
                    const isStart = m === p.startMonth;
                    const isEnd = m === p.endMonth;
                    return (
                      <div key={m} className="relative">
                        {inRange && (
                          <div
                            className="absolute inset-y-1 inset-x-0"
                            style={{
                              backgroundColor: phaseColors[p.phase] || 'hsl(var(--muted))',
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
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: '100px 40px 1fr' }}>
          <span className="text-xs font-medium text-muted-foreground">PM</span>
          <span className="text-[10px] text-muted-foreground">전체</span>
          <div className="grid grid-cols-7 h-4 gap-px">
            {months.map(m => (
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
