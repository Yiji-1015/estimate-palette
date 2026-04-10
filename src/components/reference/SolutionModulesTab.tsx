import { useState } from 'react';
import type { SolutionModule } from '@/types/reference';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface SolutionModulesTabProps {
  modules: SolutionModule[];
  onChange: (modules: SolutionModule[]) => void;
}

export function SolutionModulesTab({ modules, onChange }: SolutionModulesTabProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<SolutionModule | null>(null);

  const openEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditForm({ ...modules[idx] });
  };

  const saveEdit = () => {
    if (editingIdx !== null && editForm) {
      const updated = [...modules];
      updated[editingIdx] = editForm;
      onChange(updated);
      setEditingIdx(null);
      setEditForm(null);
    }
  };

  const addModule = () => {
    const newModule: SolutionModule = {
      id: `MOD-${Date.now()}`,
      name: '신규 모듈',
      role: '',
      description: '',
      coreFeatures: [],
      mappedCategory: '',
    };
    onChange([...modules, newModule]);
    setEditingIdx(modules.length);
    setEditForm(newModule);
  };

  const deleteModule = (id: string) => {
    onChange(modules.filter((mod) => mod.id !== id));
    if (editForm?.id === id) {
      setEditingIdx(null);
      setEditForm(null);
    }
  };

  const mappingTable = [
    { category: 'FR-DATA', description: '데이터 수집/정제/구조화', module: 'DO-MINE' },
    { category: 'FR-SEARCH', description: '검색/RAG/Retrieval', module: 'DO-SPE' },
    { category: 'FR-AGENT', description: 'AI Agent/오케스트레이션', module: 'DO-OCAI' },
    { category: 'FR-PORTAL', description: '사용자 포털/UI', module: 'DO-LOMO' },
    { category: 'FR-ADMIN', description: '관리자 기능', module: 'DO-LOMO' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-primary" onClick={addModule}>
          <Plus className="w-4 h-4 mr-1" /> 모듈 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod, idx) => (
          <div key={mod.id} className="bg-card border rounded-lg p-5 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">{mod.name}</h3>
                <p className="text-sm text-muted-foreground">{mod.role}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(idx)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteModule(mod.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-foreground mb-3">{mod.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {mod.coreFeatures.map((f) => (
                <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
              ))}
            </div>
            <div className="mt-auto">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{mod.mappedCategory}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mapping table */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-3">요구사항 카테고리 → DO 모듈 매핑표</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">카테고리</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">설명</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">매핑 모듈</th>
            </tr>
          </thead>
          <tbody>
            {mappingTable.map((row) => (
              <tr key={row.category + row.module} className="border-b hover:bg-table-hover transition-colors">
                <td className="py-2 px-3 font-mono text-primary">{row.category}</td>
                <td className="py-2 px-3 text-foreground">{row.description}</td>
                <td className="py-2 px-3"><Badge variant="outline">{row.module}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit dialog */}
      <Dialog open={editingIdx !== null} onOpenChange={() => { setEditingIdx(null); setEditForm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>모듈 편집</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div>
                <Label>모듈명</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <Label>역할</Label>
                <Input value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} />
              </div>
              <div>
                <Label>설명</Label>
                <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div>
                <Label>핵심 기능 (쉼표 구분)</Label>
                <Input
                  value={editForm.coreFeatures.join(', ')}
                  onChange={(e) => setEditForm({ ...editForm, coreFeatures: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div>
                <Label>매핑 카테고리</Label>
                <Input value={editForm.mappedCategory} onChange={(e) => setEditForm({ ...editForm, mappedCategory: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingIdx(null); setEditForm(null); }}>취소</Button>
            <Button onClick={saveEdit}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
