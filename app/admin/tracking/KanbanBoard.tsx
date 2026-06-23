"use client";

import { useState } from "react";

type Project = {
    id: string;
    customerName: string;
    customerEmail: string;
    projectCategory: string;
    projectName: string;
    description: string;
    totalAmount: number | null;
    status: string;
    createdAt: Date;
};

const COLUMNS = [
    { key: "REQUESTED", label: "Request Masuk", color: "#F97316" },
    { key: "QUOTED", label: "Penawaran Terkirim", color: "#8B5CF6" },
    { key: "VERIFYING", label: "Verifikasi Bayar", color: "#3B82F6" },
    { key: "COMPLETED", label: "Selesai", color: "#22C55E" },
    { key: "REJECTED", label: "Ditolak", color: "#EF4444" },
];

export default function KanbanBoard({ initialProjects }: { initialProjects: Project[] }) {
    const [projects, setProjects] = useState(initialProjects);
    const [moving, setMoving] = useState<string | null>(null);

    async function moveProject(id: string, newStatus: string) {
        setMoving(id);
        try {
            const res = await fetch(`/api/custom-project/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setProjects((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
                );
            }
        } finally {
            setMoving(null);
        }
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col) => {
                const cards = projects.filter((p) => p.status === col.key);
                return (
                    <div key={col.key} className="shrink-0 w-64">
                        {/* Column header */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                            <h3 className="text-white text-sm font-bold">{col.label}</h3>
                            <span className="ml-auto text-xs text-[#6B6B6B] bg-[#1A1A22] px-2 py-0.5 rounded-full">
                                {cards.length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3 min-h-[100px]">
                            {cards.map((p) => (
                                <div
                                    key={p.id}
                                    className="bg-[#0D0D12] border border-[#1A1A22] rounded-2xl p-4"
                                    style={{ borderLeftColor: col.color, borderLeftWidth: 3 }}
                                >
                                    <p className="text-white text-sm font-bold mb-0.5 truncate">{p.projectName}</p>
                                    <p className="text-[#6B6B6B] text-xs mb-1">{p.customerName}</p>
                                    <p className="text-[#6B6B6B] text-xs mb-3 truncate">{p.projectCategory}</p>

                                    {p.totalAmount && (
                                        <p className="text-[#1A56FF] text-xs font-bold mb-3">
                                            Rp {p.totalAmount.toLocaleString("id-ID")}
                                        </p>
                                    )}

                                    {/* Move buttons */}
                                    <div className="flex flex-wrap gap-1">
                                        {COLUMNS.filter((c) => c.key !== col.key).map((target) => (
                                            <button
                                                key={target.key}
                                                disabled={moving === p.id}
                                                onClick={() => moveProject(p.id, target.key)}
                                                className="text-[10px] px-2 py-1 rounded-lg border border-[#2A2A35] text-[#6B6B6B] hover:text-white hover:border-[#1A56FF] transition-colors disabled:opacity-40"
                                            >
                                                → {target.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {cards.length === 0 && (
                                <div className="border border-dashed border-[#1A1A22] rounded-2xl p-4 text-center text-[#3A3A45] text-xs">
                                    Kosong
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
