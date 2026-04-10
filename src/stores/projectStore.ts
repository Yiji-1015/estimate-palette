/**
 * 프로젝트 목록 관리 (프론트 전용 목업)
 * 
 * ChatGPT의 대화 목록처럼,
 * 각 프로젝트가 독립적인 RFP 분석 → 견적 산정 → 리뷰 흐름을 가집니다.
 * 
 * TODO: 백엔드 연동 시 API 호출로 교체
 */

export interface Project {
  id: string;
  name: string;
  client: string;
  createdAt: string;
  /** 현재 진행 단계: 1=RFP분석, 2=견적산정, 3=리뷰확정 */
  currentStep: 1 | 2 | 3;
  status: '진행 중' | '완료';
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: '스마트팩토리 MES 구축',
    client: '현대자동차',
    createdAt: '2025-04-08',
    currentStep: 2,
    status: '진행 중',
  },
  {
    id: 'proj-2',
    name: '통합 데이터 플랫폼',
    client: 'SK텔레콤',
    createdAt: '2025-04-05',
    currentStep: 3,
    status: '진행 중',
  },
  {
    id: 'proj-3',
    name: 'AI 고객상담 시스템',
    client: '삼성SDS',
    createdAt: '2025-03-28',
    currentStep: 3,
    status: '완료',
  },
];

let projects: Project[] = [...MOCK_PROJECTS];

export function getProjects(): Project[] {
  return [...projects];
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function addProject(name: string, client: string): Project {
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name,
    client,
    createdAt: new Date().toISOString().slice(0, 10),
    currentStep: 1,
    status: '진행 중',
  };
  projects = [newProject, ...projects];
  return newProject;
}

export function updateProjectStep(id: string, step: 1 | 2 | 3) {
  projects = projects.map((p) => (p.id === id ? { ...p, currentStep: step } : p));
}
