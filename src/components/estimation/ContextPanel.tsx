import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EstimationPhase } from '@/types/estimation';
import { mockRfpAnalysis } from '@/data/mockRfpAnalysis';

interface Props {
  currentPhase: EstimationPhase;
}

const moduleInfo = [
  { id: 'DO-MINE', name: '데이터 수집·정제·구조화', desc: '크롤러, ETL, 메타데이터 자동생성' },
  { id: 'DO-SPE', name: '검색 & RAG Core Engine', desc: 'Hybrid Search, Citation, 권한 검색' },
  { id: 'DO-OCAI', name: 'Agentic AI Orchestration', desc: 'Multi-Agent Workflow, Tool 연동' },
  { id: 'DO-LOMO', name: '포털 & 모니터링', desc: 'AI 포털 UI, 관리자 대시보드' },
];

export function ContextPanel({ currentPhase }: Props) {
  return (
    <div className="w-[380px] border-l border-border bg-card flex flex-col overflow-hidden">
      <Tabs defaultValue="reference" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-2">
          <TabsTrigger value="reference" className="text-xs">참조 정보</TabsTrigger>
          <TabsTrigger value="requirements" className="text-xs">요구사항 목록</TabsTrigger>
        </TabsList>
        <TabsContent value="reference" className="flex-1 overflow-auto p-3 m-0">
          <ReferenceContent currentPhase={currentPhase} />
        </TabsContent>
        <TabsContent value="requirements" className="flex-1 overflow-auto p-3 m-0">
          <RequirementsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReferenceContent({ currentPhase }: { currentPhase: EstimationPhase }) {
  if (currentPhase === 'mapping') {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">솔루션 모듈 카탈로그</h3>
        {moduleInfo.map(m => (
          <div key={m.id} className="border border-border rounded-lg p-3">
            <div className="font-medium text-sm text-foreground">{m.id}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.desc}</div>
          </div>
        ))}
      </div>
    );
  }
  if (currentPhase === 'factors') {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">조정계수 기준표</h3>
        <p className="text-xs text-muted-foreground">각 계수는 RFP 분석 결과를 바탕으로 AI가 추천합니다. 필요 시 직접 변경 가능합니다.</p>
        <div className="border border-border rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <div>복잡도: 0.7 ~ 1.6</div>
          <div>연계: 0.8 ~ 1.6</div>
          <div>데이터: 0.8 ~ 1.5</div>
          <div>보안: 1.0 ~ 1.5</div>
          <div>비기능: 1.0 ~ 1.5</div>
          <div>일정: 0.9 ~ 1.5</div>
          <div>환경: 0.9 ~ 1.2</div>
          <div>산출물: 0.8 ~ 1.3</div>
          <div>운영전환: 1.0 ~ 1.2</div>
          <div>재사용감면: 0.6 ~ 1.0</div>
        </div>
      </div>
    );
  }
  if (currentPhase === 'effort') {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">기준공수표</h3>
        <p className="text-xs text-muted-foreground">각 모듈별 작업 유형에 따른 기준공수 (M/M) 입니다.</p>
        {moduleInfo.map(m => (
          <div key={m.id} className="border border-border rounded-lg p-2">
            <div className="font-medium text-xs text-foreground">{m.id} — {m.name}</div>
          </div>
        ))}
      </div>
    );
  }
  if (currentPhase === 'cost') {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">단가표 & 마진 정책</h3>
        <div className="border border-border rounded-lg p-3 text-xs space-y-1">
          <div className="text-foreground font-medium mb-2">역할별 월단가</div>
          <div className="text-muted-foreground">AI 개발 (고급): 1,100만원</div>
          <div className="text-muted-foreground">개발자 (고급): 900만원</div>
          <div className="text-muted-foreground">개발자 (중급): 750만원</div>
          <div className="text-muted-foreground">PM (고급): 1,000만원</div>
          <div className="text-muted-foreground">QA (중급): 700만원</div>
          <div className="text-muted-foreground">아키텍트 (고급): 1,100만원</div>
          <div className="border-t border-border my-2" />
          <div className="text-foreground font-medium">마진 정책: 목표 25%</div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">시나리오 비교</h3>
      <p className="text-xs text-muted-foreground">각 시나리오의 포함 요구사항과 비용을 비교합니다.</p>
    </div>
  );
}

function RequirementsList() {
  const reqs = mockRfpAnalysis.requirements;
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-foreground mb-2">확정 요구사항 ({reqs.length}건)</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs table-fixed">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-1.5 text-left font-medium text-muted-foreground w-[18%]">ID</th>
              <th className="px-2 py-1.5 text-left font-medium text-muted-foreground w-[42%]">원문 요약</th>
              <th className="px-2 py-1.5 text-left font-medium text-muted-foreground w-[22%]">카테고리</th>
              <th className="px-2 py-1.5 text-left font-medium text-muted-foreground w-[18%]">우선순위</th>
            </tr>
          </thead>
          <tbody>
            {reqs.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-2 py-1.5 font-mono text-muted-foreground">{r.id}</td>
                <td className="px-2 py-1.5 text-foreground truncate" title={r.originalText}>{r.originalText}</td>
                <td className="px-2 py-1.5 text-muted-foreground">{r.category}</td>
                <td className="px-2 py-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    r.priority === '필수' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                  }`}>{r.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
