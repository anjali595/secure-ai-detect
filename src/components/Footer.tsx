import { Github, Linkedin, Mail, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <ShieldCheck className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-lg font-semibold text-white">
                SecurePay <span className="text-gradient">AI</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Enterprise-grade credit card fraud detection powered by machine learning and real-time risk analysis.
            </p>
          </div>

          <div className="md:justify-self-center">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Real-time detection</li>
              <li>Risk scoring</li>
              <li>Batch CSV analysis</li>
              <li>API integration</li>
            </ul>
          </div>

          <div className="md:justify-self-end">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">Connect</h4>
            <div className="mt-3 flex gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-white hover:border-white/20">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-white hover:border-white/20">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:hello@securepay.ai" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-white hover:border-white/20">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/5 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SecurePay AI. All rights reserved.</p>
          <p>Built for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
}