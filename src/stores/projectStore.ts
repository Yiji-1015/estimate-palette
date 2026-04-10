/**
 * 프로젝트 목록 관리 (프론트 전용 목업)
 * 
 * 초기 1개, 최대 3개까지 생성 가능
 * TODO: 백엔드 연동 시 API 호출로 교체
 */

export const MAX_PROJECTS = 3;

export interface Project {
  id: string;
  name: string;
  client: string;
  createdAt: string;
  /** 현재 진행 단계: 1=RFP분석, 2=견적산정, 3=리뷰확정 */
  currentStep: 1 | 2 | 3;
  status: '진행 중' | '완료';
  /** RFP 문서가 업로드되었는지 여부 */
  rfpUploaded: boolean;
}

let projects: Project[] = [
  {
    id: 'proj-1',
    name: '스마트팩토리 MES 구축',
    client: '현대자동차',
    createdAt: '2025-04-08',
    currentStep: 2,
    status: '진행 중',
    rfpUploaded: true,
  },
];

export function getProjects(): Project[] {
  return [...projects];
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function canAddProject(): boolean {
  return projects.length < MAX_PROJECTS;
}

export function addProject(name: string, client: string): Project | null {
  if (!canAddProject()) return null;
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name,
    client,
    createdAt: new Date().toISOString().slice(0, 10),
    currentStep: 1,
    status: '진행 중',
    rfpUploaded: false,
  };
  projects = [newProject, ...projects];
  return newProject;
}

export function updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'client'>>) {
  projects = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
}

export function deleteProject(id: string) {
  projects = projects.filter((p) => p.id !== id);
}

export function updateProjectStep(id: string, step: 1 | 2 | 3) {
  projects = projects.map((p) => (p.id === id ? { ...p, currentStep: step } : p));
}

export function markRfpUploaded(id: string) {
  projects = projects.map((p) => (p.id === id ? { ...p, rfpUploaded: true } : p));
}
