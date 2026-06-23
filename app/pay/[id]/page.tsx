import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import PayForm from "./PayForm";

const prisma = new PrismaClient();

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.customProject.findUnique({ where: { id } });

    if (!project) notFound();

    return (
        <main className="min-h-screen bg-[#F7F4EE] flex items-center justify-center px-4 py-16">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8">
                <p className="text-xs font-bold tracking-[0.2em] text-[#1A56FF] uppercase mb-2">Custom Project</p>
                <h1
                    className="text-[#0A0A0F] text-2xl font-extrabold mb-1"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    {project.projectName}
                </h1>
                <p className="text-[#6B6B6B] text-sm mb-6">{project.projectCategory}</p>

                <div className="bg-[#F7F4EE] rounded-2xl p-4 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#6B6B6B]">Nama</span>
                        <span className="font-semibold text-[#0A0A0F]">{project.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#6B6B6B]">Email</span>
                        <span className="font-semibold text-[#0A0A0F]">{project.customerEmail}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E8E3D9] pt-2 mt-2">
                        <span className="text-[#6B6B6B] font-semibold">Total Pembayaran</span>
                        <span className="text-[#0A0A0F] text-xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Rp {project.totalAmount?.toLocaleString("id-ID") ?? "—"}
                        </span>
                    </div>
                </div>

                {project.status === "QUOTED" ? (
                    <PayForm projectId={id} />
                ) : project.status === "VERIFYING" ? (
                    <div className="text-center py-4">
                        <p className="text-[#1A56FF] font-semibold text-sm">Bukti transfer sudah diterima — sedang diverifikasi.</p>
                    </div>
                ) : project.status === "COMPLETED" ? (
                    <div className="text-center py-4">
                        <p className="text-green-600 font-semibold text-sm">Pembayaran telah dikonfirmasi. Terima kasih!</p>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-[#9A9A9A] text-sm">Halaman ini belum aktif. Tunggu penawaran harga dari kami.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
