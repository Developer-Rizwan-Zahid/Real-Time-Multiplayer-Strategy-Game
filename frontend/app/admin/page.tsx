"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Users,
    Settings,
    Layers,
    Ban,
    CheckCircle,
    Plus,
    Save,
    Loader2,
    ShieldAlert,
    TrendingUp,
    LogOut
} from "lucide-react"

export default function AdminPage() {
    const router = useRouter()
    const [players, setPlayers] = useState<any[]>([])
    const [rules, setRules] = useState<any[]>([])
    const [levels, setLevels] = useState<any[]>([])
    const [newLevel, setNewLevel] = useState({ name: "", difficulty: "Medium", config: "{}" })
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("players")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        console.log("Admin Page - Current User:", user)
        if (user.role?.toLowerCase() !== "admin") {
            router.push("/dashboard")
            return
        }
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [pRes, rRes, lRes] = await Promise.all([
                api.get("/admin/players"),
                api.get("/admin/rules"),
                api.get("/admin/levels")
            ])
            setPlayers(pRes.data)
            setRules(rRes.data)
            setLevels(lRes.data)
        } catch (error: any) {
            console.error("Failed to fetch admin data", error)
            if (error.response?.status === 403) {
                setError("ACCESS DENIED: Your account does not have Admin privileges in the backend.")
            } else {
                setError("SYSTEM ERROR: Failed to reach command center. Check backend connectivity.")
            }
        } finally {
            setLoading(false)
        }
    }

    const toggleBan = async (id: number, currentStatus: boolean) => {
        try {
            const endpoint = currentStatus ? "unban" : "ban"
            await api.post(`/admin/players/${id}/${endpoint}`)
            fetchData()
        } catch (error) {
            console.error("Failed to toggle ban", error)
        }
    }

    const saveRule = async (rule: any) => {
        try {
            await api.post("/admin/rules", rule)
            alert("Rule updated successfully")
            fetchData()
        } catch (error) {
            console.error("Failed to save rule", error)
        }
    }

    const addLevel = async () => {
        try {
            await api.post("/admin/levels", newLevel)
            setNewLevel({ name: "", difficulty: "Medium", config: "{}" })
            fetchData()
        } catch (error) {
            console.error("Failed to add level", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
                <div className="text-purple-400 font-mono animate-pulse">AUTHORIZING ADMIN ACCESS...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans tactical-grid">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center bg-purple-950/20 border border-purple-500/20 p-8 rounded-2xl backdrop-blur-md">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
                            <ShieldAlert className="h-10 w-10 text-purple-500" /> COMMAND CENTER
                        </h1>
                        <p className="text-gray-400 font-mono text-xs mt-2 uppercase tracking-widest">
                            System Administrator: {JSON.parse(localStorage.getItem("user") || "{}").username}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 text-gray-400"
                        onClick={() => router.push("/dashboard")}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Exit Admin
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-mono text-gray-500 uppercase tracking-widest">Total Personnel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{players.length}</div>
                            <div className="text-[10px] text-emerald-500 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" /> CORE STABILITY OPTIMAL
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-mono text-gray-500 uppercase tracking-widest">Active Protocols</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{rules.length}</div>
                            <div className="text-[10px] text-purple-400 flex items-center mt-1 uppercase">Standard Rulesets</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-mono text-gray-500 uppercase tracking-widest">Sector Maps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{levels.length}</div>
                            <div className="text-[10px] text-cyan-400 flex items-center mt-1 uppercase">Battlefield Deployments</div>
                        </CardContent>
                    </Card>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 p-6 rounded-xl animate-in zoom-in duration-300">
                        <div className="flex items-center gap-3 text-red-500 font-bold mb-2">
                            <ShieldAlert className="h-6 w-6" /> ACCESS RESTRICTED
                        </div>
                        <p className="text-gray-300 text-sm">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={fetchData}
                        >
                            Retry Connection
                        </Button>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex gap-4 border-b border-white/5 pb-px">
                    {[
                        { id: "players", label: "Personnel", icon: Users },
                        { id: "rules", label: "Protocols", icon: Settings },
                        { id: "levels", label: "Sectors", icon: Layers }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-xs font-mono uppercase tracking-widest transition-all relative ${activeTab === tab.id ? "text-purple-400" : "text-gray-500 hover:text-white"
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_#a855f7]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === "players" && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            {players.map(player => (
                                <div key={player.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${player.isBanned ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                                            <Users className={`h-6 w-6 ${player.isBanned ? 'text-red-500' : 'text-emerald-500'}`} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{player.username}</div>
                                            <div className="text-xs text-gray-500 font-mono">{player.email} | ID: {player.id}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-500 font-mono uppercase">Rating</div>
                                            <div className="text-lg font-black text-cyan-400">{player.skillRating}</div>
                                        </div>
                                        <Button
                                            variant={player.isBanned ? "default" : "destructive"}
                                            className={player.isBanned ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600/20 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white"}
                                            onClick={() => toggleBan(player.id, player.isBanned)}
                                        >
                                            {player.isBanned ? <><CheckCircle className="mr-2 h-4 w-4" /> Restore Access</> : <><Ban className="mr-2 h-4 w-4" /> Restrict Access</>}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "rules" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                            {rules.map(rule => (
                                <Card key={rule.id} className="bg-black/40 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-mono text-purple-400 uppercase tracking-widest">{rule.name}</CardTitle>
                                        <CardDescription className="text-xs text-gray-500">Current Value: {rule.value}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex gap-4">
                                        <Input
                                            defaultValue={rule.value}
                                            onChange={(e) => rule.value = e.target.value}
                                            className="bg-black/50 border-white/10 text-white font-mono"
                                        />
                                        <Button onClick={() => saveRule(rule)} className="bg-purple-600 hover:bg-purple-700">
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === "levels" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Add Level Form */}
                            <Card className="bg-purple-950/10 border-purple-500/20">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Plus className="h-5 w-5 text-purple-400" /> New Sector Deployment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        placeholder="Level Name"
                                        value={newLevel.name}
                                        onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                    <select
                                        className="bg-black/50 border border-white/10 text-white rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        value={newLevel.difficulty}
                                        onChange={(e) => setNewLevel({ ...newLevel, difficulty: e.target.value })}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                        <option>Extreme</option>
                                    </select>
                                    <Button onClick={addLevel} className="bg-purple-600 hover:bg-purple-700">
                                        Deploy Sector
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Level List */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {levels.map(level => (
                                    <div key={level.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                            <Layers className="h-10 w-10 text-cyan-500" />
                                        </div>
                                        <div className="text-xs font-mono text-cyan-400 mb-1">{level.difficulty.toUpperCase()}</div>
                                        <div className="font-bold text-lg mb-4">{level.name}</div>
                                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                                            <span>STATUS: ONLINE</span>
                                            <span>ID: {level.id}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
