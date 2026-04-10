import { useState } from 'react';
import { APP_CONFIG } from '@/config/app';
import { AppLayout } from '@/components/AppLayout';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Download, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { mockEstimateSheet, mockMinimalSheet, mockExtendedSheet, mockEvidenceMap } from '@/data';
import { CostTable } from '@/components/review/CostTable';
import { GanttChart } from '@/components/review/GanttChart';
import { EvidencePanel, ModulePieChart } from '@/components/review/EvidencePanel';
import type { EstimateLineItem, EstimateSheet } from '@/types/review';
import { SCENARIO_NAMES } from '@/config/constants';

const scenarioSheets: Record<string, EstimateSheet> = {
  [SCENARIO_NAMES.minimal]: mockMinimalSheet,
  [SCENARIO_NAMES.recommended]: mockEstimateSheet,
  [SCENARIO_NAMES.extended]: mockExtendedSheet,
};

export default function Review() {
  const [scenarioKey, setScenarioKey] = useState<string>(SCENARIO_NAMES.recommended);
  const [sheet, setSheet] = useState<EstimateSheet>({ ...mockEstimateSheet });
  const [selectedItem, setSelectedItem] = useState<EstimateLineItem | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [exclusionsOpen, setExclusionsOpen] = useState(false);
  const [risksOpen, setRisksOpen] = useState(false);

  const evidence = selectedItem ? mockEvidenceMap[selectedItem.reqId] || null : null;
  const estimatedCount = sheet.lineItems.filter(li => li.status === '추정').length;

  const switchScenario = (name: string) => {
    setScenarioKey(name);
    setSheet({ ...scenarioSheets[name] });
    setSelectedItem(null);
    setIsConfirmed(false);
  };

  const handleEffortChange = (id: string, effort: number) => {
    setSheet(prev => {
      const items = prev.lineItems.map(li => {
        if (li.id !== id) return li;
        const cost = Math.round(effort * li.unitCost);
        return { ...li, effort, cost };
      });
      const subtotalDev = items.reduce((s, li) => s + li.cost, 0);
      const overheadTotal = prev.overheadItems.reduce((s, o) => s + o.cost, 0);
      const totalCost = subtotalDev + overheadTotal;
      const proposalPrice = Math.round(totalCost * (1 + prev.marginRate / 100));
      return { ...prev, lineItems: items, subtotalDev, totalCost, proposalPrice };
    });
  };

  const handleMarginChange = (rate: number) => {
    setSheet(prev => {
      const proposalPrice = Math.round(prev.totalCost * (1 + rate / 100));
      return { ...prev, marginRate: rate, proposalPrice };
    });
  };

  const handleConfirm = () => {
    if (estimatedCount > 0) {
      setShowWarning(true);
    } else {
      doConfirm();
    }
  };

  const doConfirm = () => {
    setIsConfirmed(true);
    setShowConfirm(false);
    setShowWarning(false);
    toast.success('견적서가 최종 확정되었습니다');
  };

  const handleExport = (format: string) => {
    toast(`${format} 다운로드 준비 중...`, { description: 'TODO: API 연동 시 실제 파일 생성' });
  };

  const totalEffort = sheet.lineItems.reduce((s, li) => s + li.effort, 0) +
    sheet.overheadItems.reduce((s, o) => s + o.effort, 0);

  return (
    <AppLayout currentStep={4} rfpDoc={{ fileName: `${sheet.projectName}.pdf`, client: sheet.client, docType: 'RFP', status: isConfirmed ? '확정' : '리뷰 중' }}>
      <div className="flex flex-col h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">리뷰 & 확정</h1>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{sheet.scenarioTag}</Badge>
            {isConfirmed && (
              <Badge className="bg-status-confirmed-bg text-status-confirmed-foreground hover:bg-status-confirmed-bg gap-1">
                <CheckCircle2 className="w-3 h-3" /> 확정됨 {sheet.createdAt}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Scenario switcher */}
            <div className="flex rounded-md border border-border overflow-hidden text-xs">
              {Object.keys(scenarioSheets).map(name => (
                <button
                  key={name}
                  onClick={() => switchScenario(name)}
                  className={`px-3 py-1.5 transition-colors ${scenarioKey === name ? 'bg-primary text-primary-foreground font-medium' : 'bg-card text-muted-foreground hover:bg-muted'}`}
                >
                  {name} {scenarioKey === name && '✓'}
                </button>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-3.5 h-3.5" /> 내보내기 <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('Excel (.xlsx)')}>Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('PDF (.pdf)')}>PDF (.pdf)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('클립보드')}>클립보드 복사</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" onClick={() => setShowConfirm(true)} disabled={isConfirmed}>
              최종 확정
            </Button>
          </div>
        </div>

        {/* Main content */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={55} minSize={40}>
            <div className="h-full overflow-y-auto bg-muted/30 p-6">
              <div className="bg-card rounded-lg shadow-sm border border-border p-8 max-w-none">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-border">
                  <div>
                    <span className="text-xl font-bold text-foreground tracking-tight">{APP_CONFIG.name}</span>
                    <div className="mt-3">
                      <h2 className="text-base font-bold text-foreground">{sheet.projectName}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">{sheet.client}</p>
                      <p className="text-xs text-muted-foreground mt-1">시나리오: {sheet.scenarioName} ({sheet.scenarioTag})</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground space-y-0.5">
                    <p>견적서 번호: EST-2026-001</p>
                    <p>작성일: {sheet.createdAt}</p>
                    <p>버전: {sheet.version}</p>
                    <p>유효기간: {sheet.validUntil}</p>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: '총 공수', value: `${totalEffort.toFixed(1)} M/M`, accent: false },
                    { label: '총 원가', value: `${sheet.totalCost.toLocaleString()}만원`, accent: false },
                    { label: '제안가', value: `${sheet.proposalPrice.toLocaleString()}만원`, accent: true },
                  ].map(c => (
                    <div key={c.label} className={`rounded-lg p-4 text-center border ${c.accent ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border'}`}>
                      <div className="text-xs text-muted-foreground mb-1">{c.label}</div>
                      <div className={`text-xl font-bold ${c.accent ? 'text-primary' : 'text-foreground'}`}>{c.value}</div>
                    </div>
                  ))}
                </div>

                {/* Cost table */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-foreground mb-3">상세 비용 내역</h3>
                  <CostTable
                    lineItems={sheet.lineItems}
                    overheadItems={sheet.overheadItems}
                    subtotalDev={sheet.subtotalDev}
                    totalCost={sheet.totalCost}
                    marginRate={sheet.marginRate}
                    proposalPrice={sheet.proposalPrice}
                    selectedId={selectedItem?.id || null}
                    onSelectItem={setSelectedItem}
                    onEffortChange={handleEffortChange}
                    onMarginChange={handleMarginChange}
                  />
                </div>

                {/* Gantt */}
                <div className="mb-8">
                  <GanttChart phases={sheet.phases} duration={sheet.duration} />
                </div>

                {/* Collapsible sections */}
                <div className="space-y-2">
                  <Collapsible open={assumptionsOpen} onOpenChange={setAssumptionsOpen}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm font-semibold text-foreground py-2 hover:text-primary transition-colors">
                      {assumptionsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      전제조건 ({sheet.assumptions.length})
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-1 pl-6 pb-3">
                        {sheet.assumptions.map((a, i) => (
                          <li key={i} className="text-sm text-muted-foreground list-disc">{a}</li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={exclusionsOpen} onOpenChange={setExclusionsOpen}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm font-semibold text-foreground py-2 hover:text-primary transition-colors">
                      {exclusionsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      제외사항 ({sheet.exclusions.length})
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-1 pl-6 pb-3">
                        {sheet.exclusions.map((e, i) => (
                          <li key={i} className="text-sm text-muted-foreground list-disc">{e}</li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={risksOpen} onOpenChange={setRisksOpen}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm font-semibold text-foreground py-2 hover:text-primary transition-colors">
                      {risksOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      리스크 ({sheet.risks.length})
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <table className="w-full text-sm table-fixed mb-3">
                        <colgroup>
                          <col style={{ width: '45%' }} />
                          <col style={{ width: '10%' }} />
                          <col style={{ width: '45%' }} />
                        </colgroup>
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">리스크</th>
                            <th className="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">영향도</th>
                            <th className="px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">대응 방안</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sheet.risks.map(r => (
                            <tr key={r.id} className="border-b border-border">
                              <td className="px-2 py-1.5 text-sm">{r.description}</td>
                              <td className="px-2 py-1.5 text-center">
                                <Badge variant="outline" className={`text-[10px] ${r.impact === '상' ? 'border-destructive text-destructive' : 'border-status-warning text-status-warning'}`}>
                                  {r.impact}
                                </Badge>
                              </td>
                              <td className="px-2 py-1.5 text-sm text-muted-foreground">{r.mitigation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={45} minSize={30}>
            <div className="h-full overflow-y-auto bg-secondary/30 border-l border-border p-5">
              {selectedItem ? (
                <EvidencePanel selectedItem={selectedItem} evidence={evidence} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="text-muted-foreground text-sm mb-8">
                    좌측 견적서에서 항목을 클릭하면<br />상세 근거를 확인할 수 있습니다
                  </div>
                  <ModulePieChart lineItems={sheet.lineItems} />
                  <div className="mt-6 flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-status-confirmed-foreground">{sheet.lineItems.filter(l => l.status === '확정').length}</div>
                      <div className="text-xs text-muted-foreground">확정</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{estimatedCount}</div>
                      <div className="text-xs text-muted-foreground">추정</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Confirm dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>견적서를 최종 확정합니다</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>선택 시나리오</span><span className="font-medium text-foreground">{sheet.scenarioName}</span></div>
                <div className="flex justify-between"><span>총 공수</span><span className="font-medium text-foreground">{totalEffort.toFixed(1)} M/M</span></div>
                <div className="flex justify-between"><span>제안가</span><span className="font-medium text-foreground">{sheet.proposalPrice.toLocaleString()}만원</span></div>
                 {estimatedCount > 0 && (
                   <div className="flex justify-between"><span>추정 상태 항목</span><span className="font-medium text-status-warning">{estimatedCount}건</span></div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확정</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Warning dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-status-warning" /> 추정 항목 안내
            </AlertDialogTitle>
            <AlertDialogDescription>
              추정 상태인 항목이 {estimatedCount}건 있습니다. 확정 전 검토를 권장합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>돌아가서 검토</AlertDialogCancel>
            <AlertDialogAction onClick={doConfirm}>그래도 확정</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
