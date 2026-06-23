"use client";

import { useState } from "react";

export default function TestCheckout() {
  const [response, setResponse] = useState<string>("Belum ada data dikirim...");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setResponse("Sedang mengirim data ke API dan Supabase...");

    const formData = new FormData(e.currentTarget);
    // Kita paksa masukkan totalAmount agar tidak repot mengetik
    formData.append("totalAmount", "1500000");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2)); // Menampilkan hasil balasan dari API
    } catch (error) {
      setResponse("Gagal memanggil API: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-10 font-sans">
      <div className="max-w-xl mx-auto bg-[#111116] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-[#1A56FF]">Test API Checkout</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="customerName" type="text" placeholder="Nama Klien" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
          <input name="customerEmail" type="email" placeholder="Email Klien" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
          <input name="serviceName" type="text" placeholder="Nama Layanan (Misal: POS System)" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Upload Bukti Transfer (Max 3MB):</label>
            <input name="receipt" type="file" accept="image/*" required className="p-2 bg-gray-900 rounded-lg text-sm border border-gray-700" />
          </div>

          <button type="submit" disabled={isLoading} className="bg-[#1A56FF] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition mt-4">
            {isLoading ? "Mengirim..." : "Test Kirim API"}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-sm text-gray-400 mb-2">Balasan dari Server:</h2>
          <pre className="bg-black p-4 rounded-lg overflow-auto text-green-400 text-xs border border-gray-800 h-48">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}