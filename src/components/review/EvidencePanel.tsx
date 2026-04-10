import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { EvidenceData, EstimateLineItem } from '@/types/review';

interface EvidencePanelProps {
  selectedItem: EstimateLineItem | null;
  evidence: EvidenceData | null;
}

const FACTOR_COLORS: Record<string, string> = {
  'DO-SPE': 'hsl(217, 91%, 60%)',
  'DO-OCAI': 'hsl(142, 71%, 45%)',
  'DO-MINE': 'hsl(25, 95%, 53%)',
  'DO-LOMO': 'hsl(262, 83%, 58%)',
  'SI-INTEGRATION': 'hsl(340, 82%, 52%)',
};

const moduleLabels: Record<string, string> = {
  'DO-SPE': 'DO-SPE',
  'DO-OCAI': 'DO-OCAI',
  'DO-MINE': 'DO-MINE',
  'DO-LOMO': 'DO-LOMO',
  'SI-INTEGRATION': 'SI',
};

interface ModuleChartProps {
  lineItems: EstimateLineItem[];
}

export function ModulePieChart({ lineItems }: ModuleChartProps) {
  const moduleEffort: Record<string, number> = {};
  lineItems.forEach(li => {
    moduleEffort[li.module] = (moduleEffort[li.module] || 0) + li.effort;
  });
  const data = Object.entries(moduleEffort).map(([name, value]) => ({
    name: moduleLabels[name] || name,
    value: Math.round(value * 10) / 10,
    color: FACTOR_COLORS[name] || 'hsl(var(--muted))',
  }));

  return (
    <div>
      <h4 className="text-sm font-medium text-foreground mb-3">모듈별 공수 비율</h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v} M/M`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.name} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EvidencePanel({ selectedItem, evidence }: EvidencePanelProps) {
  const [tab, setTab] = useState('evidence');

  if (!selectedItem || !evidence) {
    return null;
  }

  const factors = evidence.adjustmentFactors.split(' / ').map(f => {
    const parts = f.trim().split(' ');
    const name = parts[0];
    const value = parseFloat(parts[1]);
    return { name, value, isModified: value !== 1.0 };
  });

  const timeline = [
    { step: 'Step 2', desc: `RFP 원문에서 추출 (${evidence.reqId})` },
    { step: 'Step 3', desc: `${evidence.moduleMapping.split(' ')[0]} 매핑 (AI 추천, 사용자 확인)` },
    { step: 'Step 3', desc: `조정계수 적용 (${factors.filter(f => f.isModified).map(f => `${f.name} ${f.value}`).join(', ')})` },
    { step: 'Step 3', desc: `공수 확정 ${evidence.finalEffort} M/M` },
    { step: 'Step 4', desc: '현재 리뷰 중' },
  ];

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-border">
        <span className="text-xs font-medium text-primary">{selectedItem.reqId}</span>
        <h3 className="text-sm font-semibold text-foreground mt-0.5">{selectedItem.reqSummary}</h3>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-3 h-8">
          <TabsTrigger value="rfp" className="text-xs">RFP 원문</TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs">산출 근거</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">매핑 이력</TabsTrigger>
        </TabsList>

        <TabsContent value="rfp" className="mt-3 space-y-3">
          <div className="border-l-[3px] border-primary bg-muted/50 pl-3 py-2 rounded-r">
            <p className="text-sm text-foreground italic">"{evidence.originalText}"</p>
          </div>
          <div className="text-xs text-muted-foreground">출처: {evidence.source}</div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">해석된 작업 범위</h4>
            <p className="text-sm text-foreground">{evidence.interpretedScope}</p>
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="mt-3 space-y-2.5">
          {[
            { num: '①', title: '모듈 매핑', content: `${evidence.moduleMapping} — ${evidence.workType}` },
            { num: '②', title: '기준공수', content: `${evidence.workType}: ${evidence.baseEffort} M/M` },
          ].map(s => (
            <div key={s.num} className="flex gap-2.5 p-2.5 bg-card rounded-lg border border-border">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{s.num}</span>
              <div>
                <div className="text-xs font-medium text-muted-foreground">{s.title}</div>
                <div className="text-sm text-foreground">{s.content}</div>
              </div>
            </div>
          ))}

          <div className="flex gap-2.5 p-2.5 bg-card rounded-lg border border-border">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">③</span>
            <div className="flex-1">
              <div className="text-xs font-medium text-muted-foreground mb-1.5">적용 조정계수</div>
              <div className="grid grid-cols-2 gap-1">
                {factors.map(f => (
                  <span key={f.name} className={`text-xs px-1.5 py-0.5 rounded ${f.isModified ? 'bg-orange-100 text-orange-800 font-medium' : 'text-muted-foreground'}`}>
                    {f.name} × {f.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 p-2.5 bg-card rounded-lg border border-border">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">④</span>
            <div>
              <div className="text-xs font-medium text-muted-foreground">산출식</div>
              <div className="text-sm text-foreground font-mono">{evidence.adjustmentFormula}</div>
            </div>
          </div>

          <div className="flex gap-2.5 p-2.5 bg-card rounded-lg border border-border">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">⑤</span>
            <div>
              <div className="text-xs font-medium text-muted-foreground">비용</div>
              <div className="text-sm text-foreground font-semibold">{evidence.costCalculation}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-3">
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i === timeline.length - 1 ? 'bg-primary ring-2 ring-primary/30' : 'bg-muted-foreground/40'}`} />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-border min-h-[24px]" />}
                </div>
                <div className="pb-3">
                  <span className="text-[10px] font-medium text-muted-foreground">{t.step}</span>
                  <p className="text-sm text-foreground">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
