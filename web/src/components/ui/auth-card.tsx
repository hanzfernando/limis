import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function AuthCard({ title, description = "A private archive protected by Auri.", children }: AuthCardProps) {
  return (
    <Card className="archive-surface relative w-full max-w-md overflow-hidden bg-card/95 backdrop-blur">
      <div className="archive-line absolute left-8 right-8 top-0 h-px" />
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-secondary text-primary shadow-sm">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-sm leading-6">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
