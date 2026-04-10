import type {
  EstimationState,
  ModuleMappingData,
  FactorSelectData,
  EffortConfirmData,
  CostSummaryData,
  ScenarioSelectData,
  ChatMessage,
} from '@/types/estimation';

export const mockModuleMappings: ModuleMappingData = {
  items: [
    { reqId: "FR-001", reqSummary: "RAG 검색 품질 개선 + Hybrid Search", suggestedModule: "DO-SPE", workType: "커스터마이징" },
    { reqId: "FR-002", reqSummary: "다양한 데이터 소스 통합 인덱싱", suggestedModule: "DO-MINE", workType: "신규 구축" },
    { reqId: "FR-003", reqSummary: "Citation 기반 근거 검색", suggestedModule: "DO-SPE", workType: "커스터마이징" },
    { reqId: "FR-004", reqSummary: "역할별 문서 접근 권한 검색 반영", suggestedModule: "DO-SPE", workType: "커스터마이징" },
    { reqId: "FR-005", reqSummary: "AI Agent 업무 자동화 워크플로", suggestedModule: "DO-OCAI", workType: "신규 구축" },
    { reqId: "FR-006", reqSummary: "사내 시스템(ERP, JIRA) 연동 액션", suggestedModule: "DO-OCAI", workType: "신규 구축" },
    { reqId: "FR-007", reqSummary: "AI 서비스 포털 구축", suggestedModule: "DO-LOMO", workType: "신규 구축" },
    { reqId: "FR-008", reqSummary: "관리자 모니터링 대시보드", suggestedModule: "DO-LOMO", workType: "커스터마이징" },
    { reqId: "FR-009", reqSummary: "AI Guardrail 적용", suggestedModule: "DO-OCAI", workType: "커스터마이징" },
    { reqId: "FR-010", reqSummary: "기존 데이터 마이그레이션", suggestedModule: "SI-INTEGRATION", workType: "신규 구축" },
  ],
};

export const mockFactorSelections: FactorSelectData = {
  factors: [
    { factorId: "complexity", factorName: "복잡도계수", selectedLevel: "복잡", selectedValue: 1.3, aiSuggested: "복잡", aiReason: "Agentic AI + 멀티에이전트 워크플로 포함, 비정형 로직 다수" },
    { factorId: "integration", factorName: "연계계수", selectedLevel: "3~5개", selectedValue: 1.3, aiSuggested: "3~5개", aiReason: "ERP, JIRA, SSO 등 3개 이상 외부 시스템 연계" },
    { factorId: "dataScale", factorName: "데이터계수", selectedLevel: "중규모", selectedValue: 1.0, aiSuggested: "중규모", aiReason: "기술 문서/매뉴얼/FAQ — 중규모 추정 (규모 미명시)" },
    { factorId: "security", factorName: "보안계수", selectedLevel: "강화", selectedValue: 1.2, aiSuggested: "강화", aiReason: "RBAC + 데이터 암호화 + 감사 로그 요구" },
    { factorId: "nonFunctional", factorName: "비기능계수", selectedLevel: "강화", selectedValue: 1.2, aiSuggested: "강화", aiReason: "가용성 99.5% + 응답시간 3초 이내 요구" },
    { factorId: "schedule", factorName: "일정계수", selectedLevel: "표준", selectedValue: 1.0, aiSuggested: "표준", aiReason: "7개월 — 사업 규모 대비 통상적 일정" },
    { factorId: "environment", factorName: "환경계수", selectedLevel: "온프레미스", selectedValue: 1.0, aiSuggested: "온프레미스", aiReason: "삼성 사내 클라우드 (온프레미스 유사 환경)" },
    { factorId: "deliverables", factorName: "산출물계수", selectedLevel: "표준", selectedValue: 1.0, aiSuggested: "표준", aiReason: "민간 사업 — 표준 산출물 수준" },
    { factorId: "operationTransfer", factorName: "운영전환계수", selectedLevel: "포함", selectedValue: 1.2, aiSuggested: "포함", aiReason: "교육 및 안정화 기간 포함 예상" },
    { factorId: "reuse", factorName: "재사용감면계수", selectedLevel: "일부", selectedValue: 0.8, aiSuggested: "일부", aiReason: "기존 DS Assistant 자산 일부 활용 가능" },
  ],
};

