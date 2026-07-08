"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Halo! Selamat datang di Canvas & Code. Saya asisten virtual C&C. Ada yang bisa saya bantu hari ini terkait layanan visual branding, website, sistem kasir (POS), atau penjadwalan konsultasi gratis?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll otomatis ke bawah setiap ada pesan baru
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            // Persiapkan payload riwayat chat (kecuali system prompt karena sudah dihandle di route API)
            const chatHistory = [...messages, { role: "user", content: userMessage }];

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: chatHistory }),
            });

            if (!res.ok) throw new Error("Gagal menghubungi server");

            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content || "Maaf, saya tidak dapat memahami permintaan tersebut.";

            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Maaf, koneksi terputus atau terjadi kesalahan server. Pastikan API key OpenRouter sudah dikonfigurasi di file `.env`."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    // Klik cepat untuk mengarahkan pengguna ke bagian halaman web tertentu
    function handleQuickAction(anchor: string, text: string) {
        setIsOpen(false); // Tutup bot agar tidak menghalangi viewport
        const element = document.querySelector(anchor);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        } else {
            // Jika anchor adalah navigasi halaman
            window.location.hash = anchor;
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Tombol Melayang (Chat Bubble Button) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FF4D1C] text-white shadow-2xl hover:bg-[#e84318] transition-all hover:scale-110 active:scale-95 duration-300 relative group cursor-pointer"
                    aria-label="Buka Chatbot"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6 animate-pulse"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.074-.765 6.002 6.002 0 013.037-5.514C4.817 13.561 3 11.006 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                        />
                    </svg>
                    {/* Tooltip */}
                    <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#0D0D12] text-[#F7F4EE] border border-[#1A1A22] text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap">
                        Tanya Chatbot C&C
                    </span>
                </button>
            )}

            {/* Jendela Chatbot */}
            {isOpen && (
                <div
                    className="w-[360px] sm:w-[400px] h-[500px] sm:h-[580px] bg-[#0D0D12]/95 backdrop-blur-lg border border-[#1A1A22] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right"
                    style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
                >
                    {/* Header */}
                    <div className="bg-[#111116] border-b border-[#1A1A22] px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4D1C] to-[#1A56FF] flex items-center justify-center text-xs font-bold text-white">
                                CC
                            </div>
                            <div>
                                <h4 className="text-white font-extrabold text-sm tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                                    C&C Assistant
                                </h4>
                                <span className="text-[10px] text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping"></span>
                                    Online • Selalu Aktif
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-[#5A5A6A] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1A1A22] cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Area Pesan Chat */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                        {messages.map((msg, index) => {
                            const isUser = msg.role === "user";
                            return (
                                <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                            isUser
                                                ? "bg-[#FF4D1C] text-white rounded-br-none"
                                                : "bg-[#111116] text-[#D8D3C9] border border-[#1A1A22] rounded-bl-none"
                                        }`}
                                    >
                                        <p className="whitespace-pre-line text-xs sm:text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#111116] text-[#9A9A9A] border border-[#1A1A22] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#5A5A6A] animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-[#5A5A6A] animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-[#5A5A6A] animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Action Chips */}
                    <div className="px-4 py-2 border-t border-[#1a1a22] bg-[#0c0c11] flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                        <button
                            onClick={() => handleQuickAction("#schedule", "Konsultasi")}
                            className="bg-[#111116] border border-[#1A1A22] text-[#F7F4EE] hover:bg-[#1A56FF]/10 hover:border-[#1A56FF] px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                        >
                            🗓️ Konsultasi Gratis
                        </button>
                        <button
                            onClick={() => handleQuickAction("#pricing", "Daftar Paket")}
                            className="bg-[#111116] border border-[#1A1A22] text-[#F7F4EE] hover:bg-[#FF4D1C]/10 hover:border-[#FF4D1C] px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                        >
                            💰 Paket Layanan
                        </button>
                        <button
                            onClick={() => handleQuickAction("#discovery-call", "Tanya Form")}
                            className="bg-[#111116] border border-[#1A1A22] text-[#F7F4EE] hover:bg-purple-500/10 hover:border-purple-500 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                        >
                            📲 Kirim Pesan
                        </button>
                    </div>

                    {/* Area Input Chat */}
                    <form onSubmit={handleSend} className="p-4 bg-[#111116] border-t border-[#1A1A22] flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Ketik pesan Anda..."
                            className="flex-grow bg-[#0A0A0F] border border-[#2A2A35] text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm placeholder-[#5A5A6A] focus:outline-none focus:border-[#1A56FF] transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-[#1A56FF] text-white p-2.5 rounded-xl hover:bg-[#0A40D0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
