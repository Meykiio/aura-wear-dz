import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import logoWhite from "@/assets/aura-logo-white.png";

export const Route = createFileRoute("/admin")({
  component: AdminLogin,
});

function AdminLogin() {
  const { signIn, session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) {
      navigate({ to: "/dashboard" });
    }
  }, [session, isAdmin, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError("Invalid email or password.");
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-aura-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-aura-surface border border-aura-border rounded-[16px] p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logoWhite} alt="AURA WEAR" className="h-12 w-auto mb-6" />
          <h1 className="heading-xl text-aura-text">Espace Admin</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="caption-sm text-aura-text-muted mb-1 block">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-full border border-aura-border px-4 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
            />
          </label>
          <label className="block">
            <span className="caption-sm text-aura-text-muted mb-1 block">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-full border border-aura-border px-4 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
            />
          </label>
          {error && <p className="caption-md text-aura-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-full bg-aura-violet text-white body-strong disabled:opacity-50 hover:bg-aura-violet-dim transition-all duration-base"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
