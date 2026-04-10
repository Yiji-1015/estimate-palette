/**
 * 견적 산정 채팅 상태 저장소
 * 
 * 모듈 레벨 변수로 관리하여 페이지 이동 후 돌아와도 상태가 유지됩니다.
 * React 컴포넌트가 언마운트되어도 데이터가 사라지지 않습니다.
 * 
 * TODO: 나중에 백엔드 연동 시 API 상태와 동기화
 */

import type { ChatMessage, EstimationPhase } from '@/types/estimation';
import { mockInitialMessages } from '@/data';

interface EstimationSnapshot {
  messages: ChatMessage[];
  currentPhase: EstimationPhase;
  nextMsgIdx: number;
}

let snapshot: EstimationSnapshot | null = null;

export function saveEstimationState(state: EstimationSnapshot) {
  snapshot = { ...state };
}

export function loadEstimationState(): EstimationSnapshot | null {
  return snapshot;
}

export function getDefaultEstimationState(): EstimationSnapshot {
  return {
    messages: mockInitialMessages,
    currentPhase: 'mapping',
    nextMsgIdx: 0,
  };
}

export function clearEstimationState() {
  snapshot = null;
}
