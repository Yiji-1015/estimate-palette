import type { OverheadItem } from '@/types/reference';
import { EditableNumberCell, EditableTextCell } from '@/components/reference/EffortBaselineTab';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface OverheadTableProps {
  items: OverheadItem[];
  onChange: (items: OverheadItem[]) => void;
}

export function OverheadTable({ items, onChange }: OverheadTableProps) {
  const updateItem = (idx: number, patch: Partial<OverheadItem>) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], ...patch };
    onChange(updated);
  };

  const deleteItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    onChange([
      ...items,
      { id: `OH-NEW-${Date.now()}`, role: '신규 역할', ratioMin: 0, ratioMax: 0, basis: '', note: '' },
    ]);
  };

  return (
    <div className="bg-card border rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-3">PM/QA 오버헤드</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm table-auto">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground w-40">역할</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground w-32">비율(%) 최소</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground w-32">비율(%) 최대</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">산출 기준</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">비고</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground w-14">관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b hover:bg-table-hover transition-colors group">
                <td className="py-2 px-3 text-foreground font-medium">
                  <EditableTextCell value={item.role} onChange={(v) => updateItem(idx, { role: v })} />
                </td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.ratioMin} onChange={(v) => updateItem(idx, { ratioMin: v })} step={1} />
                </td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.ratioMax} onChange={(v) => updateItem(idx, { ratioMax: v })} step={1} />
                </td>
                <td className="py-2 px-3 text-left text-muted-foreground">
                  <EditableTextCell value={item.basis} onChange={(v) => updateItem(idx, { basis: v })} />
                </td>
                <td className="py-2 px-3 text-left">
                  <EditableTextCell value={item.note} onChange={(v) => updateItem(idx, { note: v })} />
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    className="opacity-60 hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => deleteItem(idx)}
                    aria-label="오버헤드 행 삭제"
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
