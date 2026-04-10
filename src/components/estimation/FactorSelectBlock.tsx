import { useEffect, useState } from 'react';
import type { FactorSelectData } from '@/types/estimation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 각 계수별 선택 가능한 수준들
const factorLevels: Record<string, Array<{ label: string; value: number }>> = {
  complexity: [{ label: '단순', value: 0.7 }, { label: '보통', value: 1.0 }, { label: '복잡', value: 1.3 }, { label: '매우복잡', value: 1.6 }],
  integration: [{ label: '없음', value: 0.8 }, { label: '1~2개', value: 1.0 }, { label: '3~5개', value: 1.3 }, { label: '6개+', value: 1.6 }],
  dataScale: [{ label: '소규모', value: 0.8 }, { label: '중규모', value: 1.0 }, { label: '대규모', value: 1.3 }, { label: '초대규모', value: 1.5 }],
  security: [{ label: '기본', value: 1.0 }, { label: '강화', value: 1.2 }, { label: '최고', value: 1.5 }],
  nonFunctional: [{ label: '기본', value: 1.0 }, { label: '강화', value: 1.2 }, { label: '고성능', value: 1.5 }],
  schedule: [{ label: '여유', value: 0.9 }, { label: '표준', value: 1.0 }, { label: '촉박', value: 1.2 }, { label: '초단기', value: 1.5 }],
  environment: [{ label: '클라우드', value: 0.9 }, { label: '온프레미스', value: 1.0 }, { label: '하이브리드', value: 1.2 }],
  deliverables: [{ label: '간소', value: 0.8 }, { label: '표준', value: 1.0 }, { label: '공공풀셋', value: 1.3 }],
  operationTransfer: [{ label: '미포함', value: 1.0 }, { label: '포함', value: 1.2 }],
  reuse: [{ label: '해당없음', value: 1.0 }, { label: '일부', value: 0.8 }, { label: '상당부분', value: 0.6 }],
};

interface Props {
  data: FactorSelectData;
  confirmed: boolean;
  onConfirm: () => void;
  onChange: (data: FactorSelectData) => void;
}

export function FactorSelectBlock({ data, confirmed, onConfirm, onChange }: Props) {
  const [factors, setFactors] = useState(data.factors);

  useEffect(() => {
    setFactors(data.factors);
  }, [data.factors]);

  const selectLevel = (idx: number, label: string, value: number) => {
    const next = [...factors];
    next[idx] = { ...next[idx], selectedLevel: label, selectedValue: value };
    setFactors(next);
    onChange({ factors: next });
  };

  return (
    <div className="mt-3 border border-border rounded-lg bg-card overflow-hidden">
      <div className="grid grid-cols-2 gap-3 p-3">
        {factors.map((f, idx) => {
          const levels = factorLevels[f.factorId] || [];
          return (
            <div key={f.factorId} className="border border-border rounded-lg p-3 bg-background">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-foreground">{f.factorName}</span>
                <span className="text-xs font-mono text-primary font-semibold">×{f.selectedValue}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{f.aiReason}</p>
              <div className="flex flex-wrap gap-1">
                {levels.map(lv => {
                  const isSelected = f.selectedLevel === lv.label;
                  const isAiSuggested = f.aiSuggested === lv.label;
                  return (
                    <button
                      key={lv.label}
                      disabled={confirmed}
                      onClick={() => selectLevel(idx, lv.label, lv.value)}
                      className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      } ${confirmed ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {lv.label} {lv.value}
                      {isAiSuggested && !isSelected && (
                        <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">추천</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!confirmed && (
        <div className="p-3 border-t border-border bg-muted/30 flex justify-end">
          <Button size="sm" onClick={onConfirm}>계수 확인</Button>
        </div>
      )}
      {confirmed && (
        <div className="p-3 border-t border-border bg-muted/30 text-center text-sm text-emerald-600 font-medium">
          ✅ 계수 확인 완료
        </div>
      )}
    </div>
  );
}
