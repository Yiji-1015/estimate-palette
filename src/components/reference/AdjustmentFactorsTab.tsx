import type { AdjustmentFactor } from '@/types/reference';
import { EditableNumberCell } from './EffortBaselineTab';

interface AdjustmentFactorsTabProps {
  factors: AdjustmentFactor[];
  onChange: (factors: AdjustmentFactor[]) => void;
}

export function AdjustmentFactorsTab({ factors, onChange }: AdjustmentFactorsTabProps) {
  const updateFactorLevel = (fIdx: number, lIdx: number, value: number) => {
    const updated = [...factors];
    const levels = [...updated[fIdx].levels];
    levels[lIdx] = { ...levels[lIdx], value };
    updated[fIdx] = { ...updated[fIdx], levels };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {factors.map((factor, fIdx) => (
        <div key={factor.id} className="bg-card border rounded-lg p-5">
          <div className="mb-3">
            <span className="font-semibold text-foreground">{factor.name}</span>
            <span className="text-sm text-muted-foreground ml-2">{factor.description}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">수준</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">계수값</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">기준 설명</th>
              </tr>
            </thead>
            <tbody>
              {factor.levels.map((level, lIdx) => (
                <tr
                  key={level.level}
                  className={`border-b hover:bg-table-hover transition-colors ${
                    level.value === 1.0 ? 'bg-highlight-row' : ''
                  }`}
                >
                  <td className="py-2 px-3 text-foreground font-medium">
                    {level.level}
                    {level.value === 1.0 && (
                      <span className="ml-2 text-xs text-primary font-normal">(기본)</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <EditableNumberCell
                      value={level.value}
                      onChange={(v) => updateFactorLevel(fIdx, lIdx, v)}
                    />
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">{level.criteria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
