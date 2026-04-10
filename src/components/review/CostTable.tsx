import { useState } from 'react';
import type { EstimateLineItem, OverheadCostItem } from '@/types/review';
import { Badge } from '@/components/ui/badge';

interface CostTableProps {
  lineItems: EstimateLineItem[];
  overheadItems: OverheadCostItem[];
  subtotalDev: number;
  totalCost: number;
  marginRate: number;
  proposalPrice: number;
  selectedId: string | null;
  onSelectItem: (item: EstimateLineItem) => void;
  onEffortChange: (id: string, effort: number) => void;
  onMarginChange: (rate: number) => void;
}

export function CostTable({
  lineItems,
  overheadItems,
  subtotalDev,
  totalCost,
  marginRate,
  proposalPrice,
  selectedId,
  onSelectItem,
  onEffortChange,
  onMarginChange,
}: CostTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (id: string, field: string, value: number) => {
    setEditingCell(`${id}-${field}`);
    setEditValue(String(value));
  };

  const handleBlur = (id: string, field: string) => {
    const num = parseFloat(editValue);
    if (!isNaN(num) && field === 'effort') {
      onEffortChange(id, num);
    }
    setEditingCell(null);
  };

  const totalDevEffort = lineItems.reduce((s, li) => s + li.effort, 0);
  const overheadCostTotal = overheadItems.reduce((s, o) => s + o.cost, 0);
  const marginAmount = Math.round(totalCost * marginRate / 100);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col style={{ width: '3%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '7%' }} />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-foreground/20">
            <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">#</th>
            <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">요구사항</th>
            <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">모듈</th>
            <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">작업유형</th>
            <th className="px-2 py-2 text-right text-xs font-semibold text-muted-foreground pr-4">공수(M/M)</th>
            <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground pl-4">역할</th>
            <th className="px-2 py-2 text-right text-xs font-semibold text-muted-foreground">단가(만원)</th>
            <th className="px-2 py-2 text-right text-xs font-semibold text-muted-foreground">비용(만원)</th>
            <th className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground">상태</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((li, idx) => (
            <tr
              key={li.id}
              onClick={() => onSelectItem(li)}
              className={`cursor-pointer transition-colors border-b border-border ${
                selectedId === li.id
                  ? 'bg-[hsl(var(--highlight-row))] border-l-[3px] border-l-primary'
                  : 'hover:bg-muted/30'
              }`}
            >
              <td className="px-2 py-2 text-xs text-muted-foreground">{idx + 1}</td>
              <td className="px-2 py-2">
                <div className="text-xs text-primary font-medium">{li.reqId}</div>
                <div className="text-sm truncate">{li.reqSummary}</div>
              </td>
              <td className="px-2 py-2 text-xs">{li.module}</td>
              <td className="px-2 py-2 text-xs">{li.workType}</td>
              <td className="px-2 py-2 text-right pr-4" onDoubleClick={() => handleDoubleClick(li.id, 'effort', li.effort)}>
                {editingCell === `${li.id}-effort` ? (
                  <input
                    type="number"
                    step="0.1"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => handleBlur(li.id, 'effort')}
                    onKeyDown={e => e.key === 'Enter' && handleBlur(li.id, 'effort')}
                    className="w-16 text-right text-sm border border-primary rounded px-1 py-0.5 bg-card"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium">{li.effort.toFixed(1)}</span>
                )}
              </td>
              <td className="px-2 py-2 text-xs pl-4">{li.role} ({li.grade})</td>
              <td className="px-2 py-2 text-right text-sm">{li.unitCost.toLocaleString()}</td>
              <td className="px-2 py-2 text-right text-sm font-medium">{li.cost.toLocaleString()}</td>
              <td className="px-2 py-2 text-center">
                <Badge variant={li.status === '확정' ? 'default' : 'secondary'} className={`text-[10px] px-1.5 py-0 ${li.status === '확정' ? 'bg-status-confirmed-bg text-status-confirmed-foreground hover:bg-status-confirmed-bg' : 'bg-status-estimated-bg text-status-estimated-foreground hover:bg-status-estimated-bg'}`}>
                  {li.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 border-t-2 border-foreground/20 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between px-2">
          <span className="text-muted-foreground">개발 소계</span>
          <div className="flex gap-8">
            <span className="font-medium">{totalDevEffort.toFixed(1)} M/M</span>
            <span className="font-medium w-24 text-right">{subtotalDev.toLocaleString()}만원</span>
          </div>
        </div>
        {overheadItems.map(o => (
          <div key={o.role} className="flex justify-between px-2 text-muted-foreground">
            <span>{o.role}{o.effort > 0 ? ` (${o.effort} M/M)` : ''}</span>
            <span className="w-24 text-right">{o.cost.toLocaleString()}만원</span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex justify-between px-2 font-semibold">
          <span>총 원가</span>
          <div className="flex gap-8">
            <span>{(totalDevEffort + overheadItems.reduce((s, o) => s + o.effort, 0)).toFixed(1)} M/M</span>
            <span className="w-24 text-right">{totalCost.toLocaleString()}만원</span>
          </div>
        </div>
        <div className="flex justify-between px-2 text-muted-foreground items-center">
          <span className="flex items-center gap-1">
            마진 (
            <input
              type="number"
              value={marginRate}
              onChange={e => {
                const v = parseInt(e.target.value);
                if (!isNaN(v)) onMarginChange(v);
              }}
              className="w-10 text-center text-sm border border-border rounded px-0.5 bg-card"
            />
            %)
          </span>
          <span className="w-24 text-right">{marginAmount.toLocaleString()}만원</span>
        </div>
        <div className="border-t-2 border-foreground/30 pt-2 flex justify-between px-2 font-bold text-base">
          <span>제안가</span>
          <span className="text-primary">{proposalPrice.toLocaleString()}만원</span>
        </div>
      </div>
    </div>
  );
}
