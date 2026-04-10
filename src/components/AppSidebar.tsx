import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  MessageSquare,
  CheckCircle,
  Plus,
  FolderOpen,
  Settings,
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
  { icon: FileText, label: 'RFP 분석', path: 'rfp-analysis', emoji: '📄' },
  { icon: MessageSquare, label: '견적 산정', path: 'estimation', emoji: '💬' },
  { icon: CheckCircle, label: '리뷰 & 확정', path: 'review', emoji: '✅' },
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
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');

  const isReferencePage = location.pathname === '/' || location.pathname === '/reference';

  const handleCreateProject = () => {
    if (!newName.trim()) return;
    const proj = addProject(newName.trim(), newClient.trim());
    setNewDialogOpen(false);
    setNewName('');
    setNewClient('');
    navigate(`/projects/${proj.id}/rfp-analysis`);
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

        {/* 구분선 */}
        <div className="mx-4 my-1 border-t border-[hsl(var(--sidebar-hover))]" />

        {/* 프로젝트 섹션 */}
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

        {/* 프로젝트 목록 */}
        <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
          {projects.map((proj) => {
            const isSelected = projectId === proj.id;
            return (
              <div key={proj.id}>
                <button
                  onClick={() => navigate(`/projects/${proj.id}/rfp-analysis`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isSelected
                      ? 'bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))] font-medium'
                      : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-fg))]'
                  }`}
                >
                  <FolderOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{proj.name}</span>
                </button>

                {/* 선택된 프로젝트의 단계 표시 */}
                {isSelected && (
                  <div className="ml-5 mt-1 mb-1 space-y-0.5">
                    {projectSteps.map((step) => {
                      const stepPath = `/projects/${proj.id}/${step.path}`;
                      const isActive = location.pathname === stepPath;
                      return (
                        <button
                          key={step.path}
                          onClick={() => navigate(stepPath)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                            isActive
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
          <div className="mx-3 mb-4 p-3 rounded-lg bg-[hsl(var(--sidebar-hover))] border border-[hsl(var(--sidebar-active)/.3)]">
            <p className="text-sm font-medium text-[hsl(var(--sidebar-fg))] truncate" title={rfpDoc.fileName}>
              📎 {rfpDoc.fileName}
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
