import { Archive, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import BrandMark from "./BrandMark";

const signals = [
  { label: "Zero-knowledge posture", icon: EyeOff },
  { label: "Vault-key encryption", icon: LockKeyhole },
  { label: "Quiet recovery flow", icon: Archive },
];

export default function AuthBrandPanel() {
  return (
    <section className="archive-surface hidden min-h-[32rem] overflow-hidden rounded-lg bg-card/80 p-6 lg:flex lg:flex-col lg:justify-between">
      <div>
        <BrandMark />
        <div className="mt-12">
          <p className="text-sm font-medium uppercase text-muted-foreground">Auri is watching softly</p>
          <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">
            Unlock the archive without the noise.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Limis keeps access focused: muted surfaces, deliberate prompts, and a guardian identity
            that feels intelligent instead of alarmist.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {signals.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-md border border-border bg-background/55 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm text-foreground/90">{label}</span>
          </div>
        ))}
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Silent guardian mode active</span>
        </div>
      </div>
    </section>
  );
}
