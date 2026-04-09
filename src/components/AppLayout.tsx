import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
  currentStep?: number;
}

export function AppLayout({ children, currentStep = 1 }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar currentStep={currentStep} />
      <main className="flex-1 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
}
