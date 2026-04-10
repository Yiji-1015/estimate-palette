import { useState } from 'react';
import type { WbsPhase, WbsTask } from '@/types/reference';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditableTextCell } from './EffortBaselineTab';
import { Plus, Trash2 } from 'lucide-react';

interface WbsTabProps {
  phases: WbsPhase[];
  projectManagement: WbsTask[];
  onPhasesChange: (phases: WbsPhase[]) => void;
  onProjectManagementChange: (tasks: WbsTask[]) => void;
}

export function WbsTab({
  phases,
  projectManagement,
  onPhasesChange,
  onProjectManagementChange,
}: WbsTabProps) {
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({});

  const togglePhase = (id: string) => {
    setOpenPhases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updatePhaseTask = (phaseId: string, taskId: string, patch: Partial<WbsTask>) => {
    const updatedPhases = phases.map((phase) => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map((task) => (task.wbsId === taskId ? { ...task, ...patch } : task)),
      };
    });
    onPhasesChange(updatedPhases);
  };

  const deletePhaseTask = (phaseId: string, taskId: string) => {
    const updatedPhases = phases.map((phase) => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        tasks: phase.tasks.filter((task) => task.wbsId !== taskId),
      };
    });
    onPhasesChange(updatedPhases);
  };

  const addPhaseTask = (phaseId: string) => {
    const updatedPhases = phases.map((phase) => {
      if (phase.id !== phaseId) return phase;
      const next = phase.tasks.length + 1;
      const newTask: WbsTask = {
        wbsId: `${phase.id}-${String(next).padStart(2, '0')}`,
        task: '신규 작업',
        role: '',
        deliverable: '',
      };
      return {
        ...phase,
        tasks: [...phase.tasks, newTask],
      };
    });
    onPhasesChange(updatedPhases);
  };

  const updateProjectManagementTask = (taskId: string, patch: Partial<WbsTask>) => {
    onProjectManagementChange(
      projectManagement.map((task) => (task.wbsId === taskId ? { ...task, ...patch } : task))
    );
  };

  const deleteProjectManagementTask = (taskId: string) => {
    onProjectManagementChange(projectManagement.filter((task) => task.wbsId !== taskId));
  };

  const addProjectManagementTask = () => {
    const next = projectManagement.length + 1;
    const newTask: WbsTask = {
      wbsId: `PM-${String(next).padStart(2, '0')}`,
      task: '신규 작업',
      role: 'PM',
      deliverable: '',
    };
    onProjectManagementChange([...projectManagement, newTask]);
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
              <span className="text-sm text-muted-foreground">비중 {phase.ratio}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {phase.tasks.length}개 작업
            </Badge>
          </button>
          {openPhases[phase.id] && (
            <div className="px-5 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-sm table-auto">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground w-28">WBS ID</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">작업명</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground w-36">역할</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">산출물</th>
                      <th className="text-center py-2 px-3 font-medium text-muted-foreground w-14">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phase.tasks.map((task) => (
                      <tr key={task.wbsId} className="border-b hover:bg-table-hover transition-colors group">
                        <td className="py-2 px-3 font-mono text-primary text-sm">
                          <EditableTextCell
                            value={task.wbsId}
                            onChange={(v) => updatePhaseTask(phase.id, task.wbsId, { wbsId: v })}
                          />
                        </td>
                        <td className="py-2 px-3 text-foreground">
                          <EditableTextCell
                            value={task.task}
                            onChange={(v) => updatePhaseTask(phase.id, task.wbsId, { task: v })}
                          />
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">
                          <EditableTextCell
                            value={task.role}
                            onChange={(v) => updatePhaseTask(phase.id, task.wbsId, { role: v })}
                          />
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">
                          <EditableTextCell
                            value={task.deliverable}
                            onChange={(v) => updatePhaseTask(phase.id, task.wbsId, { deliverable: v })}
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            className="opacity-60 hover:opacity-100 transition-opacity text-destructive"
                            onClick={() => deletePhaseTask(phase.id, task.wbsId)}
                            aria-label="WBS 작업 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={() => addPhaseTask(phase.id)}>
                <Plus className="w-4 h-4 mr-1" /> 작업 추가
              </Button>
            </div>
          )}
        </div>
      ))}

      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-3">프로젝트 관리(상시)</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm table-auto">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground w-28">WBS ID</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">작업명</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground w-36">역할</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">산출물</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground w-14">관리</th>
              </tr>
            </thead>
            <tbody>
              {projectManagement.map((task) => (
                <tr key={task.wbsId} className="border-b hover:bg-table-hover transition-colors group">
                  <td className="py-2 px-3 font-mono text-primary text-sm">
                    <EditableTextCell
                      value={task.wbsId}
                      onChange={(v) => updateProjectManagementTask(task.wbsId, { wbsId: v })}
                    />
                  </td>
                  <td className="py-2 px-3 text-foreground">
                    <EditableTextCell
                      value={task.task}
                      onChange={(v) => updateProjectManagementTask(task.wbsId, { task: v })}
                    />
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">
                    <EditableTextCell
                      value={task.role}
                      onChange={(v) => updateProjectManagementTask(task.wbsId, { role: v })}
                    />
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">
                    <EditableTextCell
                      value={task.deliverable}
                      onChange={(v) => updateProjectManagementTask(task.wbsId, { deliverable: v })}
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      className="opacity-60 hover:opacity-100 transition-opacity text-destructive"
                      onClick={() => deleteProjectManagementTask(task.wbsId)}
                      aria-label="프로젝트 관리 작업 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={addProjectManagementTask}>
          <Plus className="w-4 h-4 mr-1" /> 작업 추가
        </Button>
      </div>
    </div>
  );
}
