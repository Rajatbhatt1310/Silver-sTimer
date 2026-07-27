import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordForm({
  onSubmit,
  loading = false,
  error = "",
  success = false,
}) {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) return;

    onSubmit?.({
      email: email.trim(),
    });
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <Mail size={21} />
        </div>

        <h2 className="mt-4 font-semibold text-white">
          Check your email
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          If an account exists with that email, you'll receive
          password reset instructions.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
        >
          <ArrowLeft size={15} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/40"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <Link
        to="/login"
        className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to login
      </Link>

    </form>
  );
}