import { useState } from 'react';
import type { RateCardItem, MarginPolicy } from '@/types/reference';
import { EditableNumberCell } from './EffortBaselineTab';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface RateCardTabProps {
  rateCard: RateCardItem[];
  marginPolicy: MarginPolicy[];
  onRateCardChange: (items: RateCardItem[]) => void;
}

export function RateCardTab({ rateCard, marginPolicy, onRateCardChange }: RateCardTabProps) {
  const updateRate = (idx: number, rate: number) => {
    const updated = [...rateCard];
    updated[idx] = { ...updated[idx], rate };
    onRateCardChange(updated);
  };

  const addRow = () => {
    onRateCardChange([
      ...rateCard,
      { id: `RC-NEW-${Date.now()}`, role: '신규', grade: '중급', rate: 0 },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Rate card */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-3">내부 원가 기준</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">역할</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">등급</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">단가(만원/M)</th>
            </tr>
          </thead>
          <tbody>
            {rateCard.map((item, idx) => (
              <tr key={item.id} className="border-b hover:bg-table-hover transition-colors">
                <td className="py-2 px-3 text-foreground">{item.role}</td>
                <td className="py-2 px-3 text-foreground">{item.grade}</td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.rate} onChange={(v) => updateRate(idx, v)} step={50} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={addRow}>
          <Plus className="w-4 h-4 mr-1" /> 행 추가
        </Button>
      </div>

      {/* Margin policy */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-3">마진 기준</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">사업 유형</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">목표 마진율</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">하한 마진율</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">비고</th>
            </tr>
          </thead>
          <tbody>
            {marginPolicy.map((item) => (
              <tr key={item.type} className="border-b hover:bg-table-hover transition-colors">
                <td className="py-2 px-3 text-foreground font-medium">{item.type}</td>
                <td className="py-2 px-3 text-center text-foreground">{item.targetMargin}</td>
                <td className="py-2 px-3 text-center text-foreground">{item.minMargin}</td>
                <td className="py-2 px-3 text-muted-foreground">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
