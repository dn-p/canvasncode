import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    VERIFYING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
};

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pending",
    VERIFYING: "Verifikasi",
    COMPLETED: "Selesai",
    REJECTED: "Ditolak",
};

export default async function ReportPage() {
    const [orders, customProjects] = await Promise.all([
        prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.customProject.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    const totalRevenue = orders
        .filter((o) => o.status === "COMPLETED")
        .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "VERIFYING").length;
    const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;

    const customRevenue = customProjects
        .filter((p) => p.status === "COMPLETED" && p.totalAmount)
        .reduce((sum, p) => sum + (p.totalAmount ?? 0), 0);

    const totalAllRevenue = totalRevenue + customRevenue;

    const ordersByStatus = ["PENDING", "VERIFYING", "COMPLETED", "REJECTED"].map((s) => ({
        status: s,
        count: orders.filter((o) => o.status === s).length,
    }));

    const now = new Date();
    const thisMonth = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthRevenue = thisMonth
        .filter((o) => o.status === "COMPLETED")
        .reduce((sum, o) => sum + o.totalAmount, 0);

    return (
        <div className="text-white">
            <h1 className="text-2xl font-bold mb-8">Laporan</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-[#0D0D12] border border-[#1A1A22] rounded-2xl p-5">
                    <p className="text-[#6B6B6B] text-xs uppercase tracking-wider mb-2">Total Revenue</p>
                    <p className="text-2xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
                        Rp {totalAllRevenue.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[#6B6B6B] text-xs mt-1">Order + Custom Project selesai</p>
                </div>
                <div className="bg-[#0D0D12] border border-[#1A1A22] rounded-2xl p-5">
                    <p className="text-[#6B6B6B] text-xs uppercase tracking-wider mb-2">Bulan Ini</p>
                    <p className="text-2xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
                        Rp {thisMonthRevenue.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[#6B6B6B] text-xs mt-1">{thisMonth.length} order masuk</p>
                </div>
                <div className="bg-[#0D0D12] border border-[#1A1A22] rounded-2xl p-5">
                    <p className="text-[#6B6B6B] text-xs uppercase tracking-wider mb-2">Perlu Tindakan</p>
                    <p className="text-2xl font-extrabold text-yellow-400" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {pendingOrders}
                    </p>
                    <p className="text-[#6B6B6B] text-xs mt-1">Order pending / verifikasi</p>
                </div>
                <div className="bg-[#0D0D12] border border-[#1A1A22] rounded-2xl p-5">
                    <p className="text-[#6B6B6B] text-xs uppercase tracking-wider mb-2">Order Selesai</p>
                    <p className="text-2xl font-extrabold text-green-400" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {completedOrders}
                    </p>
                    <p className="text-[#6B6B6B] text-xs mt-1">dari {orders.length} total order</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders by status */}
                <div className="bg-[#0D0D12] border border-[#1A1A22] rounded-2xl p-6">
                    <h2 className="font-bold mb-4">Order per Status</h2>
                    <div className="space-y-3">
                        {ordersByStatus.map(({ status, count }) => (
                            <div key={status} className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[status]}`}>
                                    {STATUS_LABEL[status]}
                                </span>
                                <div className="flex items-center gap-3 flex-1 mx-4">
                                    <div className="flex-1 bg-[#1A1A22] rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-[#1A56FF]"
                                            style={{ width: orders.length ? `${(count / orders.length) * 100}%` : "0%" }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-bold">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent orders */}
                <div className="bg-[#0D0D12] border border-[#1A1A22] rounded-2xl p-6">
                    <h2 className="font-bold mb-4">Order Terbaru</h2>
                    {orders.length === 0 ? (
                        <p className="text-[#6B6B6B] text-sm">Belum ada order.</p>
                    ) : (
                        <div className="space-y-3">
                            {orders.slice(0, 5).map((o) => (
                                <div key={o.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-medium">{o.customerName}</p>
                                        <p className="text-[#6B6B6B] text-xs">{o.serviceName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">Rp {o.totalAmount.toLocaleString("id-ID")}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[o.status]}`}>
                                            {STATUS_LABEL[o.status]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
