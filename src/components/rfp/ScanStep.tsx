import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ScanStepProps {
  onComplete: () => void;
}

interface ScanState {
  status: 'pending' | 'scanning' | 'complete';
  frCount?: number;
  nfrCount?: number;
  conCount?: number;
  evalCount?: number;
  passCount?: number;
  failCount?: number;
}

const scanInfo = [
  { title: '1차 스캔: 전체 구조 파악', desc: '목차 구조, 페이지 수, 문서 유형, 사업 개요 위치 식별' },
  { title: '2차 스캔: 요구사항 항목별 추출', desc: 'FR/NFR/CON/EVAL 분류 및 추출' },
  { title: '3차 스캔: 교차 검증', desc: '10개 검증 항목 확인' },
];

export function ScanStep({ onComplete }: ScanStepProps) {
  const [scans, setScans] = useState<ScanState[]>([
    { status: 'pending' },
    { status: 'pending' },
    { status: 'pending' },
  ]);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    // Scan 1
    setScans(prev => [{ ...prev[0], status: 'scanning' }, prev[1], prev[2]]);

    const t1 = setTimeout(() => {
      setScans(prev => [{ ...prev[0], status: 'complete' }, { ...prev[1], status: 'scanning' }, prev[2]]);
    }, 2000);

    const t2 = setTimeout(() => {
      setScans(prev => [
        prev[0],
        { status: 'complete', frCount: 10, nfrCount: 3, conCount: 2, evalCount: 0 },
        { ...prev[2], status: 'scanning' },
      ]);
    }, 4000);

    const t3 = setTimeout(() => {
      setScans(prev => [
        prev[0],
        prev[1],
        { status: 'complete', passCount: 8, failCount: 2 },
      ]);
      setAllDone(true);
    }, 6000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-sm text-muted-foreground mb-4">AI가 업로드된 문서를 분석하고 있습니다...</p>

      {scans.map((scan, idx) => (
        <div key={idx} className={`bg-card border rounded-lg p-5 transition-all ${scan.status === 'pending' ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-3 mb-2">
            {scan.status === 'scanning' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
            {scan.status === 'complete' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {scan.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />}
            <span className="font-medium text-foreground">{scanInfo[idx].title}</span>
          </div>
          <p className="text-sm text-muted-foreground ml-8">{scanInfo[idx].desc}</p>

          {/* Scan 1 result */}
          {idx === 0 && scan.status === 'complete' && (
            <div className="mt-3 ml-8 text-sm space-y-1 text-muted-foreground">
              <p>📄 47 페이지 | 민간 요구사항서 | 6개 섹션 식별</p>
              <p>📋 사업 개요: §1 (p.3~5) | 요구사항: §3~§5 (p.12~35)</p>
            </div>
          )}

          {/* Scan 2 result */}
          {idx === 1 && scan.status === 'scanning' && (
            <div className="mt-3 ml-8">
              <p className="text-sm text-primary animate-pulse">FR 추출 중...</p>
            </div>
          )}
          {idx === 1 && scan.status === 'complete' && (
            <div className="mt-3 ml-8 flex gap-2">
              <Badge className="bg-primary/10 text-primary border-0">FR {scan.frCount}건</Badge>
              <Badge className="bg-primary/10 text-primary border-0">NFR {scan.nfrCount}건</Badge>
              <Badge className="bg-primary/10 text-primary border-0">CON {scan.conCount}건</Badge>
              <Badge variant="secondary">EVAL {scan.evalCount}건</Badge>
            </div>
          )}

          {/* Scan 3 result */}
          {idx === 2 && scan.status === 'complete' && (
            <div className="mt-3 ml-8">
              <Badge className={scan.failCount! > 0 ? 'bg-warning-dot/10 text-warning-dot border-0' : 'bg-emerald-500/10 text-emerald-600 border-0'}>
                {scan.passCount}/{(scan.passCount ?? 0) + (scan.failCount ?? 0)} 통과
                {scan.failCount! > 0 && ` · ${scan.failCount}건 미비`}
              </Badge>
            </div>
          )}
        </div>
      ))}

      {allDone && (
        <div className="pt-4">
          <Button className="w-full" size="lg" onClick={onComplete}>
            요구사항 확인 →
          </Button>
        </div>
      )}
    </div>
  );
}
