/**
 * RFP 문서 정보 전역 상태
 * 
 * Step 2에서 업로드/분석 시작하면 저장되고,
 * Step 3, Step 4에서도 사이드바에 동일하게 표시됩니다.
 * 
 * TODO: 백엔드 연동 시 API 상태와 동기화
 */

import type { RfpDocInfo } from '@/components/AppSidebar';

const rfpDocsByKey = new Map<string, RfpDocInfo>();

export function setRfpDoc(doc: RfpDocInfo | null, key = 'default') {
  if (!doc) {
    rfpDocsByKey.delete(key);
    return;
  }
  rfpDocsByKey.set(key, doc);
}

export function getRfpDoc(key = 'default'): RfpDocInfo | null {
  return rfpDocsByKey.get(key) ?? null;
}
