import { useState } from 'react';
import type { ModuleMappingData } from '@/types/estimation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const moduleOptions = ['DO-MINE', 'DO-SPE', 'DO-OCAI', 'DO-LOMO', 'SI-INTEGRATION', 'SI-CUSTOM'];
const workTypeOptions: Array<'신규 구축' | '커스터마이징' | '설정/연동만'> = ['신규 구축', '커스터마이징', '설정/연동만'];

const confidenceIcon = { high: '🟢', medium: '🟡', low: '🔴' };

interface Props {
  data: ModuleMappingData;
  confirmed: boolean;
  onConfirm: () => void;
}

export function ModuleMappingBlock({ data, confirmed, onConfirm }: Props) {
  const [items, setItems] = useState(data.items);

  const updateModule = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], userOverride: val };
    setItems(next);
  };

  const updateWorkType = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], userWorkTypeOverride: val as any };
    setItems(next);
  };

  return (
    <div className="mt-3 border border-border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">요구사항</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">AI 추천 모듈</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">작업 유형</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">신뢰도</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.reqId} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-3 py-2">
                  <span className="font-mono text-xs text-muted-foreground mr-1">{item.reqId}</span>
                  <span className="text-foreground">{item.reqSummary}</span>
                </td>
                <td className="px-3 py-2">
                  {confirmed ? (
                    <span className="text-foreground">{item.userOverride || item.suggestedModule}</span>
                  ) : (
                    <Select value={item.userOverride || item.suggestedModule} onValueChange={(v) => updateModule(idx, v)}>
                      <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {moduleOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className="px-3 py-2">
                  {confirmed ? (
                    <span className="text-foreground">{item.userWorkTypeOverride || item.workType}</span>
                  ) : (
                    <Select value={item.userWorkTypeOverride || item.workType} onValueChange={(v) => updateWorkType(idx, v)}>
                      <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {workTypeOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className="px-3 py-2 text-center text-base">{confidenceIcon[item.confidence]}</td>
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
