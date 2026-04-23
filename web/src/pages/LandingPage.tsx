import { LuClock, LuLock, LuCloudDownload } from "react-icons/lu";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Top-Notch Security",
    desc: "Your data is encrypted on your device using AES-GCM and Argon2id, so only you can access it.",
    icon: <LuLock />,
  },
  {
    title: "Easy to Use",
    desc: "Clean, intuitive interface lets you manage your credentials effortlessly, no matter your skill level.",
    icon: <LuClock />,
  },
  {
    title: "Access Anywhere",
    desc: "Your vault syncs securely across devices, so you can get your passwords anytime, anywhere.",
    icon: <LuCloudDownload />,
  },
];

const LandingPage = () => {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-12">

        <div className="flex-1 text-center md:text-left animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Limis — Your{" "}
            <span className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-hover)] bg-clip-text text-transparent">
              secure
            </span>{" "}
            credential vault
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] mb-10 max-w-lg mx-auto md:mx-0">
            Never worry about lost passwords or data leaks again. Limis keeps your secrets locked tight with zero-knowledge encryption.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-3 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/auth/login"
              className="px-8 py-3 border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] font-semibold hover:bg-[var(--color-surface)] transition"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src="hero_img.png"
            alt="Person using password manager"
            className="hidden md:block rounded-xl shadow-2xl h-auto max-h-[650px] w-auto transform hover:scale-105 transition"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center">
          Why Choose <span className="text-[var(--color-brand)]">Limis?</span>
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:items-start p-6 bg-[var(--color-surface)] rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <div className="p-4 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-hover)] py-20 px-6 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Start Protecting Your Credentials Today</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of users who trust Limis to keep their secrets safe and easy to manage.
        </p>
        <Link
          to="/auth/signup"
          className="inline-block px-10 py-4 rounded-lg bg-white text-[var(--color-brand)] font-semibold transition transform hover:scale-105 shadow-lg"
        >
          Create Your Free Account
        </Link>
        <p className="mt-4 text-sm opacity-75">Free and open-source • Your data stays with you</p>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-muted)]">
        &copy; {new Date().getFullYear()} Limis. All rights reserved.
      </footer>
    </main>
  );
};

export default LandingPage;
