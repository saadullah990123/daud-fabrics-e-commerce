"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@daudfabrics.pk");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("admin@daudfabrics.pk");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [generatedResetToken, setGeneratedResetToken] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const fillAdminCredentials = () => {
    setEmail("admin@daudfabrics.pk");
    setPassword("admin123");
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Invalid credentials. Please check your admin email and password."
        );
      }

      // Successful login -> Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
      setLoading(false);
    }
  };

  // Handle forgot password request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage(null);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setForgotMessage(data.message);
        if (data.resetToken) {
          setGeneratedResetToken(data.resetToken);
        }
      } else {
        setForgotMessage(data.error || "Could not generate reset token");
      }
    } catch {
      setForgotMessage("Failed to generate password reset request.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle setting new password with token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedResetToken || !newPasswordInput) return;
    setForgotLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: generatedResetToken,
          newPassword: newPasswordInput,
          confirmPassword: confirmPasswordInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResetSuccess(true);
        setPassword(newPasswordInput);
        setTimeout(() => {
          setShowForgotModal(false);
          setResetSuccess(false);
          setGeneratedResetToken(null);
          setForgotMessage(null);
        }, 2000);
      } else {
        setForgotMessage(data.error || "Failed to reset password");
      }
    } catch {
      setForgotMessage("Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/images/hero-banner.jpg"
          alt="Daud Fabrics Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-950/90" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-[#B8862B] rotate-45"></span>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              DAUD FABRICS
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8862B] font-semibold">
            Store Owner &amp; Admin Portal
          </span>
        </Link>
        <h2 className="mt-4 text-center font-serif text-xl font-bold tracking-tight text-stone-200">
          Admin Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-stone-400">
          Password-protected management for catalog, stock &amp; customer orders.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-stone-900 border border-stone-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl flex items-start gap-2 text-rose-300 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@daudfabrics.pk"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#B8862B] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B8862B] hover:bg-[#9E7422] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-xs sm:text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Enter Admin Dashboard</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={fillAdminCredentials}
                className="w-full bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Fill Default Admin Credentials</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-4 text-xs space-y-1.5">
            <p className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Default Admin Login:
            </p>
            <p className="text-stone-300 font-mono text-[11px]">
              Email: <span className="text-white font-bold">admin@daudfabrics.pk</span>
            </p>
            <p className="text-stone-300 font-mono text-[11px]">
              Password: <span className="text-white font-bold">admin123</span>
            </p>
            <p className="text-[10px] text-stone-400 pt-1">
              You can change your email or password anytime inside <strong>Admin &gt; Settings</strong>.
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>&larr; Back to Daud Fabrics Storefront</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif font-bold text-lg text-white">
                Admin Password Reset
              </h3>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setGeneratedResetToken(null);
                  setForgotMessage(null);
                }}
                className="text-stone-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            {resetSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-bold text-white text-sm">Password Reset Successfully!</p>
                <p className="text-xs text-stone-400">You can now sign in with your new password.</p>
              </div>
            ) : !generatedResetToken ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-stone-300">
                  Enter your administrator email. A password reset token will be verified.
                </p>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-[#B8862B] hover:bg-[#9E7422] text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  {forgotLoading ? "Processing..." : "Generate Reset Token"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-200">
                  <span>Reset Token Verified: </span>
                  <span className="font-mono font-bold">{generatedResetToken.slice(0, 8)}...</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-[#B8862B] hover:bg-[#9E7422] text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  {forgotLoading ? "Saving..." : "Save New Password"}
                </button>
              </form>
            )}

            {forgotMessage && (
              <p className="text-xs text-stone-400 text-center pt-2">{forgotMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
