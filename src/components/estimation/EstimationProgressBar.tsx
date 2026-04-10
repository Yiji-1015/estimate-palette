import type { EstimationPhase } from '@/types/estimation';
import { Check } from 'lucide-react';

const phases: Array<{ key: EstimationPhase; label: string }> = [
  { key: 'mapping', label: '솔루션 매핑' },
  { key: 'factors', label: '조정계수' },
  { key: 'effort', label: '공수 산정' },
  { key: 'cost', label: '비용 계산' },
  { key: 'scenario', label: '시나리오' },
];

const phaseOrder: EstimationPhase[] = ['mapping', 'factors', 'effort', 'cost', 'scenario'];

interface Props {
  currentPhase: EstimationPhase;
}

export function EstimationProgressBar({ currentPhase }: Props) {
  const currentIdx = phaseOrder.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-card border-b border-border">
      {phases.map((p, idx) => {
        const isDone = idx < currentIdx || currentPhase === 'complete';
        const isCurrent = idx === currentIdx && currentPhase !== 'complete';
        return (
          <div key={p.key} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground animate-pulse'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs whitespace-nowrap ${isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {p.label}
              </span>
            </div>
            {idx < phases.length - 1 && (
              <div className={`h-px flex-1 min-w-4 ${idx < currentIdx ? 'bg-emerald-500' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
