import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-border/80 bg-card/95 shadow-[0_18px_70px_rgba(20,14,32,0.10)] backdrop-blur">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary text-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>A private archive protected by Auri.</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
