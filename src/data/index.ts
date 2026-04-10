/**
 * ============================================
 *  LLOYDK 견적 자동화 — 목업 데이터 중앙 관리
 * ============================================
 *
 * 모든 목업(Mock) 데이터는 이 파일을 통해 import 합니다.
 * 나중에 실제 API로 교체할 때 이 파일만 수정하면 됩니다.
 *
 * 사용법:
 *   import { mockReferenceData, mockRfpAnalysis } from '@/data';
 *
 * TODO: API 연동 시 각 export를 API 호출로 교체
 * ============================================
 */

// ── Step 1: 기준자료 관리 ──
export { mockReferenceData } from './mockReferenceData';

// ── Step 2: RFP 분석 ──
export { mockRfpAnalysis } from './mockRfpAnalysis';

// ── Step 3: 견적 산정 ──
export {
  mockModuleMappings,
  mockFactorSelections,
  mockEffortResult,
  mockCostResult,
  mockScenarios,
  mockInitialMessages,
  mockFollowUpMessages,
  mockEstimation,
} from './mockEstimation';

// ── Step 4: 리뷰 & 확정 ──
export {
  mockEstimateSheet,
  mockMinimalSheet,
  mockExtendedSheet,
  mockEvidenceMap,
} from './mockReview';
