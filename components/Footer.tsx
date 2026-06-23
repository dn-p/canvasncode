import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0F] border-t border-[#1A1A22] py-12 px-6 sm:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <Link
                            href="/"
                            className="text-xl font-extrabold tracking-tighter text-[#F7F4EE]"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            CANVAS<span className="text-[#FF4D1C]">CODE</span>
                        </Link>
                        <p className="mt-2 text-xs text-[#3A3A3A]">
                            © {new Date().getFullYear()} Canvas & Code. Palembang, Indonesia.
                        </p>
                    </div>

                    {/* Social links */}
                    <div className="flex gap-6 text-xs font-semibold tracking-wider uppercase">
                        {['Twitter', 'LinkedIn', 'Dribbble', 'GitHub'].map((s) => (
                            <Link
                                key={s}
                                href="#"
                                className="text-[#3A3A3A] hover:text-[#F7F4EE] transition-colors"
                            >
                                {s}
                            </Link>
                        ))}
                    </div>

                </div>

            </div>
        </footer>
    );
}
