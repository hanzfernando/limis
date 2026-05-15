import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("mx-auto h-full w-full max-w-6xl px-4 py-10 md:px-8", className)}>{children}</div>;
}
