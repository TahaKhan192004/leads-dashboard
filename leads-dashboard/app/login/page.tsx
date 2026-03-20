"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Map, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                setError("Incorrect password. Please try again.");
                setPassword("");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-500/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Logo mark */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
                        <Map className="w-6 h-6 text-black" />
                    </div>
                    <h1 className="font-display font-bold text-text-primary text-xl tracking-tight">
                        LeadRadar
                    </h1>
                    <p className="text-text-dim font-mono text-xs mt-1">
                        Google Maps Intelligence
                    </p>
                </div>

                {/* Card */}
                <div className="bg-surface border border-border-bright rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                    {/* Card header */}
                    <div className="px-6 py-5 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-400" />
                            <p className="font-display font-semibold text-text-primary text-sm">
                                Protected Dashboard
                            </p>
                        </div>
                        <p className="text-text-dim font-mono text-xs mt-1">
                            Enter your password to continue
                        </p>
                    </div>

                    {/* Form body */}
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-text-muted font-mono text-xs" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password…"
                                    autoComplete="current-password"
                                    required
                                    className="w-full bg-surface-2 border border-border hover:border-border-bright focus:border-amber-500/60 rounded-lg px-4 pr-10 py-2.5 text-text-primary placeholder:text-text-dim text-sm font-mono outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 font-mono text-xs">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-mono font-semibold transition-all duration-150 shadow-md shadow-amber-500/20"
                        >
                            {loading ? (
                                <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                            ) : (
                                <Lock className="w-3.5 h-3.5" />
                            )}
                            {loading ? "Verifying…" : "Unlock Dashboard"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-text-dim font-mono text-xs mt-6">
                    © {new Date().getFullYear()} LeadRadar
                </p>
            </div>
        </div>
    );
}
