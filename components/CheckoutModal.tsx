"use client";

import { useState } from "react";

type Package = {
    name: string;
    price: string;
    amount: number;
};

type Props = {
    isOpen: boolean;
    selectedPackage: Package | null;
    onClose: () => void;
};

export const CHECKOUT_PACKAGES: Package[] = [
    { name: "Social Media — Starter", price: "Rp 750.000/bln", amount: 750000 },
    { name: "Social Media — Growth", price: "Rp 1.500.000/bln", amount: 1500000 },
    { name: "Social Media — Pro", price: "Rp 3.000.000/bln", amount: 3000000 },
    { name: "Identitas Visual", price: "Mulai Rp 1.500.000", amount: 1500000 },
    { name: "Website & Landing Page", price: "Mulai Rp 3.000.000", amount: 3000000 },
    { name: "Bundling Kreatif + Kasir", price: "Mulai Rp 6.000.000", amount: 6000000 },
];

export default function CheckoutModal({ isOpen, selectedPackage, onClose }: Props) {
    const [form, setForm] = useState({ customerName: "", customerEmail: "" });
    const [pkg, setPkg] = useState<Package | null>(selectedPackage);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    // Sync selected package when modal opens with a pre-selected one
    if (isOpen && selectedPackage && pkg?.name !== selectedPackage.name && !submitted) {
        setPkg(selectedPackage);
    }

    function handleClose() {
        onClose();
        setTimeout(() => {
            setSubmitted(false);
            setError("");
            setForm({ customerName: "", customerEmail: "" });
            setFile(null);
        }, 300);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!pkg || !file) return;

        if (file.size > 3 * 1024 * 1024) {
            setError("Ukuran file maksimal 3MB");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("customerName", form.customerName);
        formData.append("customerEmail", form.customerEmail);
        formData.append("serviceName", pkg.name);
        formData.append("totalAmount", pkg.amount.toString());
        formData.append("receipt", file);

        try {
            const res = await fetch("/api/checkout", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal mengirim");
            setSubmitted(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={handleClose}>
            <div
                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {submitted ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">✓</div>
                        <h3 className="text-[#0A0A0F] text-xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Order Diterima!
                        </h3>
                        <p className="text-[#6B6B6B] text-sm mb-6">
                            Bukti transfer kamu sudah kami terima. Kami akan verifikasi dan menghubungi kamu via email.
                        </p>
                        <button
                            onClick={handleClose}
                            className="px-6 py-3 bg-[#0A0A0F] text-white rounded-2xl font-bold text-sm hover:bg-[#1A56FF] transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#0A0A0F] text-xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
                                Checkout
                            </h3>
                            <button onClick={handleClose} className="text-[#9A9A9A] hover:text-[#0A0A0F] text-2xl leading-none">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Pilih Paket */}
                            <div>
                                <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Paket</label>
                                <select
                                    value={pkg?.name ?? ""}
                                    onChange={(e) => {
                                        const found = CHECKOUT_PACKAGES.find((p) => p.name === e.target.value);
                                        setPkg(found ?? null);
                                    }}
                                    required
                                    className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF] bg-white"
                                >
                                    <option value="">Pilih paket...</option>
                                    {CHECKOUT_PACKAGES.map((p) => (
                                        <option key={p.name} value={p.name}>{p.name} — {p.price}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Total */}
                            {pkg && (
                                <div className="bg-[#F7F4EE] rounded-2xl px-4 py-3 flex justify-between items-center">
                                    <span className="text-[#6B6B6B] text-sm">Total pembayaran</span>
                                    <span className="text-[#0A0A0F] font-extrabold">
                                        Rp {pkg.amount.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Nama</label>
                                    <input
                                        value={form.customerName}
                                        onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                                        required
                                        placeholder="Nama lengkap"
                                        className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={form.customerEmail}
                                        onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                                        required
                                        placeholder="email@kamu.com"
                                        className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">
                                    Bukti Transfer (Max 3MB)
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
                                disabled={loading || !pkg || !file}
                                className="w-full py-3 bg-[#1A56FF] text-white rounded-2xl font-bold text-sm hover:bg-[#0A40D0] transition-colors disabled:opacity-50"
                            >
                                {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
