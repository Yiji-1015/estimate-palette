import type { CostSummaryData } from '@/types/estimation';
import { Button } from '@/components/ui/button';

interface Props {
  data: CostSummaryData;
  confirmed: boolean;
  onConfirm: () => void;
}

export function CostSummaryBlock({ data, confirmed, onConfirm }: Props) {
  const fmt = (n: number) => n.toLocaleString();
  return (
    <div className="mt-3 border border-border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">항목</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">금액(만원)</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">상세</th>
            </tr>
          </thead>
          <tbody>
            {data.costItems.map((ci, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-3 py-2 text-foreground">{ci.category}</td>
                <td className="px-3 py-2 text-right font-mono text-foreground">{fmt(ci.amount)}</td>
                <td className="px-3 py-2 text-muted-foreground text-xs">{ci.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border bg-muted/30 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">총원가</span>
          <span className="text-lg font-bold text-foreground">{fmt(data.totalCost)}만원</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">목표 마진율</span>
          <span className="font-semibold text-foreground">{data.targetMargin}%</span>
        </div>
        <div className="border-t border-border my-1" />
        <div className="flex justify-between items-center">
          <span className="font-bold text-foreground">제안가</span>
          <span className="text-2xl font-bold text-primary">{fmt(data.proposalPrice)}만원</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">고객 예산:</span>
          <span className="text-sm font-medium text-foreground">{data.budgetRange}만원</span>
          {data.budgetFit === 'within' && <span className="text-emerald-600 text-sm">✅ 예산 범위 내</span>}
          {data.budgetFit === 'over' && <span className="text-destructive text-sm">⚠️ 예산 초과</span>}
          {data.budgetFit === 'under' && <span className="text-amber-600 text-sm">💡 예산 미만</span>}
        </div>
      </div>
      {!confirmed && (
        <div className="p-3 border-t border-border flex justify-end">
          <Button size="sm" onClick={onConfirm}>비용 확인</Button>
        </div>
      )}
      {confirmed && (
        <div className="p-3 border-t border-border text-center text-sm text-emerald-600 font-medium">
          ✅ 비용 확인 완료
        </div>
      )}
    </div>
  );
}
