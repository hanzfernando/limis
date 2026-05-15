import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
  <div className={cn("mx-auto h-full w-full px-4 py-6 md:px-4 overflow-y-auto", className)}>
    <div className="max-w-6xl mx-auto">
      {children}
    </div>

  </div>);
}
