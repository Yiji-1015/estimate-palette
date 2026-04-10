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
  Pencil,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { APP_CONFIG } from '@/config/app';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  canAddProject,
  getProject,
  MAX_PROJECTS,
  type Project,
} from '@/stores/projectStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [expandedId, setExpandedId] = useState<string | null>(projectId ?? null);

  // New project dialog
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');

  // Edit project dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editClient, setEditClient] = useState('');

  // Delete confirm
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isReferencePage = location.pathname === '/' || location.pathname === '/reference';

  const currentStepNum = projectId
    ? (projectSteps.find((s) => location.pathname.includes(s.path))?.step ?? 0)
    : 0;

  // 현재 프로젝트가 RFP 업로드 완료인지
  const currentProject = projectId ? getProject(projectId) : undefined;
  const showProgress = projectId && currentProject?.rfpUploaded;

  const refreshProjects = () => setProjects(getProjects());

  const handleCreateProject = () => {
    if (!newName.trim()) return;
    const proj = addProject(newName.trim(), newClient.trim());
    if (!proj) return;
    setNewDialogOpen(false);
    setNewName('');
    setNewClient('');
    refreshProjects();
    setExpandedId(proj.id);
    navigate(`/projects/${proj.id}/rfp-analysis`);
  };

  const handleEditProject = () => {
    if (!editId || !editName.trim()) return;
    updateProject(editId, { name: editName.trim(), client: editClient.trim() });
    setEditDialogOpen(false);
    refreshProjects();
  };

  const handleDeleteProject = () => {
    if (!deleteId) return;
    deleteProject(deleteId);
    setDeleteDialogOpen(false);
    refreshProjects();
    if (projectId === deleteId) {
      navigate('/reference');
    }
  };

  const openEditDialog = (proj: Project) => {
    setEditId(proj.id);
    setEditName(proj.name);
    setEditClient(proj.client);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleProjectClick = (id: string) => {
    if (expandedId === id) {
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

        {/* 프로젝트 헤더 */}
        <div className="px-3 pt-2 pb-1 flex items-center justify-between">
          <span className="text-xs text-[hsl(var(--sidebar-muted))] uppercase tracking-wider px-3">
            프로젝트 ({projects.length}/{MAX_PROJECTS})
          </span>
          <button
            onClick={() => setNewDialogOpen(true)}
            disabled={!canAddProject()}
            className={`p-1 rounded transition-colors ${
              canAddProject()
                ? 'hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-fg))]'
                : 'text-[hsl(var(--sidebar-hover))] cursor-not-allowed'
            }`}
            title={canAddProject() ? '새 프로젝트' : `최대 ${MAX_PROJECTS}개까지 생성 가능`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 프로젝트 목록 — 스크롤 영역 */}
        <ScrollArea className="flex-1 min-h-0">
          <nav className="py-2 px-3 space-y-0.5">
            {projects.map((proj) => {
              const isExpanded = expandedId === proj.id;
              const isActive = projectId === proj.id;
              const FolderIcon = isExpanded ? FolderOpen : FolderClosed;
              return (
                <div key={proj.id}>
                  <div className="flex items-center group">
                    <button
                      onClick={() => handleProjectClick(proj.id)}
                      className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))] font-medium'
                          : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-fg))]'
                      }`}
                    >
                      <FolderIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{proj.name}</span>
                    </button>

                    {/* 수정/삭제 메뉴 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-muted))]">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => openEditDialog(proj)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(proj.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* 하위 단계 */}
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
        </ScrollArea>

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

        {/* 진행 단계 — 항상 표시, RFP 미업로드 시 비활성 */}
        {projectId && (
          <div className={`px-4 pb-6 border-t border-[hsl(var(--sidebar-hover))] pt-4 ${!showProgress ? 'opacity-40' : ''}`}>
            <div className="text-xs text-[hsl(var(--sidebar-muted))] mb-3 uppercase tracking-wider">진행 단계</div>
            <div className="space-y-2">
              {projectSteps.map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      showProgress && s.step === currentStepNum
                        ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-fg))]'
                        : showProgress && s.step < currentStepNum
                        ? 'bg-status-confirmed text-[hsl(var(--sidebar-fg))]'
                        : 'bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-muted))]'
                    }`}
                  >
                    {s.step}
                  </div>
                  <span
                    className={`text-sm ${
                      showProgress && s.step === currentStepNum ? 'text-[hsl(var(--sidebar-fg))]' : 'text-[hsl(var(--sidebar-muted))]'
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
            <Button variant="outline" onClick={() => setNewDialogOpen(false)}>취소</Button>
            <Button onClick={handleCreateProject} disabled={!newName.trim()}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 수정 다이얼로그 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>프로젝트 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-name">프로젝트명</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-client">고객사</Label>
              <Input
                id="edit-client"
                value={editClient}
                onChange={(e) => setEditClient(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>취소</Button>
            <Button onClick={handleEditProject} disabled={!editName.trim()}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로젝트를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제된 프로젝트는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
