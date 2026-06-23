"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PayForm({ projectId }: { projectId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("receipt", file);

        try {
            const res = await fetch(`/api/custom-project/${projectId}/pay`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal mengirim");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-2">
                    Upload Bukti Transfer (Max 3MB)
                </label>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF]"
                />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-3 bg-[#1A56FF] text-white rounded-2xl font-bold text-sm hover:bg-[#0A40D0] transition-colors disabled:opacity-50"
            >
                {loading ? "Mengirim..." : "Konfirmasi Pembayaran"}
            </button>
        </form>
    );
}
