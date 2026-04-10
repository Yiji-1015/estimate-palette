import { useState } from 'react';
import type { EffortConfirmData } from '@/types/estimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  data: EffortConfirmData;
  confirmed: boolean;
  onConfirm: () => void;
}

export function EffortConfirmBlock({ data, confirmed, onConfirm }: Props) {
  const [lineItems, setLineItems] = useState(data.lineItems);

  const updateEffort = (idx: number, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    const next = [...lineItems];
    next[idx] = { ...next[idx], adjustedEffort: num };
    setLineItems(next);
  };

  const currentSubtotal = lineItems.reduce((s, li) => s + li.adjustedEffort, 0);

  return (
    <div className="mt-3 border border-border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-2 py-2 text-left font-medium text-muted-foreground text-xs">요구사항</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground text-xs">모듈</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground text-xs">작업유형</th>
              <th className="px-2 py-2 text-right font-medium text-muted-foreground text-xs">기준</th>
              <th className="px-2 py-2 text-right font-medium text-muted-foreground text-xs">조정</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground text-xs">산출식</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((li, idx) => (
              <tr key={li.reqId} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-2 py-1.5">
                  <span className="font-mono text-xs text-muted-foreground mr-1">{li.reqId}</span>
                  <span className="text-xs text-foreground">{li.reqSummary}</span>
                </td>
                <td className="px-2 py-1.5 text-xs text-foreground">{li.module}</td>
                <td className="px-2 py-1.5 text-xs text-foreground">{li.workType}</td>
                <td className="px-2 py-1.5 text-right text-xs text-muted-foreground">{li.baseEffort}</td>
                <td className="px-2 py-1.5 text-right">
                  {!confirmed && li.editable ? (
                    <Input
                      type="number"
                      step="0.1"
                      value={li.adjustedEffort}
                      onChange={(e) => updateEffort(idx, e.target.value)}
                      className="w-16 h-7 text-xs text-right"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-foreground">{li.adjustedEffort}</span>
                  )}
                </td>
                <td className="px-2 py-1.5 text-[11px] text-muted-foreground max-w-[200px] truncate" title={li.adjustmentDetail}>
                  {li.adjustmentDetail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-border bg-muted/30 space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">개발 소계</span><span className="font-medium text-foreground">{currentSubtotal.toFixed(1)} M/M</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">PM (12%)</span><span className="text-foreground">{data.pmOverhead} M/M</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">QA (12%)</span><span className="text-foreground">{data.qaOverhead} M/M</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">아키텍트 (8%)</span><span className="text-foreground">{data.archOverhead} M/M</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">리스크 (8%)</span><span className="text-foreground">{data.riskOverhead} M/M</span></div>
        <div className="border-t border-border my-1" />
        <div className="flex justify-between font-bold text-base"><span className="text-foreground">총계</span><span className="text-primary">{data.totalMM} M/M</span></div>
      </div>
      {!confirmed && (
        <div className="p-3 border-t border-border flex justify-end">
          <Button size="sm" onClick={onConfirm}>공수 확인</Button>
        </div>
      )}
      {confirmed && (
        <div className="p-3 border-t border-border text-center text-sm text-emerald-600 font-medium">
          ✅ 공수 확인 완료
        </div>
      )}
    </div>
  );
}
