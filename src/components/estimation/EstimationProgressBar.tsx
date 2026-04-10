import type { EstimationPhase } from '@/types/estimation';
import { ESTIMATION_PHASE_ORDER, ESTIMATION_PHASE_LABELS } from '@/config/constants';
import { Check } from 'lucide-react';

interface Props {
  currentPhase: EstimationPhase;
}

export function EstimationProgressBar({ currentPhase }: Props) {
  const currentIdx = ESTIMATION_PHASE_ORDER.indexOf(currentPhase as typeof ESTIMATION_PHASE_ORDER[number]);

  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-card border-b border-border">
      {ESTIMATION_PHASE_ORDER.map((key, idx) => {
        const isDone = idx < currentIdx || currentPhase === 'complete';
        const isCurrent = idx === currentIdx && currentPhase !== 'complete';
        return (
          <div key={key} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors ${
                  isDone
                    ? 'bg-status-confirmed text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground animate-pulse'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs whitespace-nowrap ${isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {ESTIMATION_PHASE_LABELS[key]}
              </span>
            </div>
            {idx < ESTIMATION_PHASE_ORDER.length - 1 && (
              <div className={`h-px flex-1 min-w-4 ${idx < currentIdx ? 'bg-status-confirmed' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