export const mockEffortResult: EffortConfirmData = {
  lineItems: [
    { reqId: "FR-001", reqSummary: "Hybrid Search 고도화", module: "DO-SPE", workType: "커스터마이징", baseEffort: 1.5, adjustedEffort: 2.3, adjustmentDetail: "1.5 × 복잡1.3 × 재사용0.8 × 운영1.2 = 1.87 → 반올림 2.3 (보안·비기능 반영)", status: "추정", editable: true },
    { reqId: "FR-002", reqSummary: "데이터 소스 통합 인덱싱", module: "DO-MINE", workType: "신규 구축", baseEffort: 2.5, adjustedEffort: 3.1, adjustmentDetail: "2.5 × 복잡1.3 × 재사용0.8 × 운영1.2 = 3.12", status: "추정", editable: true },
    { reqId: "FR-003", reqSummary: "Citation 근거 검색", module: "DO-SPE", workType: "커스터마이징", baseEffort: 1.5, adjustedEffort: 2.3, adjustmentDetail: "1.5 × 1.3 × 0.8 × 1.2 = 1.87 → 2.3", status: "추정", editable: true },
    { reqId: "FR-004", reqSummary: "권한 기반 검색 필터링", module: "DO-SPE", workType: "커스터마이징", baseEffort: 1.5, adjustedEffort: 2.8, adjustmentDetail: "1.5 × 1.3 × 보안1.2 × 연계1.3 × 0.8 × 1.2 = 2.83", status: "추정", editable: true },
    { reqId: "FR-005", reqSummary: "Multi-Agent Workflow", module: "DO-OCAI", workType: "신규 구축", baseEffort: 5.0, adjustedEffort: 7.5, adjustmentDetail: "5.0 × 1.3 × 연계1.3 × 0.8 × 1.2 = 8.11 → 조정 7.5", status: "추정", editable: true },
    { reqId: "FR-006", reqSummary: "ERP/JIRA 연동 액션", module: "DO-OCAI", workType: "신규 구축", baseEffort: 3.0, adjustedEffort: 4.7, adjustmentDetail: "3.0 × 1.3 × 연계1.3 × 0.8 × 1.2 = 4.87", status: "추정", editable: true },
    { reqId: "FR-007", reqSummary: "AI 서비스 포털 UI", module: "DO-LOMO", workType: "신규 구축", baseEffort: 3.0, adjustedEffort: 3.7, adjustmentDetail: "3.0 × 1.3 × 0.8 × 1.2 = 3.74", status: "추정", editable: true },
    { reqId: "FR-008", reqSummary: "관리자 대시보드", module: "DO-LOMO", workType: "커스터마이징", baseEffort: 1.5, adjustedEffort: 2.3, adjustmentDetail: "1.5 × 1.3 × 0.8 × 1.2 = 1.87 → 2.3", status: "추정", editable: true },
    { reqId: "FR-009", reqSummary: "AI Guardrail", module: "DO-OCAI", workType: "커스터마이징", baseEffort: 1.0, adjustedEffort: 1.5, adjustmentDetail: "1.0 × 1.3 × 0.8 × 1.2 = 1.25 → 1.5", status: "추정", editable: true },
    { reqId: "FR-010", reqSummary: "데이터 마이그레이션", module: "SI-INTEGRATION", workType: "신규 구축", baseEffort: 2.5, adjustedEffort: 3.0, adjustmentDetail: "2.5 × 1.0 × 0.8 × 1.2 = 2.4 → 3.0 (검증 공수 포함)", status: "추정", editable: true },
  ],
  subtotalDev: 33.2,
  pmOverhead: 4.0,
  qaOverhead: 4.0,
  archOverhead: 2.7,
  riskOverhead: 3.5,
  totalMM: 47.4,
};

export const mockCostResult: CostSummaryData = {
  costItems: [
    { category: "AI 개발 (고급)", amount: 13200, detail: "12.0 M/M × 1,100만원" },
    { category: "개발자 (중급)", amount: 10500, detail: "14.0 M/M × 750만원" },
    { category: "개발자 (고급)", amount: 6480, detail: "7.2 M/M × 900만원" },
    { category: "PM (고급)", amount: 4000, detail: "4.0 M/M × 1,000만원" },
    { category: "QA (중급)", amount: 2800, detail: "4.0 M/M × 700만원" },
    { category: "아키텍트 (고급)", amount: 2970, detail: "2.7 M/M × 1,100만원" },
    { category: "리스크 대응", amount: 2800, detail: "3.5 M/M × 800만원 (평균단가)" },
    { category: "인프라/환경 구축", amount: 1500, detail: "별도 산정" },
  ],
  totalCost: 44250,
  targetMargin: 25,
  proposalPrice: 55300,
  budgetRange: "18,000~20,000만원",
  budgetFit: "within",
};

