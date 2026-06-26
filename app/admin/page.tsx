import { prisma } from "@/lib/prisma";
import AdminTabs from "./AdminTabs";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    try {
        const [orders, customProjects, discoveryCalls] = await Promise.all([
            prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
            prisma.customProject.findMany({ orderBy: { createdAt: "desc" } }),
            prisma.discoveryCall.findMany({ orderBy: { createdAt: "desc" } }),
        ]);

        return (
            <div className="text-white">
                <h1 className="text-2xl font-bold mb-8">Pesanan</h1>
                <AdminTabs orders={orders} customProjects={customProjects} discoveryCalls={discoveryCalls} />
            </div>
        );
    } catch (error) {
        return (
            <div className="text-white">
                <h1 className="text-2xl font-bold mb-4">Pesanan</h1>
                <div className="bg-red-900/30 border border-red-500 rounded-xl p-4 text-red-300 text-sm font-mono">
                    <p className="font-bold mb-2">Database error:</p>
                    <p>{String(error)}</p>
                </div>
            </div>
        );
    }
}
