/**
 * 프로젝트 전역 공통 상수
 * 모듈, 색상, 라벨, 작업유형, 페이즈 등 여러 컴포넌트에서 공유하는 데이터를 한 곳에서 관리합니다.
 */

/* ─── 솔루션 모듈 ─── */

export const MODULE_IDS = [
  'DO-MINE',
  'DO-SPE',
  'DO-OCAI',
  'DO-LOMO',
  'SI-INTEGRATION',
  'SI-CUSTOM',
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

/** 모듈별 색상 (차트, 범례 등) */
export const MODULE_COLORS: Record<ModuleId, string> = {
  'DO-MINE': 'hsl(25, 95%, 53%)',
  'DO-SPE': 'hsl(217, 91%, 60%)',
  'DO-OCAI': 'hsl(142, 71%, 45%)',
  'DO-LOMO': 'hsl(262, 83%, 58%)',
  'SI-INTEGRATION': 'hsl(340, 82%, 52%)',
  'SI-CUSTOM': 'hsl(200, 70%, 50%)',
};

/** 모듈 약칭 라벨 */
export const MODULE_LABELS: Record<ModuleId, string> = {
  'DO-MINE': 'DO-MINE',
  'DO-SPE': 'DO-SPE',
  'DO-OCAI': 'DO-OCAI',
  'DO-LOMO': 'DO-LOMO',
  'SI-INTEGRATION': 'SI',
  'SI-CUSTOM': 'SI-C',
};

/** 모듈 상세 정보 */
export const MODULE_INFO = [
  { id: 'DO-MINE', name: '데이터 수집·정제·구조화', desc: '크롤러, ETL, 메타데이터 자동생성' },
  { id: 'DO-SPE', name: '검색 & RAG Core Engine', desc: 'Hybrid Search, Citation, 권한 검색' },
  { id: 'DO-OCAI', name: 'Agentic AI Orchestration', desc: 'Multi-Agent Workflow, Tool 연동' },
  { id: 'DO-LOMO', name: '포털 & 모니터링', desc: 'AI 포털 UI, 관리자 대시보드' },
] as const;

/* ─── 작업 유형 ─── */

export const WORK_TYPES = ['신규 구축', '커스터마이징', '설정/연동만'] as const;
export type WorkType = (typeof WORK_TYPES)[number];

/* ─── 견적 참조 데이터 ─── */

export const ADJUSTMENT_FACTOR_RANGES = [
  '복잡도: 0.7 ~ 1.6',
  '연계: 0.8 ~ 1.6',
  '데이터: 0.8 ~ 1.5',
  '보안: 1.0 ~ 1.5',
  '비기능: 1.0 ~ 1.5',
  '일정: 0.9 ~ 1.5',
  '환경: 0.9 ~ 1.2',
  '산출물: 0.8 ~ 1.3',
  '운영전환: 1.0 ~ 1.2',
  '재사용감면: 0.6 ~ 1.0',
] as const;

export const ROLE_RATE_REFERENCES = [
  'AI 개발 (고급): 1,100만원',
  '개발자 (고급): 900만원',
  '개발자 (중급): 750만원',
  'PM (고급): 1,000만원',
  'QA (중급): 700만원',
  '아키텍트 (고급): 1,100만원',
] as const;

export const TARGET_MARGIN_LABEL = '마진 정책: 목표 25%';

/* ─── 프로젝트 페이즈 & 색상 ─── */

export const PHASE_COLORS: Record<string, string> = {
  '분석/설계': 'hsl(217, 91%, 60%)',
  '개발': 'hsl(142, 71%, 45%)',
  '테스트': 'hsl(25, 95%, 53%)',
  '이관/안정화': 'hsl(262, 83%, 58%)',
};

export const GANTT_MONTHS = [1, 2, 3, 4, 5, 6, 7] as const;
export const GANTT_GRID_TEMPLATE = '100px 40px 1fr';

/* ─── 요구사항 카테고리 → 모듈 매핑 ─── */

export const CATEGORY_MODULE_MAPPING = [
  { category: 'FR-DATA', description: '데이터 수집/정제/구조화', module: 'DO-MINE' },
  { category: 'FR-SEARCH', description: '검색/RAG/Retrieval', module: 'DO-SPE' },
  { category: 'FR-AGENT', description: 'AI Agent/오케스트레이션', module: 'DO-OCAI' },
  { category: 'FR-PORTAL', description: '사용자 포털/UI', module: 'DO-LOMO' },
  { category: 'FR-ADMIN', description: '관리자 기능', module: 'DO-LOMO' },
] as const;

/* ─── 견적 상태 ─── */

export const ESTIMATE_STATUSES = ['추정', '확인', '확정'] as const;
export type EstimateStatus = (typeof ESTIMATE_STATUSES)[number];

/* ─── 견적 산정 페이즈 ─── */

export const ESTIMATION_PHASE_ORDER = ['mapping', 'factors', 'effort', 'cost', 'scenario'] as const;

export const ESTIMATION_PHASE_LABELS: Record<string, string> = {
  mapping: '솔루션 매핑',
  factors: '조정계수',
  effort: '공수 산정',
  cost: '비용 계산',
  scenario: '시나리오',
};

/* ─── 시나리오 이름 ─── */

export const SCENARIO_NAMES = {
  minimal: '필수충족안',
  recommended: '권장안',
  extended: '확장안',
} as const;
