import { useState, useMemo } from 'react';
import type { RfpAnalysisData, Requirement, RequirementType, RequirementStatus, RequirementPriority, RequirementCategory } from '@/types/rfpAnalysis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<RequirementStatus, string> = {
  '확정': 'bg-emerald-500/10 text-emerald-600 border-0',
  '추정': 'bg-primary/10 text-primary border-0',
  '모호': 'bg-warning-dot/10 text-warning-dot border-0',
  '미확인': 'bg-destructive/10 text-destructive border-0',
};

const priorityColors: Record<RequirementPriority, string> = {
  '필수': 'bg-destructive/10 text-destructive border-0',
  '권장': 'bg-primary/10 text-primary border-0',
  '옵션': 'bg-muted text-muted-foreground border-0',
  '제외': 'bg-muted text-muted-foreground line-through border-0',
  '모호': 'bg-warning-dot/10 text-warning-dot border-0',
};

const typeLabels: Record<RequirementType | 'ALL', string> = {
  ALL: '전체',
  FR: 'FR (기능)',
  NFR: 'NFR (비기능)',
  CON: 'CON (제약)',
  EVAL: 'EVAL (평가)',
};

const categories: RequirementCategory[] = ['FR-SEARCH', 'FR-AGENT', 'FR-PORTAL', 'FR-DATA', 'FR-INT', 'FR-ADMIN', 'FR-CUSTOM'];

interface RequirementsStepProps {
  data: RfpAnalysisData;
  onChange: (data: RfpAnalysisData) => void;
}

