import { PrismaClient } from "@prisma/client";
import KanbanBoard from "./KanbanBoard";

const prisma = new PrismaClient();

export default async function TrackingPage() {
    const projects = await prisma.customProject.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="text-white">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Tracking Project</h1>
                <p className="text-[#6B6B6B] text-sm mt-1">Kelola status custom project — klik tombol untuk pindah kolom.</p>
            </div>
            {projects.length === 0 ? (
                <p className="text-[#6B6B6B]">Belum ada custom project masuk.</p>
            ) : (
                <KanbanBoard initialProjects={projects} />
            )}
        </div>
    );
}
