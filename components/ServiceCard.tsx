"use client"; // INI WAJIB agar useState bisa berjalan
import { useState } from "react";

export default function ServiceCard({ title }: { title: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-800 rounded-2xl p-6 bg-[#111116] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <h3 className="text-xl font-bold flex justify-between">
                {title} <span>{isOpen ? "▲" : "▼"}</span>
            </h3>

            {isOpen && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                    <p className="text-gray-400">Detail paket untuk {title} akan muncul di sini...</p>
                    {/* Kamu bisa tambahkan list paket di sini */}
                </div>
            )}
        </div>
    );
}
