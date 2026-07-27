import { Timer } from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6 py-10">
      <div className="w-full max-w-md">

        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-dim)]">
              <Timer
                size={19}
                strokeWidth={2.5}
                className="text-[var(--color-primary-light)]"
              />
            </span>

            <span className="text-lg font-bold tracking-tight text-white">
              Silver's{" "}
              <span className="text-[var(--color-primary-light)]">
                Timer
              </span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              {title}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {subtitle}
            </p>
          </div>

          <div className="mt-7">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}