const features = [
  {
    title: "Track every dollar",
    description: "Log income and expenses in seconds, then filter by date or category.",
  },
  {
    title: "See the full picture",
    description: "Balance, trends, and category splits update as you spend and earn.",
  },
  {
    title: "Stay organized",
    description: "Group transactions with custom categories that match how you live.",
  },
]

export function AuthMarketingPanel() {
  return (
    <div className="auth-panel relative hidden h-full min-h-screen flex-col overflow-y-auto p-10 text-white lg:flex">
      <div className="auth-panel-bg absolute inset-0" aria-hidden />
      <div className="auth-panel-grid absolute inset-0" aria-hidden />

      <div className="relative z-20 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-emerald-300"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </span>
        <span className="font-[family-name:var(--font-auth-display)] text-2xl tracking-tight">
          CashFlow
        </span>
      </div>

      <div className="relative z-20 flex flex-1 flex-col justify-center gap-8 py-10">
        <div className="auth-fade-up max-w-md space-y-4">
          <h2 className="font-[family-name:var(--font-auth-display)] text-4xl leading-[1.1] tracking-tight xl:text-5xl">
            Know where your money goes
          </h2>
          <p className="text-base leading-relaxed text-white/70">
            A clear dashboard for income, spending, and categories—so your next
            financial decision starts with the facts.
          </p>
        </div>

        <div className="auth-fade-up auth-fade-up-delay relative w-full max-w-lg">
          <CashFlowVisual />
        </div>

        <ul className="auth-fade-up auth-fade-up-delay-2 space-y-4">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <div>
                <p className="font-medium text-white">{feature.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-white/60">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <blockquote className="auth-fade-up auth-fade-up-delay-3 relative z-20 max-w-md space-y-2 border-t border-white/10 pt-6">
        <p className="text-base leading-relaxed text-white/85">
          &ldquo;This app has helped me get my finances in order and track my
          spending habits effectively.&rdquo;
        </p>
        <footer className="text-sm text-emerald-300/90">Sofia Davis</footer>
      </blockquote>
    </div>
  )
}

function CashFlowVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.7)] backdrop-blur-md">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">
            This month
          </p>
          <p className="mt-1 font-[family-name:var(--font-auth-display)] text-3xl tracking-tight">
            $4,280
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-emerald-300">+12.4%</p>
          <p className="text-white/45">vs last month</p>
        </div>
      </div>

      <svg
        viewBox="0 0 420 140"
        className="h-28 w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(52 211 153)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(52 211 153)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="auth-flow-fill"
          d="M0 110 C 40 108, 55 95, 90 88 C 130 80, 150 55, 190 52 C 235 48, 250 70, 290 62 C 335 52, 360 28, 420 22 L 420 140 L 0 140 Z"
          fill="url(#flowFill)"
        />
        <path
          className="auth-flow-line"
          d="M0 110 C 40 108, 55 95, 90 88 C 130 80, 150 55, 190 52 C 235 48, 250 70, 290 62 C 335 52, 360 28, 420 22"
          fill="none"
          stroke="rgb(110 231 183)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle className="auth-flow-dot" cx="190" cy="52" r="4" fill="rgb(167 243 208)" />
        <circle className="auth-flow-dot auth-flow-dot-delay" cx="420" cy="22" r="4" fill="rgb(167 243 208)" />
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-white/45">Income</p>
          <p className="mt-0.5 font-medium text-emerald-300">$6,120</p>
        </div>
        <div>
          <p className="text-white/45">Expenses</p>
          <p className="mt-0.5 font-medium text-rose-300">$1,840</p>
        </div>
        <div>
          <p className="text-white/45">Saved</p>
          <p className="mt-0.5 font-medium text-white">$4,280</p>
        </div>
      </div>
    </div>
  )
}
