export interface EstimateLineItem {
  id: string;
  reqId: string;
  reqSummary: string;
  module: string;
  workType: string;
  effort: number;
  role: string;
  grade: string;
  unitCost: number;
  cost: number;
  source: string;
  adjustmentDetail: string;
  status: '확정' | '추정';
}

export interface OverheadCostItem {
  role: string;
  effort: number;
  unitCost: number;
  cost: number;
}

export interface PhaseSchedule {
  phase: string;
  ratio: string;
  startMonth: number;
  endMonth: number;
}

export interface RiskItem {
  id: string;
  description: string;
  impact: '상' | '중' | '하';
  mitigation: string;
}

export interface EstimateSheet {
  projectName: string;
  client: string;
  scenarioName: string;
  scenarioTag: string;
  createdAt: string;
  version: string;
  lineItems: EstimateLineItem[];
  subtotalDev: number;
  overheadItems: OverheadCostItem[];
  totalCost: number;
  marginRate: number;
  proposalPrice: number;
  duration: string;
  phases: PhaseSchedule[];
  assumptions: string[];
  exclusions: string[];
  risks: RiskItem[];
  validUntil: string;
}

export interface EvidenceData {
  reqId: string;
  originalText: string;
  source: string;
  interpretedScope: string;
  moduleMapping: string;
  workType: string;
  baseEffort: number;
  adjustmentFactors: string;
  adjustmentFormula: string;
  finalEffort: number;
  costCalculation: string;
}

export interface ReviewState {
  sheet: EstimateSheet;
  evidenceMap: Record<string, EvidenceData>;
  selectedItemId: string | null;
  isConfirmed: boolean;
}
