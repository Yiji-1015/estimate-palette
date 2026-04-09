import type { ReferenceData } from '@/types/reference';

export const mockReferenceData: ReferenceData = {
  effortBaseline: {
    doMine: {
      name: "DO-MINE",
      description: "데이터 수집·정제·구조화 플랫폼",
      items: [
        { id: "MINE-01", task: "데이터 소스 연동 (DB/API/문서)", newBuild: 2.5, customize: 1.0, configOnly: 0.5, note: "소스당" },
        { id: "MINE-02", task: "자동 정제/전처리 파이프라인", newBuild: 3.0, customize: 1.5, configOnly: 0.5, note: "" },
        { id: "MINE-03", task: "구조화 및 메타데이터 생성", newBuild: 2.0, customize: 1.0, configOnly: 0.3, note: "" },
        { id: "MINE-04", task: "크롤러/수집기 개발", newBuild: 2.0, customize: 1.0, configOnly: 0.3, note: "대상별" },
      ],
    },
    doSpe: {
      name: "DO-SPE",
      description: "검색 및 RAG Core Engine",
      items: [
        { id: "SPE-01", task: "Hybrid Search 엔진 구축", newBuild: 3.0, customize: 1.5, configOnly: 0.5, note: "" },
        { id: "SPE-02", task: "RAG 파이프라인 구축", newBuild: 4.0, customize: 2.0, configOnly: 1.0, note: "" },
        { id: "SPE-03", task: "Semantic Search + Graph 탐색", newBuild: 3.5, customize: 2.0, configOnly: 0.5, note: "" },
        { id: "SPE-04", task: "Citation 기반 근거 검색", newBuild: 2.5, customize: 1.5, configOnly: 0.5, note: "" },
        { id: "SPE-05", task: "검색 관리자 도구", newBuild: 2.0, customize: 1.0, configOnly: 0.3, note: "동의어/불용어 등" },
        { id: "SPE-06", task: "권한 기반 검색 필터링", newBuild: 2.5, customize: 1.5, configOnly: 0.5, note: "RBAC 연동 시" },
        { id: "SPE-07", task: "검색 품질 모니터링", newBuild: 1.5, customize: 0.8, configOnly: 0.3, note: "" },
      ],
    },
    doOcai: {
      name: "DO-OCAI",
      description: "Agentic AI Orchestration 플랫폼",
      items: [
        { id: "OCAI-01", task: "대화형 챗봇 인터페이스", newBuild: 2.5, customize: 1.0, configOnly: 0.3, note: "" },
        { id: "OCAI-02", task: "Multi-Agent Workflow 설계/구현", newBuild: 5.0, customize: 2.5, configOnly: 1.0, note: "복잡도에 따라 증감" },
        { id: "OCAI-03", task: "Tool/API 연동 기반 Task 수행", newBuild: 3.0, customize: 1.5, configOnly: 0.5, note: "연동 대상별" },
        { id: "OCAI-04", task: "LangGraph 기반 오케스트레이션", newBuild: 4.0, customize: 2.0, configOnly: 1.0, note: "" },
        { id: "OCAI-05", task: "안전장치 (Guardrail/할루시네이션 검출)", newBuild: 2.0, customize: 1.0, configOnly: 0.3, note: "" },
        { id: "OCAI-06", task: "감사 로그/이력 관리", newBuild: 1.5, customize: 0.8, configOnly: 0.3, note: "" },
      ],
    },
    doLomo: {
      name: "DO-LOMO",
      description: "서비스 Application Layer",
      items: [
        { id: "LOMO-01", task: "AI 포털 사용자 UI", newBuild: 3.0, customize: 1.5, configOnly: 0.5, note: "" },
        { id: "LOMO-02", task: "관리자 화면", newBuild: 2.5, customize: 1.0, configOnly: 0.3, note: "" },
        { id: "LOMO-03", task: "인증/인가 (SSO/LDAP 연동)", newBuild: 2.0, customize: 1.0, configOnly: 0.5, note: "" },
        { id: "LOMO-04", task: "대시보드/통계", newBuild: 3.0, customize: 1.5, configOnly: 0.5, note: "" },
        { id: "LOMO-05", task: "업무 자동화 UI", newBuild: 3.0, customize: 1.5, configOnly: 0.5, note: "" },
        { id: "LOMO-06", task: "산업별 특화 서비스 UI", newBuild: 4.0, customize: 2.0, configOnly: 1.0, note: "도메인에 따라" },
      ],
    },
  },

  siCommon: [
    { id: "SI-INT", task: "외부 시스템 연계 개발", minMM: 1.0, maxMM: 3.0, note: "시스템당" },
    { id: "SI-UI", task: "커스텀 UI 개발", minMM: 1.0, maxMM: 5.0, note: "화면 수/복잡도" },
    { id: "SI-MIG", task: "데이터 마이그레이션", minMM: 1.0, maxMM: 4.0, note: "데이터 규모" },
    { id: "SI-INFRA", task: "인프라 구축/설정", minMM: 0.5, maxMM: 2.0, note: "환경 수" },
    { id: "SI-SEC", task: "보안 구축", minMM: 1.0, maxMM: 3.0, note: "보안 요건 수준" },
    { id: "SI-OPS", task: "운영 전환/안정화", minMM: 0.5, maxMM: 2.0, note: "안정화 기간" },
    { id: "SI-TRAIN", task: "교육/매뉴얼", minMM: 0.3, maxMM: 1.0, note: "인원/횟수" },
  ],

  overhead: [
    { id: "OH-PM", role: "PM", ratioMin: 10, ratioMax: 15, basis: "총 개발공수", note: "프로젝트 규모에 따라" },
    { id: "OH-QA", role: "QA", ratioMin: 10, ratioMax: 15, basis: "총 개발공수", note: "품질 요건에 따라" },
    { id: "OH-ARCH", role: "아키텍트/리뷰", ratioMin: 5, ratioMax: 10, basis: "총 개발공수", note: "기술 복잡도에 따라" },
    { id: "OH-RISK", role: "리스크 대응", ratioMin: 5, ratioMax: 10, basis: "총 공수", note: "불확실성에 따라" },
  ],

  adjustmentFactors: [
    {
      id: "complexity", name: "복잡도계수", description: "기술적 복잡도 수준",
      levels: [
        { level: "단순", value: 0.7, criteria: "표준 기능, 커스터마이징 최소" },
        { level: "보통", value: 1.0, criteria: "일반적 커스터마이징" },
        { level: "복잡", value: 1.3, criteria: "비정형 로직, 복잡한 비즈니스 규칙" },
        { level: "매우 복잡", value: 1.6, criteria: "고도 커스터마이징, 신규 알고리즘" },
      ],
    },
    {
      id: "integration", name: "연계계수", description: "외부 시스템 연계 범위",
      levels: [
        { level: "없음", value: 0.8, criteria: "독립 시스템" },
        { level: "1~2개", value: 1.0, criteria: "표준 API 연계" },
        { level: "3~5개", value: 1.3, criteria: "다중 연계, 일부 비표준" },
        { level: "6개+", value: 1.6, criteria: "대규모 연계, 레거시 포함" },
      ],
    },
    {
      id: "dataScale", name: "데이터계수", description: "처리 대상 데이터 규모",
      levels: [
        { level: "소규모", value: 0.8, criteria: "10만건 이하" },
        { level: "중규모", value: 1.0, criteria: "10만~100만건" },
        { level: "대규모", value: 1.3, criteria: "100만건+" },
        { level: "초대규모", value: 1.6, criteria: "1,000만건+, 비정형 포함" },
      ],
    },
    {
      id: "security", name: "보안계수", description: "보안 요건 수준",
      levels: [
        { level: "일반", value: 1.0, criteria: "기본 인증/인가" },
        { level: "강화", value: 1.2, criteria: "암호화, 감사 로그, RBAC" },
        { level: "고보안", value: 1.5, criteria: "망분리, ISMS" },
      ],
    },
    {
      id: "nonFunctional", name: "비기능계수", description: "성능/가용성 요건",
      levels: [
        { level: "일반", value: 1.0, criteria: "표준 SLA" },
        { level: "강화", value: 1.2, criteria: "고가용성, 성능 최적화" },
        { level: "미션크리티컬", value: 1.5, criteria: "이중화, 무중단" },
      ],
    },
    {
      id: "schedule", name: "일정계수", description: "일정 압축 수준",
      levels: [
        { level: "여유", value: 0.9, criteria: "표준 대비 120%+" },
        { level: "표준", value: 1.0, criteria: "통상적 일정" },
        { level: "압축", value: 1.3, criteria: "표준 대비 80% 이하" },
        { level: "과도 압축", value: 1.6, criteria: "표준 대비 60% 이하 ⚠️" },
      ],
    },
    {
      id: "environment", name: "환경계수", description: "구축/운영 환경",
      levels: [
        { level: "클라우드", value: 0.9, criteria: "퍼블릭 클라우드" },
        { level: "온프레미스", value: 1.0, criteria: "일반 온프레미스" },
        { level: "폐쇄망", value: 1.3, criteria: "망분리" },
        { level: "특수 환경", value: 1.5, criteria: "보안 시설 등" },
      ],
    },
    {
      id: "deliverables", name: "산출물계수", description: "산출물 범위",
      levels: [
        { level: "최소", value: 0.9, criteria: "민간, 산출물 최소" },
        { level: "표준", value: 1.0, criteria: "일반적 수준" },
        { level: "공공 표준", value: 1.2, criteria: "공공 필수 산출물 전체" },
        { level: "공공 강화", value: 1.4, criteria: "감리 대비" },
      ],
    },
    {
      id: "operationTransfer", name: "운영전환계수", description: "운영 전환/안정화",
      levels: [
        { level: "미포함", value: 0.9, criteria: "운영 전환 별도" },
        { level: "기본", value: 1.0, criteria: "기본 이관, 매뉴얼" },
        { level: "포함", value: 1.2, criteria: "교육, 안정화 포함" },
        { level: "강화", value: 1.4, criteria: "장기 안정화, 상주 지원" },
      ],
    },
    {
      id: "reuse", name: "재사용감면계수", description: "기존 자산 재사용",
      levels: [
        { level: "신규", value: 1.0, criteria: "재사용 없음" },
        { level: "일부", value: 0.8, criteria: "30% 이하 재사용" },
        { level: "상당", value: 0.6, criteria: "30~60% 재사용" },
        { level: "대부분", value: 0.4, criteria: "60%+ (설정 위주)" },
      ],
    },
  ],

  rateCard: [
    { id: "RC-01", role: "PM", grade: "특급", rate: 1200 },
    { id: "RC-02", role: "PM", grade: "고급", rate: 1000 },
    { id: "RC-03", role: "PL", grade: "고급", rate: 1000 },
    { id: "RC-04", role: "PL", grade: "중급", rate: 850 },
    { id: "RC-05", role: "아키텍트", grade: "특급", rate: 1300 },
    { id: "RC-06", role: "아키텍트", grade: "고급", rate: 1100 },
    { id: "RC-07", role: "개발자", grade: "고급", rate: 900 },
    { id: "RC-08", role: "개발자", grade: "중급", rate: 750 },
    { id: "RC-09", role: "개발자", grade: "초급", rate: 600 },
    { id: "RC-10", role: "AI 개발자", grade: "고급", rate: 1100 },
    { id: "RC-11", role: "AI 개발자", grade: "중급", rate: 900 },
    { id: "RC-12", role: "QA", grade: "중급", rate: 700 },
    { id: "RC-13", role: "QA", grade: "초급", rate: 550 },
    { id: "RC-14", role: "디자이너", grade: "중급", rate: 700 },
    { id: "RC-15", role: "DBA", grade: "고급", rate: 900 },
    { id: "RC-16", role: "인프라", grade: "고급", rate: 900 },
    { id: "RC-17", role: "보안", grade: "고급", rate: 1000 },
  ],

  marginPolicy: [
    { type: "민간 SI", targetMargin: "20~30%", minMargin: "15%", note: "하한 미만 시 승인 필수" },
    { type: "공공 SI", targetMargin: "10~20%", minMargin: "8%", note: "예정가격 제약" },
    { type: "라이선스", targetMargin: "40~60%", minMargin: "30%", note: "제품 판매" },
    { type: "유지보수", targetMargin: "25~35%", minMargin: "20%", note: "연간 계약" },
    { type: "전략 사업", targetMargin: "0~10%", minMargin: "-5%", note: "레퍼런스 확보, 승인 필수" },
  ],

  wbsPhases: [
    {
      id: "P1", name: "분석/설계", ratio: "약 20~25%",
      tasks: [
        { wbsId: "P1-01", task: "요구사항 분석", role: "PL/BA", deliverable: "요구사항 정의서" },
        { wbsId: "P1-02", task: "AS-IS 분석", role: "BA/개발", deliverable: "현행 시스템 분석서" },
        { wbsId: "P1-03", task: "TO-BE 설계", role: "PL/아키텍트", deliverable: "시스템 아키텍처 설계서" },
        { wbsId: "P1-04", task: "UI/UX 설계", role: "디자이너/PL", deliverable: "화면 설계서" },
        { wbsId: "P1-05", task: "데이터 모델 설계", role: "아키텍트/개발", deliverable: "ERD, 데이터 사전" },
        { wbsId: "P1-06", task: "연계 설계", role: "아키텍트/개발", deliverable: "인터페이스 설계서" },
        { wbsId: "P1-07", task: "보안 설계", role: "보안/아키텍트", deliverable: "보안 설계서" },
      ],
    },
    {
      id: "P2", name: "개발", ratio: "약 40~50%",
      tasks: [
        { wbsId: "P2-01", task: "백엔드 개발", role: "개발", deliverable: "소스코드, 단위테스트" },
        { wbsId: "P2-02", task: "프론트엔드 개발", role: "개발", deliverable: "소스코드, 단위테스트" },
        { wbsId: "P2-03", task: "AI/ML 모델 개발", role: "AI개발", deliverable: "모델, 파이프라인" },
        { wbsId: "P2-04", task: "데이터 파이프라인", role: "개발", deliverable: "ETL 코드" },
        { wbsId: "P2-05", task: "연계 개발", role: "개발", deliverable: "API 연동 코드" },
        { wbsId: "P2-06", task: "관리자 기능", role: "개발", deliverable: "관리 화면" },
      ],
    },
    {
      id: "P3", name: "테스트", ratio: "약 15~20%",
      tasks: [
        { wbsId: "P3-01", task: "통합 테스트", role: "QA", deliverable: "테스트 결과서" },
        { wbsId: "P3-02", task: "성능 테스트", role: "QA/인프라", deliverable: "성능 테스트 결과서" },
        { wbsId: "P3-03", task: "보안 테스트", role: "보안/QA", deliverable: "보안 점검 결과서" },
        { wbsId: "P3-04", task: "UAT", role: "QA/고객", deliverable: "UAT 결과서" },
        { wbsId: "P3-05", task: "결함 수정", role: "개발", deliverable: "결함 조치 보고서" },
      ],
    },
    {
      id: "P4", name: "이관/안정화", ratio: "약 10~15%",
      tasks: [
        { wbsId: "P4-01", task: "운영 환경 구축", role: "인프라", deliverable: "인프라 구성서" },
        { wbsId: "P4-02", task: "데이터 마이그레이션", role: "개발/DBA", deliverable: "마이그레이션 결과서" },
        { wbsId: "P4-03", task: "운영 매뉴얼", role: "PL/개발", deliverable: "운영 매뉴얼" },
        { wbsId: "P4-04", task: "사용자 교육", role: "PL", deliverable: "교육 자료" },
        { wbsId: "P4-05", task: "안정화 지원", role: "개발/운영", deliverable: "안정화 보고서" },
      ],
    },
  ],

  wbsProjectManagement: [
    { wbsId: "PM-01", task: "프로젝트 계획 수립", role: "PM", deliverable: "프로젝트 계획서" },
    { wbsId: "PM-02", task: "진척 관리/보고", role: "PM", deliverable: "주간/월간 보고서" },
    { wbsId: "PM-03", task: "이슈/리스크 관리", role: "PM", deliverable: "이슈/리스크 대장" },
    { wbsId: "PM-04", task: "품질 관리", role: "QA/PM", deliverable: "품질 관리 계획서" },
    { wbsId: "PM-05", task: "형상/변경 관리", role: "PM", deliverable: "변경 관리 대장" },
  ],

  solutionModules: [
    {
      id: "DO-MINE", name: "DO-MINE", role: "Data Mining & Ingestion",
      description: "데이터 수집·정제·구조화 플랫폼",
      coreFeatures: ["데이터 소스 통합", "자동 정제/전처리", "구조화/메타데이터 생성"],
      mappedCategory: "FR-DATA",
    },
    {
      id: "DO-SPE", name: "DO-SPE", role: "검색 및 Retrieval 엔진",
      description: "검색 및 RAG Core Engine",
      coreFeatures: ["Hybrid Search", "Semantic Search + Graph", "Citation 근거 검색"],
      mappedCategory: "FR-SEARCH",
    },
    {
      id: "DO-OCAI", name: "DO-OCAI", role: "Agentic AI Orchestration",
      description: "Agentic AI Orchestration 플랫폼",
      coreFeatures: ["Multi-Agent Workflow", "Tool/API 연동", "LangGraph 오케스트레이션"],
      mappedCategory: "FR-AGENT",
    },
    {
      id: "DO-LOMO", name: "DO-LOMO", role: "서비스 Application Layer",
      description: "서비스 Application Layer",
      coreFeatures: ["AI 포털 UI", "업무 자동화 UI", "산업별 특화 서비스"],
      mappedCategory: "FR-PORTAL, FR-ADMIN",
    },
  ],
};
