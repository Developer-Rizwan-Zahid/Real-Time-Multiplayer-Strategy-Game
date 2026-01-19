"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    BarChart3,
    BrainCircuit,
    TrendingUp,
    History,
    Target,
    Zap,
    ArrowLeft,
    Loader2,
    Trophy,
    Activity
} from "lucide-react"

export default function AnalyticsDashboard() {
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [aiInsights, setAiInsights] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, aiRes] = await Promise.all([
                    api.get("/analytics/player"),
                    api.get("/analytics/ai-insights")
                ])
                setStats(statsRes.data)

                const rawInsights = aiRes.data;
                setAiInsights(typeof rawInsights === 'string' ? JSON.parse(rawInsights) : rawInsights)
            } catch (err) {
                console.error("Failed to fetch analytics", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-cyan-500 animate-spin" />
                <div className="text-cyan-400 font-mono animate-pulse uppercase tracking-[0.3em]">Processing Combat Data...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-10 tactical-grid overflow-x-hidden">
            <div className="max-w-6xl mx-auto space-y-10 relative">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-8 w-8 text-cyan-400" />
                            <h1 className="text-4xl font-black tracking-tighter">ANALYTICS HUB</h1>
                        </div>
                        <p className="text-cyan-500/60 font-mono text-xs uppercase tracking-widest">Global Performance & Strategic Insights</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                        className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Returns to Dashboard
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Performance Metrics */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Trophy className="h-24 w-24 text-cyan-400" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xs font-mono text-cyan-500/70 uppercase tracking-widest">Combat Win Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-6xl font-black text-white mb-2">{stats?.winRate || 0}%</div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-cyan-500 h-full shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-1000"
                                            style={{ width: `${stats?.winRate || 0}%` }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity className="h-24 w-24 text-purple-400" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xs font-mono text-purple-500/70 uppercase tracking-widest">Skill Evaluation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-6xl font-black text-white mb-2">{stats?.skillRating || 1000}</div>
                                    <div className="text-xs font-mono text-purple-400 flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3" /> RANKING: COMMANDER CLASS
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Encounter History */}
                        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <History className="h-5 w-5 text-gray-400" /> MISSION ARCHIVE
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-around py-8 border-y border-white/5">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-emerald-500">{stats?.wins || 0}</div>
                                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Victories</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-red-500">{stats?.losses || 0}</div>
                                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Defeats</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-gray-400">{stats?.draws || 0}</div>
                                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Stalemates</div>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-3 text-xs text-gray-500 font-mono bg-white/5 p-4 rounded-lg">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    TOTAL OPERATIONS CONDUCTED: {stats?.matchesPlayed || 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* AI Strategic Intel */}
                    <div className="space-y-8">
                        <Card className="bg-cyan-500/5 border-cyan-500/30 backdrop-blur-xl h-full border-t-4 border-t-cyan-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-cyan-400">
                                    <BrainCircuit className="h-6 w-6" /> AI STRATEGIC INTEL
                                </CardTitle>
                                <CardDescription className="text-cyan-500/50 italic">Neural Network Tactical Analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-mono text-cyan-500/70 border-b border-cyan-500/20 pb-1 block uppercase tracking-widest">Win Probability Projection</label>
                                    <div className="flex items-end gap-2">
                                        <div className="text-5xl font-black text-cyan-400">{(aiInsights?.winProbability * 100).toFixed(1)}%</div>
                                        <div className="text-xs text-cyan-500/60 mb-2 font-mono">CONFIDENCE HIGH</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-mono text-cyan-500/70 border-b border-cyan-500/20 pb-1 block uppercase tracking-widest">Recommended Scenario</label>
                                    <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/10">
                                        <div className="text-xl font-bold text-white mb-1">Target Skill: {aiInsights?.recommendedOpponentSkill}</div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-mono">Opponents in this bracket provide optimal growth potential for current tactics.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-mono text-cyan-500/70 border-b border-cyan-500/20 pb-1 block uppercase tracking-widest">Tactical Advisories</label>
                                    <p className="text-sm text-cyan-100 leading-relaxed italic border-l-2 border-cyan-500 pl-4 py-2 bg-cyan-500/5">
                                        "{aiInsights?.strategyTips || "Insufficient data for detailed advisory. Participate in more engagements."}"
                                    </p>
                                </div>

                                <div className="pt-6">
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/50">
                                        <Target className="h-3 w-3" /> ENCRYPTED DATA LINK ACTIVE
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>

            </div>
        </div>
    )
}
