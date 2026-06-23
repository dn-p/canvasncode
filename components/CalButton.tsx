"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function CalButton() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("ui", {
                theme: "dark", // Memaksa tampilan Dark Mode
                styles: { branding: { brandColor: "#1A56FF" } }, // Warna utama disesuaikan dengan biru tombol sebelumnya
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    return (
        // Wrapper ini penting agar kalendernya punya tinggi (height) yang cukup dan tidak terpotong
        <div className="w-full h-[620px] sm:h-[700px] overflow-hidden rounded-3xl border border-[#1A1A22]">
            <Cal
                calLink="hello-cnc-6axcwc/15min"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view", theme: "dark" }}
            />
        </div>
    );
}