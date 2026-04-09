// RFP 문서 메타정보
export interface RfpMeta {
  fileName: string;
  pageCount: number;
  docType: '공공 RFP' | '민간 요구사항서' | '회의록' | '기타';
  analyzedAt: string;
  version: string;
}

// 사업 기본정보
export interface ProjectInfo {
  projectName: string;
  client: string;
  projectType: '공공' | '민간';
  buildType: 'SI' | '솔루션' | '혼합';
  budget: string;
  budgetStatus: '확정' | '추정' | '미확인';
  duration: string;
  evaluationMethod: string;
  source: string;
}

// 요구사항 항목
export type RequirementCategory = 'FR-SEARCH' | 'FR-AGENT' | 'FR-PORTAL' | 'FR-DATA' | 'FR-INT' | 'FR-ADMIN' | 'FR-CUSTOM';
export type RequirementPriority = '필수' | '권장' | '옵션' | '제외' | '모호';
export type RequirementStatus = '확정' | '추정' | '모호' | '미확인';
export type RequirementType = 'FR' | 'NFR' | 'CON' | 'EVAL';

export interface Requirement {
  id: string;
  type: RequirementType;
  originalText: string;
  source: string;
  interpretedScope: string;
  category?: RequirementCategory;
  priority: RequirementPriority;
  status: RequirementStatus;
  note: string;
}

// 교차검증 항목
export interface VerificationItem {
  id: string;
  name: string;
  method: string;
  passCriteria: string;
  result: '통과' | '미비' | '미검증';
  detail: string;
}

// 고객 확인 질문
export interface CustomerQuestion {
  id: string;
  relatedReqId: string;
  question: string;
  reason: string;
  estimateImpact: string;
  answered: boolean;
  answer?: string;
}

// 누락/모호/모순 항목
export interface IssueItem {
  type: '누락' | '모호' | '모순';
  item: string;
  description: string;
  action: string;
}

// 스캔 진행 상태
export interface ScanProgress {
  currentScan: 0 | 1 | 2 | 3;
  scanStatus: 'idle' | 'scanning' | 'complete';
  scanDescriptions: string[];
}

// 전체 분석 결과
export interface RfpAnalysisData {
  meta: RfpMeta;
  projectInfo: ProjectInfo;
  requirements: Requirement[];
  verificationItems: VerificationItem[];
  customerQuestions: CustomerQuestion[];
  issues: IssueItem[];
  scanProgress: ScanProgress;
}
