import { useState } from 'react';
import type { EffortItem } from '@/types/reference';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EditableNumberCellProps {
  value: number;
  onChange: (val: number) => void;
  step?: number;
}

function EditableNumberCell({ value, onChange, step = 0.1 }: EditableNumberCellProps) {
  const [editing, setEditing] = useState(false);
  const [tempVal, setTempVal] = useState(String(value));

  if (editing) {
    return (
      <input
        type="number"
        step={step}
        className="w-20 px-2 py-1 border rounded text-sm bg-card text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        value={tempVal}
        autoFocus
        onChange={(e) => setTempVal(e.target.value)}
        onBlur={() => {
          setEditing(false);
          const num = parseFloat(tempVal);
          if (!isNaN(num)) onChange(num);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setEditing(false);
            const num = parseFloat(tempVal);
            if (!isNaN(num)) onChange(num);
          }
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <span
      className="cursor-pointer px-2 py-1 rounded hover:bg-primary/10 transition-colors"
      onClick={() => { setTempVal(String(value)); setEditing(true); }}
    >
      {value}
    </span>
  );
}

interface EditableTextCellProps {
  value: string;
  onChange: (val: string) => void;
}

function EditableTextCell({ value, onChange }: EditableTextCellProps) {
  const [editing, setEditing] = useState(false);
  const [tempVal, setTempVal] = useState(value);

  if (editing) {
    return (
      <input
        type="text"
        className="w-full px-2 py-1 border rounded text-sm bg-card text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        value={tempVal}
        autoFocus
        onChange={(e) => setTempVal(e.target.value)}
        onBlur={() => { setEditing(false); onChange(tempVal); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { setEditing(false); onChange(tempVal); }
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <span
      className="cursor-pointer px-2 py-1 rounded hover:bg-primary/10 transition-colors text-muted-foreground"
      onClick={() => { setTempVal(value); setEditing(true); }}
    >
      {value || '—'}
    </span>
  );
}

export { EditableNumberCell, EditableTextCell };

// Effort table for a module
interface EffortTableProps {
  items: EffortItem[];
  onChange: (items: EffortItem[]) => void;
  onRestore: () => void;
}

export function EffortTable({ items, onChange, onRestore }: EffortTableProps) {
  const updateItem = (idx: number, field: keyof EffortItem, value: number | string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };

  const addRow = () => {
    const newId = `NEW-${Date.now()}`;
    onChange([...items, { id: newId, task: '새 항목', newBuild: 0, customize: 0, configOnly: 0, note: '' }]);
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button onClick={onRestore} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> 원본 복원
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">작업 항목</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">신규 구축(M/M)</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">커스터마이징(M/M)</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">설정/연동만(M/M)</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">비고</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b hover:bg-table-hover transition-colors">
                <td className="py-2 px-3 text-foreground">{item.task}</td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.newBuild} onChange={(v) => updateItem(idx, 'newBuild', v)} />
                </td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.customize} onChange={(v) => updateItem(idx, 'customize', v)} />
                </td>
                <td className="py-2 px-3 text-center">
                  <EditableNumberCell value={item.configOnly} onChange={(v) => updateItem(idx, 'configOnly', v)} />
                </td>
                <td className="py-2 px-3">
                  <EditableTextCell value={item.note} onChange={(v) => updateItem(idx, 'note', v)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={addRow}>
        <Plus className="w-4 h-4 mr-1" /> 행 추가
      </Button>
    </div>
  );
}

// Module accordion card
interface ModuleAccordionProps {
  moduleName: string;
  description: string;
  items: EffortItem[];
  onChange: (items: EffortItem[]) => void;
  onRestore: () => void;
}

export function ModuleAccordion({ moduleName, description, items, onChange, onRestore }: ModuleAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">{moduleName}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
        <Badge variant="secondary" className="text-xs">{items.length}개 항목</Badge>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <EffortTable items={items} onChange={onChange} onRestore={onRestore} />
        </div>
      )}
    </div>
  );
}
