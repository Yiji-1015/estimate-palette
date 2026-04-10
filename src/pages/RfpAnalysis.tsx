import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { UploadStep } from '@/components/rfp/UploadStep';
import { ScanStep } from '@/components/rfp/ScanStep';
import { RequirementsStep } from '@/components/rfp/RequirementsStep';
import { mockRfpAnalysis } from '@/data/mockRfpAnalysis';
import type { RfpAnalysisData } from '@/types/rfpAnalysis';
import type { RfpDocInfo } from '@/components/AppSidebar';
import { Check } from 'lucide-react';

// TODO: API 연동 시 아래로 교체
// const { data } = await fetch('/api/rfp-analysis/${id}').then(r => r.json());

const subSteps = ['문서 업로드', 'AI 분석', '요구사항 확인'];

export default function RfpAnalysis() {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [analysisData, setAnalysisData] = useState<RfpAnalysisData>(() =>
    JSON.parse(JSON.stringify(mockRfpAnalysis))
  );
  const handleStartAnalysis = (
    file: { name: string; size: number; type: string },
    docType: RfpAnalysisData['meta']['docType']
  ) => {
    setAnalysisData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        fileName: file.name,
        docType,
        analyzedAt: new Date().toISOString(),
      },
    }));
    setCurrentSubStep(1);
  };

  const rfpDoc = useMemo<RfpDocInfo | null>(() => {
    if (currentSubStep === 0) return null;
    const statusMap: Record<number, RfpDocInfo['status']> = {
      1: '분석 중',
      2: '분석 완료',
    };
    return {
      fileName: analysisData.meta.fileName,
      client: analysisData.projectInfo.client,
      docType: analysisData.meta.docType,
      status: statusMap[currentSubStep] ?? '업로드 전',
    };
  }, [currentSubStep, analysisData]);

  return (
    <AppLayout currentStep={2} rfpDoc={rfpDoc}>
      <div className="flex flex-col h-screen">
        {/* Header with sub-step indicator */}
        <div className="px-8 pt-6 pb-6 border-b bg-card">
          <h1 className="text-2xl font-bold text-foreground mb-1">RFP 분석</h1>
          <p className="text-sm text-muted-foreground mb-5">
            RFP 문서를 업로드하고 AI가 요구사항을 분석합니다.
          </p>

          {/* Sub-step indicator */}
          <div className="flex items-center justify-center gap-2">
            {subSteps.map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      idx < currentSubStep
                        ? 'bg-emerald-500 text-primary-foreground'
                        : idx === currentSubStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {idx < currentSubStep ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      idx === currentSubStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < subSteps.length - 1 && (
                  <div className={`w-12 h-px mx-3 ${idx < currentSubStep ? 'bg-emerald-500' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {currentSubStep === 0 && (
            <UploadStep
              onStartAnalysis={handleStartAnalysis}
            />
          )}
          {currentSubStep === 1 && (
            <ScanStep onComplete={() => setCurrentSubStep(2)} />
          )}
          {currentSubStep === 2 && (
            <RequirementsStep data={analysisData} onChange={setAnalysisData} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
