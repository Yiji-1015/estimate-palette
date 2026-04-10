import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  CheckCircle,
  Plus,
  FolderOpen,
  FolderClosed,
  Settings,
  FileUp,
} from 'lucide-react';
import { APP_CONFIG } from '@/config/app';
import { getProjects, addProject, type Project } from '@/stores/projectStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface RfpDocInfo {
  fileName: string;
  client?: string;
  docType: string;
  status: '업로드 전' | '분석 중' | '분석 완료' | '리뷰 중' | '확정';
}

const projectSteps = [
  { icon: FileText, label: 'RFP 분석', path: 'rfp-analysis', emoji: '📄', step: 1 },
  { icon: MessageSquare, label: '견적 산정', path: 'estimation', emoji: '💬', step: 2 },
  { icon: CheckCircle, label: '리뷰 & 확정', path: 'review', emoji: '✅', step: 3 },
];

interface AppSidebarProps {
  currentStep?: number;
  rfpDoc?: RfpDocInfo | null;
}

export function AppSidebar({ rfpDoc }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const [projects] = useState<Project[]>(() => getProjects());
  const [expandedId, setExpandedId] = useState<string | null>(projectId ?? null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');

  const isReferencePage = location.pathname === '/' || location.pathname === '/reference';

  // 현재 선택된 프로젝트의 현재 단계 번호 (URL 기반)
  const currentStepNum = projectId
    ? (projectSteps.find((s) => location.pathname.includes(s.path))?.step ?? 0)
    : 0;

  const handleCreateProject = () => {
    if (!newName.trim()) return;
    const proj = addProject(newName.trim(), newClient.trim());
    setNewDialogOpen(false);
    setNewName('');
    setNewClient('');
    setExpandedId(proj.id);
    navigate(`/projects/${proj.id}/rfp-analysis`);
  };

  const handleProjectClick = (id: string) => {
    if (expandedId === id) {
      // 토글: 이미 열린 프로젝트를 다시 클릭하면 접기
      setExpandedId(null);
    } else {
      setExpandedId(id);
      navigate(`/projects/${id}/rfp-analysis`);
    }
  };

  return (
    <>
      <aside className="w-60 min-h-screen flex flex-col bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-fg))]">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[hsl(var(--sidebar-hover))]">
          <span className="font-bold text-xl tracking-tight">{APP_CONFIG.name}</span>
        </div>

        {/* 기준자료 관리 — 고정 메뉴 */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => navigate('/reference')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
              isReferencePage
                ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-fg))] font-medium'
                : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-fg))]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>기준자료 관리</span>
          </button>
        </div>

        <div className="mx-4 my-1 border-t border-[hsl(var(--sidebar-hover))]" />

        {/* 프로젝트 목록 */}
        <div className="px-3 pt-2 flex items-center justify-between">
          <span className="text-xs text-[hsl(var(--sidebar-muted))] uppercase tracking-wider px-3">
            프로젝트
          </span>
          <button
            onClick={() => setNewDialogOpen(true)}
            className="p-1 rounded hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-fg))] transition-colors"
            title="새 프로젝트"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-2 px-3 space-y-0.5 overflow-y-auto">
          {projects.map((proj) => {
            const isExpanded = expandedId === proj.id;
            const isActive = projectId === proj.id;
            const FolderIcon = isExpanded ? FolderOpen : FolderClosed;
            return (
              <div key={proj.id}>
                <button
                  onClick={() => handleProjectClick(proj.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))] font-medium'
                      : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-fg))]'
                  }`}
                >
                  <FolderIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{proj.name}</span>
                </button>

                {/* 펼친 프로젝트의 하위 단계 */}
                {isExpanded && (
                  <div className="ml-5 mt-1 mb-1 space-y-0.5">
                    {projectSteps.map((step) => {
                      const stepPath = `/projects/${proj.id}/${step.path}`;
                      const isStepActive = location.pathname === stepPath;
                      return (
                        <button
                          key={step.path}
                          onClick={() => navigate(stepPath)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                            isStepActive
                              ? 'text-[hsl(var(--sidebar-fg))] bg-[hsl(var(--sidebar-active)/.15)] font-medium'
                              : 'text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-fg))]'
                          }`}
                        >
                          <span>{step.emoji}</span>
                          <span>{step.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* RFP Document Info */}
        {rfpDoc && (
          <div className="mx-3 mb-3 p-3 rounded-lg bg-[hsl(var(--sidebar-hover))] border border-[hsl(var(--sidebar-active)/.3)]">
            <div className="flex items-center gap-2 mb-2">
              <FileUp className="w-4 h-4 text-[hsl(var(--sidebar-muted))]" />
              <span className="text-xs text-[hsl(var(--sidebar-muted))] uppercase tracking-wider">현재 RFP</span>
            </div>
            <p className="text-sm font-medium text-[hsl(var(--sidebar-fg))] truncate" title={rfpDoc.fileName}>
              {rfpDoc.fileName}
            </p>
            {rfpDoc.client?.trim() && (
              <p className="text-xs text-[hsl(var(--sidebar-muted))] mt-1 truncate">
                {rfpDoc.client}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-[hsl(var(--sidebar-muted))]">{rfpDoc.docType}</span>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-fg))]">
                {rfpDoc.status}
              </span>
            </div>
          </div>
        )}

        {/* 진행 단계 (Progress Stepper) */}
        {projectId && (
          <div className="px-4 pb-6 border-t border-[hsl(var(--sidebar-hover))] pt-4">
            <div className="text-xs text-[hsl(var(--sidebar-muted))] mb-3 uppercase tracking-wider">진행 단계</div>
            <div className="space-y-2">
              {projectSteps.map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      s.step === currentStepNum
                        ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-fg))]'
                        : s.step < currentStepNum
                        ? 'bg-status-confirmed text-[hsl(var(--sidebar-fg))]'
                        : 'bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-muted))]'
                    }`}
                  >
                    {s.step}
                  </div>
                  <span
                    className={`text-sm ${
                      s.step === currentStepNum ? 'text-[hsl(var(--sidebar-fg))]' : 'text-[hsl(var(--sidebar-muted))]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* 새 프로젝트 생성 다이얼로그 */}
      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새 프로젝트 생성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="proj-name">프로젝트명</Label>
              <Input
                id="proj-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="예: 스마트팩토리 MES 구축"
              />
            </div>
            <div>
              <Label htmlFor="proj-client">고객사</Label>
              <Input
                id="proj-client"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="예: 현대자동차"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateProject} disabled={!newName.trim()}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
