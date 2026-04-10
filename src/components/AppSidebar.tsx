import { ClipboardList, FileText, MessageSquare, CheckCircle, FileUp } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: ClipboardList, label: '기준자료 관리', path: '/', emoji: '📋' },
  { icon: FileText, label: 'RFP 분석', path: '/rfp-analysis', emoji: '📄' },
  { icon: MessageSquare, label: '견적 산정', path: '/estimation', emoji: '💬' },
  { icon: CheckCircle, label: '리뷰 & 확정', path: '/review', emoji: '✅' },
];

const steps = [
  { step: 1, label: '기준자료' },
  { step: 2, label: 'RFP 분석' },
  { step: 3, label: '견적 산정' },
  { step: 4, label: '리뷰 확정' },
];

export interface RfpDocInfo {
  fileName: string;
  client?: string;
  docType: string;
  status: '업로드 전' | '분석 중' | '분석 완료' | '리뷰 중' | '확정';
}

interface AppSidebarProps {
  currentStep?: number;
  rfpDoc?: RfpDocInfo | null;
}

export function AppSidebar({ currentStep = 1, rfpDoc }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-60 min-h-screen flex flex-col bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-fg))]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[hsl(var(--sidebar-hover))]">
        <span className="font-bold text-xl tracking-tight">{APP_CONFIG.name}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-fg))] font-medium'
                  : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-fg))]'
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* RFP Document Info */}
      {rfpDoc && (
        <div className="mx-3 mb-4 p-3 rounded-lg bg-[hsl(var(--sidebar-hover))] border border-[hsl(var(--sidebar-active)/.3)]">
          <div className="flex items-center gap-2 mb-2">
            <FileUp className="w-4 h-4 text-[hsl(var(--sidebar-muted))]" />
            <span className="text-xs text-[hsl(var(--sidebar-muted))] uppercase tracking-wider">현재 RFP</span>
          </div>
          <p className="text-sm font-medium text-[hsl(var(--sidebar-fg))] truncate" title={rfpDoc.fileName}>
            {rfpDoc.fileName}
          </p>
          {rfpDoc.client?.trim() && (
            <p className="text-xs text-[hsl(var(--sidebar-muted))] mt-1 truncate">
              {rfpDoc.client}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-[hsl(var(--sidebar-muted))]">{rfpDoc.docType}</span>
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-fg))]">
              {rfpDoc.status}
            </span>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="px-4 pb-6">
        <div className="text-xs text-[hsl(var(--sidebar-muted))] mb-3 uppercase tracking-wider">진행 단계</div>
        <div className="space-y-2">
          {steps.map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  s.step === currentStep
                    ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-fg))]'
                    : s.step < currentStep
                    ? 'bg-emerald-500 text-[hsl(var(--sidebar-fg))]'
                    : 'bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-muted))]'
                }`}
              >
                {s.step}
              </div>
              <span
                className={`text-sm ${
                  s.step === currentStep ? 'text-[hsl(var(--sidebar-fg))]' : 'text-[hsl(var(--sidebar-muted))]'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
