// 채팅 메시지
export type MessageRole = 'system' | 'assistant' | 'user';
export type InteractionType = 'text' | 'module-mapping' | 'factor-select' | 'effort-confirm' | 'cost-summary' | 'scenario-select';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  interaction?: InteractionBlock;
}

export interface InteractionBlock {
  type: InteractionType;
  data: ModuleMappingData | FactorSelectData | EffortConfirmData | CostSummaryData | ScenarioSelectData;
  confirmed: boolean;
}

export interface ModuleMappingItem {
  reqId: string;
  reqSummary: string;
  suggestedModule: string;
  workType: '신규 구축' | '커스터마이징' | '설정/연동만';
  
  userOverride?: string;
  userWorkTypeOverride?: string;
}

export interface ModuleMappingData {
  items: ModuleMappingItem[];
}

export interface FactorSelection {
  factorId: string;
  factorName: string;
  selectedLevel: string;
  selectedValue: number;
  aiSuggested: string;
  aiReason: string;
}

export interface FactorSelectData {
  factors: FactorSelection[];
}

export interface EffortLineItem {
  reqId: string;
  reqSummary: string;
  module: string;
  workType: string;
  baseEffort: number;
  adjustedEffort: number;
  adjustmentDetail: string;
  status: '확정' | '추정';
  editable: boolean;
}

export interface EffortConfirmData {
  lineItems: EffortLineItem[];
  subtotalDev: number;
  pmOverhead: number;
  qaOverhead: number;
  archOverhead: number;
  riskOverhead: number;
  totalMM: number;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  detail: string;
}

export interface CostSummaryData {
  costItems: CostBreakdown[];
  totalCost: number;
  targetMargin: number;
  proposalPrice: number;
  budgetRange: string;
  budgetFit: 'within' | 'over' | 'under';
}

export interface ScenarioOption {
  id: string;
  name: string;
  description: string;
  includedReqs: string[];
  totalMM: number;
  totalCost: number;
  proposalPrice: number;
  tag?: string;
}

export interface ScenarioSelectData {
  scenarios: ScenarioOption[];
  selectedId?: string;
}

export type EstimationPhase = 'mapping' | 'factors' | 'effort' | 'cost' | 'scenario' | 'complete';

export interface EstimationState {
  currentPhase: EstimationPhase;
  messages: ChatMessage[];
  moduleMappings?: ModuleMappingData;
  factorSelections?: FactorSelectData;
  effortResult?: EffortConfirmData;
  costResult?: CostSummaryData;
  scenarios?: ScenarioSelectData;
}
