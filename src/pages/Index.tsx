import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { mockReferenceData } from '@/data/mockReferenceData';
import type { ReferenceData } from '@/types/reference';
import { ModuleAccordion, EditableNumberCell, EditableTextCell } from '@/components/reference/EffortBaselineTab';
import { SolutionModulesTab } from '@/components/reference/SolutionModulesTab';
import { AdjustmentFactorsTab } from '@/components/reference/AdjustmentFactorsTab';
import { RateCardTab } from '@/components/reference/RateCardTab';
import { WbsTab } from '@/components/reference/WbsTab';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, RotateCcw } from 'lucide-react';

const tabs = [
  { id: 'effort', label: '기준공수표' },
  { id: 'solution', label: '솔루션 모듈' },
  { id: 'adjustment', label: '조정계수' },
  { id: 'rate', label: '단가표' },
  { id: 'wbs', label: 'WBS 규칙' },
];

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export default function Index() {
  const navigate = useNavigate();
  // TODO: API 연동 시 아래로 교체
  // const { data } = await fetch('/api/reference').then(r => r.json());
  const [data, setData] = useState<ReferenceData>(() => deepClone(mockReferenceData));
  const [originalData] = useState<ReferenceData>(() => deepClone(mockReferenceData));
  const [activeTab, setActiveTab] = useState('effort');
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Track which tabs have changes
  const changedTabs = useMemo(() => {
    const changed = new Set<string>();
    if (JSON.stringify(data.effortBaseline) !== JSON.stringify(originalData.effortBaseline) ||
        JSON.stringify(data.siCommon) !== JSON.stringify(originalData.siCommon) ||
        JSON.stringify(data.overhead) !== JSON.stringify(originalData.overhead)) {
      changed.add('effort');
    }
    if (JSON.stringify(data.solutionModules) !== JSON.stringify(originalData.solutionModules)) changed.add('solution');
    if (JSON.stringify(data.adjustmentFactors) !== JSON.stringify(originalData.adjustmentFactors)) changed.add('adjustment');
    if (JSON.stringify(data.rateCard) !== JSON.stringify(originalData.rateCard)) changed.add('rate');
    if (JSON.stringify(data.wbsPhases) !== JSON.stringify(originalData.wbsPhases)) changed.add('wbs');
    return changed;
  }, [data, originalData]);

  const hasChanges = changedTabs.size > 0;

  const handleSave = () => {
    toast.success('저장 완료', { description: '기준자료가 저장되었습니다.' });
    // TODO: API 연동 시 아래로 교체
    // await fetch('/api/reference', { method: 'PUT', body: JSON.stringify(data) });
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    handleSave();
    toast.success('기준자료 확정', { description: 'Step 2로 이동합니다.' });
    navigate('/rfp-analysis');
    // TODO: API 연동 시 아래로 교체
    // await fetch('/api/reference/confirm', { method: 'POST' });
  };

  const handleConfirmClick = () => {
    if (hasChanges) {
      setConfirmOpen(true);
    } else {
      navigate('/rfp-analysis');
    }
  };

  // Module keys for effort baseline
  const moduleKeys = ['doMine', 'doSpe', 'doOcai', 'doLomo'] as const;

  return (
    <AppLayout currentStep={1}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-8 pt-6 pb-4 border-b bg-card">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">기준자료 관리</h1>
              <p className="text-sm text-muted-foreground mt-1">
                견적 산출에 사용되는 기준 데이터를 관리합니다. 공수, 단가, 조정계수 등을 편집할 수 있습니다.
              </p>
            </div>
            <Button onClick={handleConfirmClick}>기준자료 확정</Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm rounded-t-md transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground font-medium border border-b-0 border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {changedTabs.has(tab.id) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warning-dot" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {activeTab === 'effort' && (
            <div className="space-y-4">
              {moduleKeys.map((key) => {
                const mod = data.effortBaseline[key];
                return (
                  <ModuleAccordion
                    key={key}
                    moduleName={mod.name}
                    description={mod.description}
                    items={mod.items}
                    onChange={(items) => {
                      setData((prev) => ({
                        ...prev,
                        effortBaseline: {
                          ...prev.effortBaseline,
                          [key]: { ...prev.effortBaseline[key], items },
                        },
                      }));
                    }}
                    onRestore={() => {
                      setData((prev) => ({
                        ...prev,
                        effortBaseline: {
                          ...prev.effortBaseline,
                          [key]: deepClone(originalData.effortBaseline[key]),
                        },
                      }));
                      toast.info('원본 복원', { description: `${mod.name} 데이터가 복원되었습니다.` });
                    }}
                  />
                );
              })}

              {/* SI Common */}
              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3">SI 공통 작업</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">작업</th>
                      <th className="text-center py-2 px-3 font-medium text-muted-foreground">최소 M/M</th>
                      <th className="text-center py-2 px-3 font-medium text-muted-foreground">최대 M/M</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.siCommon.map((item, idx) => (
                      <tr key={item.id} className="border-b hover:bg-table-hover transition-colors">
                        <td className="py-2 px-3 text-foreground">{item.task}</td>
                        <td className="py-2 px-3 text-center">
                          <EditableNumberCell
                            value={item.minMM}
                            onChange={(v) => {
                              const updated = [...data.siCommon];
                              updated[idx] = { ...updated[idx], minMM: v };
                              setData((prev) => ({ ...prev, siCommon: updated }));
                            }}
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <EditableNumberCell
                            value={item.maxMM}
                            onChange={(v) => {
                              const updated = [...data.siCommon];
                              updated[idx] = { ...updated[idx], maxMM: v };
                              setData((prev) => ({ ...prev, siCommon: updated }));
                            }}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <EditableTextCell
                            value={item.note}
                            onChange={(v) => {
                              const updated = [...data.siCommon];
                              updated[idx] = { ...updated[idx], note: v };
                              setData((prev) => ({ ...prev, siCommon: updated }));
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Overhead */}
              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3">PM/QA 오버헤드</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">역할</th>
                      <th className="text-center py-2 px-3 font-medium text-muted-foreground">비율(%) 최소</th>
                      <th className="text-center py-2 px-3 font-medium text-muted-foreground">비율(%) 최대</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">산출 기준</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.overhead.map((item, idx) => (
                      <tr key={item.id} className="border-b hover:bg-table-hover transition-colors">
                        <td className="py-2 px-3 text-foreground font-medium">{item.role}</td>
                        <td className="py-2 px-3 text-center">
                          <EditableNumberCell
                            value={item.ratioMin}
                            onChange={(v) => {
                              const updated = [...data.overhead];
                              updated[idx] = { ...updated[idx], ratioMin: v };
                              setData((prev) => ({ ...prev, overhead: updated }));
                            }}
                            step={1}
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <EditableNumberCell
                            value={item.ratioMax}
                            onChange={(v) => {
                              const updated = [...data.overhead];
                              updated[idx] = { ...updated[idx], ratioMax: v };
                              setData((prev) => ({ ...prev, overhead: updated }));
                            }}
                            step={1}
                          />
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{item.basis}</td>
                        <td className="py-2 px-3">
                          <EditableTextCell
                            value={item.note}
                            onChange={(v) => {
                              const updated = [...data.overhead];
                              updated[idx] = { ...updated[idx], note: v };
                              setData((prev) => ({ ...prev, overhead: updated }));
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <SolutionModulesTab
              modules={data.solutionModules}
              onChange={(modules) => setData((prev) => ({ ...prev, solutionModules: modules }))}
            />
          )}

          {activeTab === 'adjustment' && (
            <AdjustmentFactorsTab
              factors={data.adjustmentFactors}
              onChange={(factors) => setData((prev) => ({ ...prev, adjustmentFactors: factors }))}
            />
          )}

          {activeTab === 'rate' && (
            <RateCardTab
              rateCard={data.rateCard}
              marginPolicy={data.marginPolicy}
              onRateCardChange={(rateCard) => setData((prev) => ({ ...prev, rateCard }))}
            />
          )}

          {activeTab === 'wbs' && (
            <WbsTab phases={data.wbsPhases} projectManagement={data.wbsProjectManagement} />
          )}
        </div>

        {/* Bottom bar */}
        {hasChanges && (
          <div className="border-t bg-card px-8 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {changedTabs.size}개 섹션에 변경사항이 있습니다
            </span>
            <Button onClick={handleSave}>변경사항 저장</Button>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>기준자료 확정</DialogTitle>
            <DialogDescription>
              {changedTabs.size}개 항목이 수정되었습니다. 확정하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>취소</Button>
            <Button onClick={handleConfirm}>확정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