export function RequirementsStep({ data, onChange }: RequirementsStepProps) {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<RequirementType | 'ALL'>('ALL');
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [projectInfoOpen, setProjectInfoOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredReqs = useMemo(() => {
    return data.requirements.filter((r) => {
      if (activeType !== 'ALL' && r.type !== activeType) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && r.category !== filterCategory) return false;
      return true;
    });
  }, [data.requirements, activeType, filterStatus, filterPriority, filterCategory]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: data.requirements.length };
    data.requirements.forEach((r) => { counts[r.type] = (counts[r.type] || 0) + 1; });
    return counts;
  }, [data.requirements]);

  const updateReq = (updated: Requirement) => {
    const reqs = data.requirements.map((r) => r.id === updated.id ? updated : r);
    onChange({ ...data, requirements: reqs });
    setSelectedReq(updated);
  };

  const addReq = () => {
    const frCount = data.requirements.filter(r => r.type === 'FR').length;
    const newReq: Requirement = {
      id: `FR-${String(frCount + 1).padStart(3, '0')}`,
      type: 'FR',
      originalText: '',
      source: '',
      interpretedScope: '',
      category: 'FR-CUSTOM',
      priority: '필수',
      status: '미확인',
      note: '',
    };
    onChange({ ...data, requirements: [...data.requirements, newReq] });
  };

  const deleteReq = (id: string) => {
    onChange({ ...data, requirements: data.requirements.filter(r => r.id !== id) });
  };

  const updateQuestion = (qId: string, field: string, value: unknown) => {
    const questions = data.customerQuestions.map(q =>
      q.id === qId ? { ...q, [field]: value } : q
    );
    onChange({ ...data, customerQuestions: questions });
  };

  const ambiguousCount = data.requirements.filter(r => r.status === '모호').length;
  const unansweredCount = data.customerQuestions.filter(q => !q.answered).length;
  const summary = {
    total: data.requirements.length,
    required: data.requirements.filter(r => r.priority === '필수').length,
    recommended: data.requirements.filter(r => r.priority === '권장').length,
    optional: data.requirements.filter(r => r.priority === '옵션').length,
    ambiguous: data.requirements.filter(r => r.priority === '모호').length,
  };

  const passCount = data.verificationItems.filter(v => v.result === '통과').length;
  const failCount = data.verificationItems.filter(v => v.result === '미비').length;

  const handleConfirmClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    toast.success('요구사항 확정', { description: '견적 산정으로 이동합니다.' });
    navigate('/estimation');
  };

  const handleSave = () => {
    toast.success('저장 완료', { description: '변경사항이 저장되었습니다.' });
    // TODO: API 연동 시 아래로 교체
    // await fetch(`/api/rfp/${id}/requirements`, { method: 'PUT', body: JSON.stringify(data.requirements) });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-6 pb-4">
        {/* Area A: Project Info */}
        <div className="bg-card border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => setProjectInfoOpen(!projectInfoOpen)}
          >
            <span className="font-semibold text-foreground">사업 기본정보</span>
            {projectInfoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {projectInfoOpen && (
            <div className="px-5 pb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground w-32">항목</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">내용</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground w-28">출처</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground w-20">신뢰도</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: '사업명', value: data.projectInfo.projectName, source: data.projectInfo.source, status: '확정' as const },
                    { label: '발주처', value: data.projectInfo.client, source: data.projectInfo.source, status: '확정' as const },
                    { label: '사업 유형', value: `${data.projectInfo.projectType} / ${data.projectInfo.buildType}`, source: data.projectInfo.source, status: '확정' as const },
                    { label: '예산', value: data.projectInfo.budget, source: data.projectInfo.source, status: data.projectInfo.budgetStatus },
                    { label: '기간', value: data.projectInfo.duration, source: data.projectInfo.source, status: '확정' as const },
                    { label: '평가방법', value: data.projectInfo.evaluationMethod, source: data.projectInfo.source, status: '확정' as const },
                  ].map(row => (
                    <tr key={row.label} className="border-b hover:bg-table-hover transition-colors">
                      <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                      <td className="py-2 px-3 text-foreground">{row.value}</td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">{row.source}</td>
                      <td className="py-2 px-3">
                        <Badge className={statusColors[row.status as RequirementStatus] || 'bg-muted'} variant="secondary">
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Area B: Requirements */}
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">요구사항 목록</h3>
            <Button size="sm" variant="outline" onClick={addReq}>
              <Plus className="w-4 h-4 mr-1" /> 요구사항 추가
            </Button>
          </div>

          {/* Type tabs */}
          <div className="flex gap-1 mb-4 border-b">
            {(['ALL', 'FR', 'NFR', 'CON', 'EVAL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-2 text-sm transition-colors relative ${
                  activeType === t ? 'text-foreground font-medium border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {typeLabels[t]}
                <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">{typeCounts[t] || 0}</Badge>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="확정">확정</SelectItem>
                <SelectItem value="추정">추정</SelectItem>
                <SelectItem value="모호">모호</SelectItem>
                <SelectItem value="미확인">미확인</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="우선순위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 우선순위</SelectItem>
                <SelectItem value="필수">필수</SelectItem>
                <SelectItem value="권장">권장</SelectItem>
                <SelectItem value="옵션">옵션</SelectItem>
                <SelectItem value="모호">모호</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground w-20">ID</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">원문 표현</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground w-24">출처</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground w-24">카테고리</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground w-20">우선순위</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground w-20">상태</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredReqs.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b hover:bg-table-hover transition-colors cursor-pointer group"
                    onClick={() => { setSelectedReq(req); setSheetOpen(true); }}
                  >
                    <td className="py-2 px-3 font-mono text-primary text-xs">{req.id}</td>
                    <td className="py-2 px-3 text-foreground max-w-xs truncate">{req.originalText}</td>
                    <td className="py-2 px-3 text-muted-foreground text-xs">{req.source}</td>
                    <td className="py-2 px-3">
                      {req.category && <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{req.category}</span>}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Badge className={priorityColors[req.priority]} variant="secondary">{req.priority}</Badge>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Badge className={statusColors[req.status]} variant="secondary">{req.status}</Badge>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={(e) => { e.stopPropagation(); deleteReq(req.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Area C: Verification + Questions side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Verification */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">교차검증 결과</h3>
              <Badge className={failCount > 0 ? 'bg-warning-dot/10 text-warning-dot border-0' : 'bg-emerald-500/10 text-emerald-600 border-0'}>
                {passCount}/{data.verificationItems.length} 통과
              </Badge>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground w-8">#</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">검증 항목</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground w-16">결과</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">미비 사항</th>
                </tr>
              </thead>
              <tbody>
                {data.verificationItems.map((v) => (
                  <tr key={v.id} className={`border-b ${v.result === '미비' ? 'bg-warning-dot/5' : ''}`}>
                    <td className="py-2 px-2 text-muted-foreground text-xs">{v.id}</td>
                    <td className="py-2 px-2 text-foreground text-xs">{v.name}</td>
                    <td className="py-2 px-2 text-center">{v.result === '통과' ? '✅' : '⚠️'}</td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">{v.detail || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer questions */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">고객 확인 질문</h3>
              <Badge className="bg-warning-dot/10 text-warning-dot border-0">
                미응답 {unansweredCount}건
              </Badge>
            </div>
            <div className="space-y-3">
              {data.customerQuestions.map((q) => (
                <div key={q.id} className="border rounded-md p-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">{q.id}</span>
                    <span className="text-xs text-muted-foreground">→ {q.relatedReqId}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{q.question}</p>
                  <p className="text-xs text-muted-foreground mb-2">사유: {q.reason} | 영향: {q.estimateImpact}</p>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={q.answered}
                      onCheckedChange={(checked) => updateQuestion(q.id, 'answered', checked)}
                    />
                    <Input
                      placeholder="응답 입력..."
                      className="h-7 text-xs"
                      value={q.answer || ''}
                      onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t bg-card px-6 py-3 flex items-center justify-between mt-auto">
        <span className="text-sm text-muted-foreground">
          요구사항 {summary.total}건 (필수 {summary.required} / 권장 {summary.recommended} / 옵션 {summary.optional} / 모호 {summary.ambiguous})
        </span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>변경사항 저장</Button>
          <Button onClick={handleConfirmClick}>요구사항 확정 → 견적 산정으로</Button>
        </div>
      </div>

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedReq?.id} 상세</SheetTitle>
          </SheetHeader>
          {selectedReq && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs text-muted-foreground">원문</Label>
                <p className="text-sm text-foreground mt-1 bg-muted/50 p-3 rounded">{selectedReq.originalText}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">출처</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedReq.source}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">해석된 범위</Label>
                <Textarea
                  value={selectedReq.interpretedScope}
                  onChange={(e) => updateReq({ ...selectedReq, interpretedScope: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              {selectedReq.type === 'FR' && (
                <div>
                  <Label className="text-xs text-muted-foreground">카테고리</Label>
                  <Select
                    value={selectedReq.category || ''}
                    onValueChange={(v) => updateReq({ ...selectedReq, category: v as RequirementCategory })}
                  >
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">우선순위</Label>
                <Select
                  value={selectedReq.priority}
                  onValueChange={(v) => updateReq({ ...selectedReq, priority: v as RequirementPriority })}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['필수', '권장', '옵션', '제외', '모호'] as const).map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">상태</Label>
                <Select
                  value={selectedReq.status}
                  onValueChange={(v) => updateReq({ ...selectedReq, status: v as RequirementStatus })}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['확정', '추정', '모호', '미확인'] as const).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">비고</Label>
                <Textarea
                  value={selectedReq.note}
                  onChange={(e) => updateReq({ ...selectedReq, note: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {(ambiguousCount > 0 || unansweredCount > 0) && <AlertTriangle className="w-5 h-5 text-warning-dot" />}
              요구사항 확정
            </DialogTitle>
            <DialogDescription>
              {ambiguousCount > 0 && <p>⚠️ 모호 상태 {ambiguousCount}건이 있습니다.</p>}
              {unansweredCount > 0 && <p>⚠️ 미응답 질문 {unansweredCount}건이 있습니다.</p>}
              <p className="mt-2">확정하고 견적 산정으로 이동하시겠습니까?</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>취소</Button>
            <Button onClick={handleConfirm}>확정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
