// 기준공수표 항목
export interface EffortItem {
  id: string;
  task: string;
  newBuild: number;    // 신규 구축 M/M
  customize: number;   // 커스터마이징 M/M
  configOnly: number;  // 설정/연동만 M/M
  note: string;
}

// DO 모듈 기준공수
export interface ModuleEffort {
  name: string;         // "DO-MINE", "DO-SPE" 등
  description: string;
  items: EffortItem[];
}

// SI 공통 작업
export interface SiItem {
  id: string;
  task: string;
  minMM: number;
  maxMM: number;
  note: string;
}

// PM/QA 오버헤드
export interface OverheadItem {
  id: string;
  role: string;
  ratioMin: number;  // %
  ratioMax: number;  // %
  basis: string;
  note: string;
}

// 조정계수
export interface AdjustmentLevel {
  level: string;
  value: number;
  criteria: string;
}

export interface AdjustmentFactor {
  id: string;
  name: string;
  description: string;
  levels: AdjustmentLevel[];
}

// 단가표
export interface RateCardItem {
  id: string;
  role: string;
  grade: string;
  rate: number;  // 만원/M
}

export interface MarginPolicy {
  type: string;
  targetMargin: string;
  minMargin: string;
  note: string;
}

// WBS
export interface WbsTask {
  wbsId: string;
  task: string;
  role: string;
  deliverable: string;
}

export interface WbsPhase {
  id: string;
  name: string;
  ratio: string;
  tasks: WbsTask[];
}

// 솔루션 모듈
export interface SolutionModule {
  id: string;
  name: string;
  role: string;
  description: string;
  coreFeatures: string[];
  mappedCategory: string;
}

// 전체 기준자료
export interface ReferenceData {
  effortBaseline: Record<string, ModuleEffort>;
  siCommon: SiItem[];
  overhead: OverheadItem[];
  adjustmentFactors: AdjustmentFactor[];
  rateCard: RateCardItem[];
  marginPolicy: MarginPolicy[];
  wbsPhases: WbsPhase[];
  wbsProjectManagement: WbsTask[];
  solutionModules: SolutionModule[];
}
