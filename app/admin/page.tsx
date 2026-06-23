import { PrismaClient } from "@prisma/client";
import AdminTabs from "./AdminTabs";

const prisma = new PrismaClient();

export default async function AdminPage() {
    const [orders, customProjects] = await Promise.all([
        prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.customProject.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return (
        <div className="text-white">
            <h1 className="text-2xl font-bold mb-8">Pesanan</h1>
            <AdminTabs orders={orders} customProjects={customProjects} />
        </div>
    );
}
