import { ReactNode } from 'react';
import { AppSidebar, RfpDocInfo } from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
  currentStep?: number;
  rfpDoc?: RfpDocInfo | null;
}

export function AppLayout({ children, currentStep = 1, rfpDoc }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar currentStep={currentStep} rfpDoc={rfpDoc} />
      <main className="flex-1 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
}
