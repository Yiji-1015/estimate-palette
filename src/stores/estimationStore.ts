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

const DEFAULT_STATE_KEY = 'default';
const snapshots: Record<string, EstimationSnapshot> = {};

function cloneSnapshot(state: EstimationSnapshot): EstimationSnapshot {
  return {
    ...state,
    messages: state.messages.map((message) => ({
      ...message,
      interaction: message.interaction
        ? {
            ...message.interaction,
            data: JSON.parse(JSON.stringify(message.interaction.data)),
          }
        : undefined,
    })),
  };
}

export function saveEstimationState(state: EstimationSnapshot, key = DEFAULT_STATE_KEY) {
  snapshots[key] = cloneSnapshot(state);
}

export function loadEstimationState(key = DEFAULT_STATE_KEY): EstimationSnapshot | null {
  return snapshots[key] ? cloneSnapshot(snapshots[key]) : null;
}

export function getDefaultEstimationState(): EstimationSnapshot {
  return {
    messages: JSON.parse(JSON.stringify(mockInitialMessages)),
    currentPhase: 'mapping',
    nextMsgIdx: 0,
  };
}

export function clearEstimationState(key?: string) {
  if (!key) {
    Object.keys(snapshots).forEach((snapshotKey) => {
      delete snapshots[snapshotKey];
    });
    return;
  }
  delete snapshots[key];
}
