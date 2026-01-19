import ConsoleVisual from "@/components/ConsoleVisual"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen relative overflow-hidden bg-[#0a0628]">
            {/* Background Texture/Particles integrated in Layout too */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl rounded-[100%]" />
            </div>

            {/* Content Split */}
            <div className="flex w-full z-10">
                {/* Visual Side (Left) */}
                <div className="hidden lg:flex w-1/2 items-center justify-center p-12 border-r border-white/5">
                    <ConsoleVisual />
                </div>

                {/* Form Side (Right) */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black/20 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
