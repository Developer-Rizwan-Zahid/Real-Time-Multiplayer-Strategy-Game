"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, TrendingUp, Shield, BarChart3, LogOut, BrainCircuit } from "lucide-react"

export default function DashboardPage() {
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [aiInsights, setAiInsights] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        const userStr = localStorage.getItem("user")
        if (userStr && userStr !== "undefined") {
            try {
                setCurrentUser(JSON.parse(userStr))
            } catch (e) { }
        }

        const fetchData = async () => {
            try {
                const statsRes = await api.get("/analytics/player")
                setStats(statsRes.data)

                const aiRes = await api.get("/analytics/ai-insights")
                // Axios usually parses JSON automatically. Check type before parsing.
                const rawInsights = aiRes.data;
                setAiInsights(typeof rawInsights === 'string' ? JSON.parse(rawInsights) : rawInsights)
            } catch (err) {
                console.error("Failed to fetch dashboard data", err)
                // If 401, redirect to login
                if ((err as any).response?.status === 401) {
                    router.push("/auth/login")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/auth/login")
    }

    const findMatch = () => {
        // For now, just generate a random Game ID or navigate to a matchmaking screen.
        // Let's create a game and go to it? Or find match?
        // User goal: "Game Lobby & Matchmaking: Create/join rooms"
        // We'll simplisticly assume "Find Match" -> "Matchmaking" -> "GameRoom"
        router.push("/matchmaking")
    }

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Command Center...</div>
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Command Dashboard
                        </h1>
                        <p className="text-gray-400 mt-2">Welcome back, Commander.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {currentUser?.role?.toLowerCase() === "admin" && (
                            <Button variant="outline" onClick={() => router.push("/admin")} className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                                <Shield className="mr-2 h-4 w-4" /> Admin Panel
                            </Button>
                        )}
                        <Button variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-white">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Quick Play */}
                        <Card className="bg-indigo-600 border-indigo-400/30 shadow-[0_0_30px_rgba(79,70,229,0.3)] relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer h-48 flex flex-col justify-center" onClick={findMatch}>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <CardHeader>
                                <CardTitle className="flex items-center text-3xl font-black text-white italic tracking-tighter">
                                    <Play className="mr-4 h-10 w-10 text-white fill-white animate-pulse" />
                                    INITIATE OPERATION
                                </CardTitle>
                                <CardDescription className="text-indigo-100 font-mono text-xs uppercase tracking-widest mt-2">
                                    Global Matchmaking Sequence: Ready
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Analytics Link */}
                            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-md hover:border-cyan-500/50 transition-all cursor-pointer group" onClick={() => router.push("/analytics")}>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-cyan-400 text-sm font-mono uppercase tracking-widest">
                                        <BarChart3 className="mr-3 h-5 w-5" /> Analytics Hub
                                    </CardTitle>
                                    <CardDescription className="text-gray-500 text-xs mt-1">Combat performance & AI intel.</CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Admin Link (Conditional) */}
                            {currentUser?.role?.toLowerCase() === "admin" && (
                                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md hover:border-purple-500/50 transition-all cursor-pointer group" onClick={() => router.push("/admin")}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-purple-400 text-sm font-mono uppercase tracking-widest">
                                            <Shield className="mr-3 h-5 w-5" /> Command Center
                                        </CardTitle>
                                        <CardDescription className="text-gray-500 text-xs mt-1">Manage players, rules & levels.</CardDescription>
                                    </CardHeader>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Stats Sidebar (Brief) */}
                    <div className="space-y-6">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-md border-l-4 border-l-emerald-500">
                            <CardHeader>
                                <CardTitle className="flex items-center text-gray-200 text-xs font-mono uppercase tracking-widest">
                                    Live Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-gray-500 font-mono uppercase">Skill Rating</span>
                                    <span className="text-3xl font-black text-white leading-none">{stats?.skillRating || 1000}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-gray-500 font-mono uppercase">Win Velocity</span>
                                    <span className="text-2xl font-bold text-emerald-500 leading-none">{stats?.winRate || 0}%</span>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <Button
                                        variant="link"
                                        className="text-cyan-400 p-0 h-auto text-xs font-mono uppercase tracking-widest hover:text-cyan-300"
                                        onClick={() => router.push("/analytics")}
                                    >
                                        View Deep Analysis →
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