export const mockScenarios: ScenarioSelectData = {
  scenarios: [
    {
      id: "minimal",
      name: "필수충족안",
      description: "필수 요구사항만 포함. RAG 고도화 + 기본 에이전트 + 포털 UI",
      includedReqs: ["FR-001", "FR-002", "FR-003", "FR-005", "FR-007", "FR-009", "FR-010"],
      totalMM: 35.2,
      totalCost: 33100,
      proposalPrice: 41400,
      tag: "최소",
    },
    {
      id: "recommended",
      name: "권장안",
      description: "필수 + 권장 항목. 권한 검색 + 관리자 대시보드 + 시스템 연동 포함",
      includedReqs: ["FR-001", "FR-002", "FR-003", "FR-004", "FR-005", "FR-006", "FR-007", "FR-008", "FR-009", "FR-010"],
      totalMM: 47.4,
      totalCost: 44250,
      proposalPrice: 55300,
      tag: "추천",
    },
    {
      id: "extended",
      name: "확장안",
      description: "전체 범위 + 검색 품질 모니터링 + 고급 분석 대시보드 + 추가 워크플로 3종",
      includedReqs: ["FR-001", "FR-002", "FR-003", "FR-004", "FR-005", "FR-006", "FR-007", "FR-008", "FR-009", "FR-010", "추가"],
      totalMM: 58.6,
      totalCost: 54800,
      proposalPrice: 68500,
      tag: "풀패키지",
    },
  ],
};

export const mockInitialMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Step 2에서 확정된 요구사항 10건을 분석하여 DO 솔루션 모듈에 매핑했습니다.\n아래 매핑 결과를 확인하고, 필요하면 수정해 주세요.",
    timestamp: new Date().toISOString(),
    interaction: {
      type: "module-mapping",
      data: mockModuleMappings,
      confirmed: false,
    },
  },
];

export const mockFollowUpMessages: ChatMessage[] = [
  {
    id: "msg-2",
    role: "assistant",
    content: "솔루션 매핑이 확정되었습니다 ✅\n다음으로, RFP 분석 결과를 바탕으로 조정계수를 추천합니다.\n각 계수의 추천 근거를 확인하고 필요하면 변경해 주세요.",
    timestamp: new Date().toISOString(),
    interaction: {
      type: "factor-select",
      data: mockFactorSelections,
      confirmed: false,
    },
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "조정계수가 확정되었습니다 ✅\n기준공수표 × 조정계수를 적용하여 요구사항별 공수를 산출했습니다.\n※ 본 공수는 기준공수표 기반 초안이며, 검토·조정이 필요합니다.",
    timestamp: new Date().toISOString(),
    interaction: {
      type: "effort-confirm",
      data: mockEffortResult,
      confirmed: false,
    },
  },
  {
    id: "msg-4",
    role: "assistant",
    content: "공수가 확정되었습니다 ✅ 총 47.4 M/M\n역할별 단가를 적용하여 비용을 산출합니다.",
    timestamp: new Date().toISOString(),
    interaction: {
      type: "cost-summary",
      data: mockCostResult,
      confirmed: false,
    },
  },
  {
    id: "msg-5",
    role: "assistant",
    content: "비용 산출이 완료되었습니다 ✅\n3가지 시나리오를 생성했습니다. 제안 전략에 맞는 시나리오를 선택해 주세요.",
    timestamp: new Date().toISOString(),
    interaction: {
      type: "scenario-select",
      data: mockScenarios,
      confirmed: false,
    },
  },
];

export const mockEstimation: EstimationState = {
  currentPhase: "mapping",
  messages: mockInitialMessages,
  moduleMappings: mockModuleMappings,
  factorSelections: mockFactorSelections,
  effortResult: mockEffortResult,
  costResult: mockCostResult,
  scenarios: mockScenarios,
};
