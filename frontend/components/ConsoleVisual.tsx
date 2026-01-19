"use client"

import { useEffect, useRef } from "react"

export default function ConsoleVisual() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let drops: { x: number; y: number; speed: number; len: number }[] = []

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            initDrops()
        }

        const initDrops = () => {
            drops = []
            for (let i = 0; i < 50; i++) {
                drops.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: 2 + Math.random() * 5,
                    len: 10 + Math.random() * 20
                })
            }
        }

        const draw = () => {
            if (!ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            ctx.strokeStyle = "rgba(0, 255, 255, 0.3)"
            ctx.lineWidth = 1
            ctx.lineCap = "round"

            drops.forEach(drop => {
                ctx.beginPath()
                ctx.moveTo(drop.x, drop.y)
                ctx.lineTo(drop.x, drop.y + drop.len)
                ctx.stroke()

                // Draw dots at intervals
                ctx.fillStyle = "rgba(0, 255, 255, 0.6)"
                ctx.beginPath()
                ctx.arc(drop.x, drop.y + drop.len, 1.5, 0, Math.PI * 2)
                ctx.fill()

                drop.y += drop.speed
                if (drop.y > canvas.height) {
                    drop.y = -drop.len
                    drop.x = Math.random() * canvas.width
                }
            })

            animationFrameId = requestAnimationFrame(draw)
        }

        window.addEventListener("resize", resize)
        resize()
        draw()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div className="relative w-full h-full bg-[#0a0628] flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

            {/* Handheld Console CSS Art */}
            <div className="relative z-10 w-80 h-48 animate-bounce-slow">
                {/* Main Body */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.4)] border-4 border-white/10 flex items-center justify-center p-4">

                    {/* Screen Area */}
                    <div className="w-[65%] h-[85%] bg-black/80 rounded-2xl border-2 border-indigo-400/50 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />
                        <div className="w-12 h-12 border-2 border-cyan-500/30 rounded-full animate-ping" />
                    </div>

                    {/* Left Controls (D-Pad style) */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex flex-col items-center justify-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center relative">
                            <div className="absolute w-1 h-4 bg-cyan-400/80 rounded-full" />
                            <div className="absolute h-1 w-4 bg-cyan-400/80 rounded-full" />
                        </div>
                        <div className="flex gap-1 mt-2">
                            <div className="w-3 h-1 bg-white/20 rounded-full" />
                            <div className="w-3 h-1 bg-white/20 rounded-full" />
                        </div>
                    </div>

                    {/* Right Controls (Action buttons) */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-16 flex flex-col items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="w-4 h-4 rounded-full bg-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                            <div className="w-4 h-4 rounded-full bg-purple-400/80 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-5 h-5 rounded-full bg-white/20" />
                            <div className="w-5 h-5 rounded-full bg-white/20" />
                        </div>
                    </div>
                </div>

                {/* Top Bumpers */}
                <div className="absolute -top-1 left-16 w-12 h-3 bg-indigo-700 rounded-t-lg border-x-2 border-t-2 border-white/10" />
                <div className="absolute -top-1 right-16 w-12 h-3 bg-indigo-700 rounded-t-lg border-x-2 border-t-2 border-white/10" />
            </div>

            {/* Bottom Glow Arc */}
            <div className="absolute bottom-0 w-[150%] h-32 bg-gradient-to-t from-cyan-500/20 to-transparent blur-3xl translate-y-16 rounded-[100%]" />

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) rotate(-2deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
