import type { SiItem } from '@/types/reference';
import { EditableNumberCell, EditableTextCell } from '@/components/reference/EffortBaselineTab';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface SiCommonTableProps {
  items: SiItem[];
  onChange: (items: SiItem[]) => void;
}

export function SiCommonTable({ items, onChange }: SiCommonTableProps) {
  const updateItem = (idx: number, patch: Partial<SiItem>) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], ...patch };
    onChange(updated);
  };

  const deleteItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    onChange([...items, { id: `SI-NEW-${Date.now()}`, task: '신규 작업', minMM: 0, maxMM: 0, note: '' }]);
  };

  return (
    <div className="bg-card border rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-3">SI 공통 작업</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-sm table-auto">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">작업</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground w-32">최소 M/M</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground w-32">최대 M/M</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">비고</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground w-14">관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b hover:bg-table-hover transition-colors group">
                <td className="py-2 px-3 text-foreground">
                  <EditableTextCell value={item.task} onChange={(v) => updateItem(idx, { task: v })} />
                </td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.minMM} onChange={(v) => updateItem(idx, { minMM: v })} />
                </td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.maxMM} onChange={(v) => updateItem(idx, { maxMM: v })} />
                </td>
                <td className="py-2 px-3 text-left">
                  <EditableTextCell value={item.note} onChange={(v) => updateItem(idx, { note: v })} />
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    className="opacity-60 hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => deleteItem(idx)}
                    aria-label="SI 공통 작업 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={addItem}>
        <Plus className="w-4 h-4 mr-1" /> 항목 추가
      </Button>
    </div>
  );
}
