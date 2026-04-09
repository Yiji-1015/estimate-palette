import { useState } from 'react';
import type { WbsPhase, WbsTask } from '@/types/reference';
import { Badge } from '@/components/ui/badge';

interface WbsTabProps {
  phases: WbsPhase[];
  projectManagement: WbsTask[];
}

export function WbsTab({ phases, projectManagement }: WbsTabProps) {
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({});

  const togglePhase = (id: string) => {
    setOpenPhases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {phases.map((phase) => (
        <div key={phase.id} className="bg-card border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => togglePhase(phase.id)}
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">{phase.name}</span>
              <span className="text-sm text-muted-foreground">— {phase.ratio}</span>
            </div>
            <Badge variant="secondary" className="text-xs">{phase.tasks.length}개 작업</Badge>
          </button>
          {openPhases[phase.id] && (
            <div className="px-5 pb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground w-24">WBS ID</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">작업명</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">역할</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">산출물</th>
                  </tr>
                </thead>
                <tbody>
                  {phase.tasks.map((task) => (
                    <tr key={task.wbsId} className="border-b hover:bg-table-hover transition-colors">
                      <td className="py-2 px-3 font-mono text-primary text-sm">{task.wbsId}</td>
                      <td className="py-2 px-3 text-foreground">{task.task}</td>
                      <td className="py-2 px-3 text-muted-foreground">{task.role}</td>
                      <td className="py-2 px-3 text-muted-foreground">{task.deliverable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Project management */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-3">프로젝트 관리 (상시)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground w-24">WBS ID</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">작업명</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">역할</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">산출물</th>
            </tr>
          </thead>
          <tbody>
            {projectManagement.map((task) => (
              <tr key={task.wbsId} className="border-b hover:bg-table-hover transition-colors">
                <td className="py-2 px-3 font-mono text-primary text-sm">{task.wbsId}</td>
                <td className="py-2 px-3 text-foreground">{task.task}</td>
                <td className="py-2 px-3 text-muted-foreground">{task.role}</td>
                <td className="py-2 px-3 text-muted-foreground">{task.deliverable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
