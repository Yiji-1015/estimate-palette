import { useState } from 'react';
import type { ScenarioSelectData } from '@/types/estimation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  data: ScenarioSelectData;
  confirmed: boolean;
  onConfirm: () => void;
}

export function ScenarioSelectBlock({ data, confirmed, onConfirm }: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>(data.selectedId);
  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="mt-3 border border-border rounded-lg bg-card overflow-hidden">
      <div className="grid grid-cols-3 gap-3 p-3">
        {data.scenarios.map(sc => {
          const isSelected = selectedId === sc.id;
          const isRecommended = sc.id === 'recommended';
          return (
            <div
              key={sc.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                  : isRecommended
                  ? 'border-primary/50 bg-background'
                  : 'border-border bg-background'
              } ${confirmed ? 'cursor-default' : 'hover:border-primary/50'}`}
              onClick={() => !confirmed && setSelectedId(sc.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">{sc.name}</span>
                {sc.tag && (
                  <Badge variant={isRecommended ? 'default' : 'secondary'} className="text-[10px]">
                    {sc.tag}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{sc.description}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 M/M</span>
                  <span className="text-foreground font-medium">{sc.totalMM}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">원가</span>
                  <span className="text-foreground">{fmt(sc.totalCost)}만원</span>
                </div>
                <div className="border-t border-border my-1" />
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">제안가</span>
                  <span className="text-lg font-bold text-primary">{fmt(sc.proposalPrice)}만원</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xs text-muted-foreground">포함 요구사항 {sc.includedReqs.length}건</span>
              </div>
            </div>
          );
        })}
      </div>
      {!confirmed && (
        <div className="p-3 border-t border-border bg-muted/30 flex justify-end gap-2">
          <Button size="sm" disabled={!selectedId} onClick={onConfirm}>
            {selectedId ? '시나리오 확정 → 리뷰로' : '시나리오를 선택하세요'}
          </Button>
        </div>
      )}
      {confirmed && (
        <div className="p-3 border-t border-border bg-muted/30 text-center text-sm text-emerald-600 font-medium">
          ✅ 시나리오 확정 완료
        </div>
      )}
    </div>
  );
}
