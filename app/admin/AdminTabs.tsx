"use client";

import { useState } from "react";
import Image from "next/image";

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pending",
    VERIFYING: "Verifikasi",
    COMPLETED: "Selesai",
    REJECTED: "Ditolak",
    REQUESTED: "Request",
    QUOTED: "Penawaran Terkirim",
};

const ORDER_STATUSES = ["PENDING", "VERIFYING", "COMPLETED", "REJECTED"];
const CUSTOM_STATUSES = ["REQUESTED", "QUOTED", "VERIFYING", "COMPLETED", "REJECTED"];

function StatusDropdown({ id, current, statuses, apiPath }: { id: string; current: string; statuses: string[]; apiPath: string }) {
    const [value, setValue] = useState(current);
    const [loading, setLoading] = useState(false);

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value;
        setValue(newStatus);
        setLoading(true);
        try {
            await fetch(`${apiPath}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <select
            value={value}
            onChange={handleChange}
            disabled={loading}
            className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none disabled:opacity-50 cursor-pointer ${STATUS_COLOR[value] ?? "bg-gray-100 text-gray-800"}`}
        >
            {statuses.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
        </select>
    );
}

const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    VERIFYING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    REQUESTED: "bg-orange-100 text-orange-800",
    QUOTED: "bg-purple-100 text-purple-800",
};

type Order = {
    id: string;
    customerName: string;
    customerEmail: string;
    serviceName: string;
    totalAmount: number;
    status: string;
    receiptUrl: string | null;
    createdAt: Date;
};

type CustomProject = {
    id: string;
    customerName: string;
    customerEmail: string;
    projectCategory: string;
    projectName: string;
    description: string;
    totalAmount: number | null;
    status: string;
    receiptUrl: string | null;
    createdAt: Date;
};

function QuoteForm({ project }: { project: CustomProject }) {
    const [amount, setAmount] = useState(project.totalAmount?.toString() ?? "");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(project.status === "QUOTED");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/custom-project/${project.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totalAmount: amount }),
            });
            if (res.ok) setDone(true);
        } finally {
            setLoading(false);
        }
    }

    const payLink = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${project.id}`;

    return done ? (
        <div className="space-y-1">
            <p className="text-green-400 text-xs font-semibold">Penawaran terkirim</p>
            <div className="flex items-center gap-2">
                <input
                    readOnly
                    value={payLink}
                    className="bg-[#1A1A22] text-[#9A9A9A] text-xs px-3 py-1.5 rounded-lg w-48 truncate"
                />
                <button
                    onClick={() => navigator.clipboard.writeText(payLink)}
                    className="text-xs text-[#1A56FF] hover:underline shrink-0"
                >
                    Salin
                </button>
            </div>
        </div>
    ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nilai (Rp)"
                required
                className="bg-[#1A1A22] text-white text-xs px-3 py-1.5 rounded-lg w-28 border border-[#2A2A32] focus:outline-none focus:border-[#1A56FF]"
            />
            <button
                type="submit"
                disabled={loading}
                className="text-xs bg-[#1A56FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#0A40D0] disabled:opacity-50"
            >
                {loading ? "..." : "Kirim"}
            </button>
        </form>
    );
}

export default function AdminTabs({ orders, customProjects }: { orders: Order[]; customProjects: CustomProject[] }) {
    const [tab, setTab] = useState<"orders" | "custom">("orders");

    return (
        <>
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setTab("orders")}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === "orders" ? "bg-white text-[#0A0A0F]" : "text-[#6B6B6B] hover:text-white"}`}
                >
                    Orders ({orders.length})
                </button>
                <button
                    onClick={() => setTab("custom")}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === "custom" ? "bg-white text-[#0A0A0F]" : "text-[#6B6B6B] hover:text-white"}`}
                >
                    Custom Projects ({customProjects.length})
                </button>
            </div>

            {tab === "orders" && (
                orders.length === 0 ? (
                    <p className="text-[#6B6B6B]">Belum ada order masuk.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-[#1A1A22] text-[#6B6B6B] text-left">
                                    <th className="py-3 pr-6">Nama</th>
                                    <th className="py-3 pr-6">Email</th>
                                    <th className="py-3 pr-6">Layanan</th>
                                    <th className="py-3 pr-6">Total</th>
                                    <th className="py-3 pr-6">Status</th>
                                    <th className="py-3 pr-6">Bukti Transfer</th>
                                    <th className="py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-[#1A1A22] align-top">
                                        <td className="py-4 pr-6">{order.customerName}</td>
                                        <td className="py-4 pr-6 text-[#6B6B6B]">{order.customerEmail}</td>
                                        <td className="py-4 pr-6">{order.serviceName}</td>
                                        <td className="py-4 pr-6">Rp {order.totalAmount.toLocaleString("id-ID")}</td>
                                        <td className="py-4 pr-6">
                                            <StatusDropdown id={order.id} current={order.status} statuses={ORDER_STATUSES} apiPath="/api/order" />
                                        </td>
                                        <td className="py-4 pr-6">
                                            {order.receiptUrl ? (
                                                <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                                                    <Image src={order.receiptUrl} alt="Bukti transfer" width={80} height={80} className="rounded-lg object-cover border border-[#1A1A22] hover:opacity-80 transition" />
                                                </a>
                                            ) : <span className="text-[#6B6B6B]">—</span>}
                                        </td>
                                        <td className="py-4 text-[#6B6B6B]">
                                            {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {tab === "custom" && (
                customProjects.length === 0 ? (
                    <p className="text-[#6B6B6B]">Belum ada custom project masuk.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-[#1A1A22] text-[#6B6B6B] text-left">
                                    <th className="py-3 pr-6">Nama</th>
                                    <th className="py-3 pr-6">Project</th>
                                    <th className="py-3 pr-6">Kategori</th>
                                    <th className="py-3 pr-6">Deskripsi</th>
                                    <th className="py-3 pr-6">Status</th>
                                    <th className="py-3 pr-6">Penawaran / Link</th>
                                    <th className="py-3 pr-6">Bukti Transfer</th>
                                    <th className="py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customProjects.map((p) => (
                                    <tr key={p.id} className="border-b border-[#1A1A22] align-top">
                                        <td className="py-4 pr-6">
                                            <div>{p.customerName}</div>
                                            <div className="text-[#6B6B6B] text-xs">{p.customerEmail}</div>
                                        </td>
                                        <td className="py-4 pr-6">{p.projectName}</td>
                                        <td className="py-4 pr-6 text-[#6B6B6B]">{p.projectCategory}</td>
                                        <td className="py-4 pr-6 text-[#6B6B6B] max-w-[200px]">
                                            <p className="line-clamp-2 text-xs">{p.description}</p>
                                        </td>
                                        <td className="py-4 pr-6">
                                            <StatusDropdown id={p.id} current={p.status} statuses={CUSTOM_STATUSES} apiPath="/api/custom-project" />
                                        </td>
                                        <td className="py-4 pr-6">
                                            <QuoteForm project={p} />
                                        </td>
                                        <td className="py-4 pr-6">
                                            {p.receiptUrl ? (
                                                <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer">
                                                    <Image src={p.receiptUrl} alt="Bukti transfer" width={80} height={80} className="rounded-lg object-cover border border-[#1A1A22] hover:opacity-80 transition" />
                                                </a>
                                            ) : <span className="text-[#6B6B6B]">—</span>}
                                        </td>
                                        <td className="py-4 text-[#6B6B6B]">
                                            {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </>
    );
}
