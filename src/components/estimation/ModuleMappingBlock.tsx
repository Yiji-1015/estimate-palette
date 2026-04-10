import { useEffect, useState } from 'react';
import type { ModuleMappingData } from '@/types/estimation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { MODULE_IDS, WORK_TYPES } from '@/config/constants';

const moduleOptions = [...MODULE_IDS];
const workTypeOptions = [...WORK_TYPES];

interface Props {
  data: ModuleMappingData;
  confirmed: boolean;
  onConfirm: () => void;
  onChange: (data: ModuleMappingData) => void;
}

export function ModuleMappingBlock({ data, confirmed, onConfirm, onChange }: Props) {
  const [items, setItems] = useState(data.items);

  useEffect(() => {
    setItems(data.items);
  }, [data.items]);

  const updateModule = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], userOverride: val };
    setItems(next);
    onChange({ items: next });
  };

  const updateWorkType = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], userWorkTypeOverride: val as any };
    setItems(next);
    onChange({ items: next });
  };

  return (
    <div className="mt-3 border border-border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground w-[45%]">요구사항</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground w-[28%]">AI 추천 모듈</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground w-[27%]">작업 유형</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.reqId} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-3 py-2">
                  <span className="font-mono text-xs text-muted-foreground mr-1.5">{item.reqId}</span>
                  <span className="text-foreground text-xs">{item.reqSummary}</span>
                </td>
                <td className="px-3 py-2">
                  {confirmed ? (
                    <span className="text-foreground text-xs">{item.userOverride || item.suggestedModule}</span>
                  ) : (
                    <Select value={item.userOverride || item.suggestedModule} onValueChange={(v) => updateModule(idx, v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {moduleOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className="px-3 py-2">
                  {confirmed ? (
                    <span className="text-foreground text-xs">{item.userWorkTypeOverride || item.workType}</span>
                  ) : (
                    <Select value={item.userWorkTypeOverride || item.workType} onValueChange={(v) => updateWorkType(idx, v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {workTypeOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!confirmed && (
        <div className="p-3 border-t border-border bg-muted/30 flex justify-end">
          <Button size="sm" onClick={onConfirm}>매핑 확인</Button>
        </div>
      )}
      {confirmed && (
        <div className="p-3 border-t border-border bg-muted/30 text-center text-sm text-emerald-600 font-medium">
          ✅ 매핑 확인 완료
        </div>
      )}
    </div>
  );
}
