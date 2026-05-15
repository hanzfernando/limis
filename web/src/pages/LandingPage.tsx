import { Archive, EyeOff, KeyRound, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { Button } from "../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const principles = [
  {
    title: "Silent Protection",
    desc: "Credentials sit behind calm controls, quiet feedback, and zero-knowledge encryption.",
    icon: ShieldCheck,
  },
  {
    title: "Encrypted Archive",
    desc: "Vaults are treated like personal records: ordered, private, and intentionally low-noise.",
    icon: Archive,
  },
  {
    title: "Private by Default",
    desc: "The interface keeps attention on access, clarity, and ownership instead of threat theater.",
    icon: EyeOff,
  },
];

const colors = [
  { name: "Deep Violet", value: "#15111F" },
  { name: "Muted Indigo", value: "#5D3C8F" },
  { name: "Auri Lavender", value: "#BDA6E4" },
  { name: "Lavender Gray", value: "#A89DB8" },
  { name: "Soft White", value: "#F7F6FB" },
];

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate flex min-h-[calc(100vh-73px)] items-center overflow-hidden px-6 py-16">
        <img
          src="/hero_img.png"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.08] grayscale dark:opacity-[0.05]"
        />
        <div className="absolute inset-0 -z-10 bg-background/86" />

        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div className="max-w-3xl animate-fadeIn">
            <div className="mb-8">
              <BrandMark />
            </div>

            <p className="mb-4 text-sm font-medium uppercase text-muted-foreground">
              Privacy-first credential manager
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              A secure personal archive guarded by a silent intelligent owl.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Limis gives credentials a calm, encrypted home. Auri, the owl-inspired guardian,
              shapes a brand that feels wise, restrained, and quietly protective.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/auth/signup">
                  <LockKeyhole className="h-4 w-4" />
                  Create archive
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth/login">
                  <KeyRound className="h-4 w-4" />
                  Unlock Limis
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/75 p-4 shadow-[0_24px_90px_rgba(20,14,32,0.14)] backdrop-blur">
            <div className="rounded-md border border-border bg-background/80 p-4">
              <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-sm font-medium">Auri Archive</p>
                  <p className="text-xs text-muted-foreground">3 guarded vaults</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-3">
                {["Personal", "Work", "Recovery"].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <LockKeyhole className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{item}</p>
                        <p className="text-xs text-muted-foreground">AES-GCM sealed</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{index + 4} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/35 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {principles.map(({ title, desc, icon: Icon }) => (
            <Card key={title} className="bg-card/80">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="leading-6">{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-border bg-secondary text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-semibold">Minimal, atmospheric, and exact.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              The Limis system uses restrained violet surfaces, fine borders, readable sans-serif
              typography, and geometric owl symbolism. It avoids hacker cliches and keeps trust in
              the details.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5">
            {colors.map((color) => (
              <div key={color.name} className="rounded-lg border border-border bg-card p-3">
                <div
                  className="mb-3 h-20 rounded-md border border-border"
                  style={{ backgroundColor: color.value }}
                />
                <p className="text-sm font-medium">{color.name}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{color.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        Limis. Guarded by Auri.
      </footer>
    </main>
  );
};

export default LandingPage;
