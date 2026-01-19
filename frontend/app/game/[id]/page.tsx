"use client"

import { useEffect, useState, use, useRef } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Zap, Trophy, Timer, Shield, Sword, Activity, List, LogOut, Skull } from "lucide-react"
import { cn } from "@/lib/utils"

type Move = {
    id: number
    playerId: number
    moveData: string // JSON "{x: 0, y: 0}"
    createdAt: string
}

type GameState = {
    game: {
        id: number
        player1Id: number
        player2Id: number
        currentTurnPlayerId: number
        player1Score: number
        player2Score: number
        isFinished: boolean
        startedAt: string
        finishedAt?: string
    }
    moves: Move[]
}

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState(60)
    const lastTurnRef = useRef<number | null>(null)

    useEffect(() => {
        const userStr = localStorage.getItem("user")
        if (userStr && userStr !== "undefined") {
            try {
                setCurrentUser(JSON.parse(userStr))
            } catch (e) {
                console.error("Invalid user data in storage", e)
            }
        }

        fetchGame()
        const interval = setInterval(fetchGame, 1500)
        return () => clearInterval(interval)
    }, [id])

    // Timer Logic
    useEffect(() => {
        if (!gameState || gameState.game.isFinished) return

        if (lastTurnRef.current !== gameState.game.currentTurnPlayerId) {
            setTimeLeft(60) // Reset timer on turn change
            lastTurnRef.current = gameState.game.currentTurnPlayerId
        }

        const timerInterval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timerInterval)
    }, [gameState])

    const fetchGame = async () => {
        try {
            const res = await api.get(`/game/${id}`)
            setGameState(res.data)
            setLoading(false)
        } catch (error) {
            console.error("Fetch game failed", error)
        }
    }

    const makeMove = async (x: number, y: number) => {
        if (!gameState || !currentUser || gameState.game.isFinished) return
        if (gameState.game.currentTurnPlayerId !== currentUser.id) return

        const occupied = gameState.moves.some(m => {
            const d = JSON.parse(m.moveData)
            return d.x === x && d.y === y
        })
        if (occupied) return

        try {
            await api.post("/game/move", {
                gameId: gameState.game.id,
                moveData: JSON.stringify({ x, y })
            })
            fetchGame()
        } catch (error) {
            console.error("Move failed", error)
        }
    }

    const endGame = async () => {
        if (!confirm("Are you sure you want to surrender?")) return
        try {
            await api.post(`/game/end/${id}`)
            router.push('/dashboard')
        } catch (error) {
            console.error("End failed", error)
        }
    }

    if (loading || !gameState || !currentUser) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                <div className="text-indigo-400 font-mono animate-pulse">ESTABLISHING TACTICAL UPLINK...</div>
            </div>
        )
    }

    const board = Array(3).fill(null).map(() => Array(3).fill(null))
    gameState.moves.forEach(m => {
        try {
            const d = JSON.parse(m.moveData)
            board[d.x][d.y] = m.playerId
        } catch (e) { }
    })

    const isMyTurn = gameState.game.currentTurnPlayerId === currentUser.id
    const isP1 = currentUser.id === gameState.game.player1Id
    const opponentId = isP1 ? gameState.game.player2Id : gameState.game.player1Id
    const myScore = isP1 ? gameState.game.player1Score : gameState.game.player2Score
    const oppScore = isP1 ? gameState.game.player2Score : gameState.game.player1Score

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans tactical-grid overflow-hidden relative">
            {/* Background Scanner Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-indigo-500/20 absolute top-0 animate-scanner"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

                {/* Left Sidebar: Stats & Info */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-mono text-indigo-400 flex items-center gap-2">
                                <Shield className="h-4 w-4" /> DEFENSIVE STATUS
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-gray-400">ARMOR STRENGTH</span>
                                    <span className="text-indigo-400 font-mono">98%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[98%]" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-gray-400">TACTICAL EDGE</span>
                                    <span className="text-cyan-400 font-mono">{isMyTurn ? "HIGH" : "WAITING"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl shrink-0">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-mono text-emerald-400 flex items-center gap-2">
                                <Activity className="h-4 w-4" /> SYSTEM DIAGNOSTICS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-[10px] font-mono text-gray-500 space-y-1">
                            <div>&gt; SYNCING WITH CORE... OK</div>
                            <div>&gt; LATENCY: 24MS</div>
                            <div>&gt; ENCRYPTION: ACTIVE</div>
                            <div>&gt; PLAYER_LINK: STABLE</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Center: Main Game Board */}
                <div className="lg:col-span-6 space-y-6">
                    {/* Header HUD */}
                    <div className="flex justify-between items-center bg-indigo-950/20 border border-indigo-500/20 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>

                        <div className={cn("text-center transition-all", isMyTurn ? "scale-110 opacity-100" : "opacity-50")}>
                            <div className="text-[10px] text-indigo-400 font-mono mb-1">COMMANDER (YOU)</div>
                            <div className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{myScore}</div>
                        </div>

                        <div className="flex flex-col items-center px-8 border-x border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Timer className={cn("h-4 w-4", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-cyan-400")} />
                                <span className={cn("text-2xl font-mono font-bold tracking-widest", timeLeft < 10 ? "text-red-500" : "text-cyan-400")}>
                                    00:{timeLeft.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <div className="px-3 py-1 rounded bg-white/5 border border-white/10">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 text-uppercase">
                                    {gameState.game.isFinished ? "OPERATION COMPLETED" : isMyTurn ? "AWAITING INPUT" : "ENEMY MANEUVERING"}
                                </span>
                            </div>
                        </div>

                        <div className={cn("text-center transition-all", !isMyTurn ? "scale-110 opacity-100" : "opacity-50")}>
                            <div className="text-[10px] text-red-400 font-mono mb-1">ADVERSARY (P{opponentId})</div>
                            <div className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{oppScore}</div>
                        </div>
                    </div>

                    {/* Game Board Container */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative bg-black/60 p-8 rounded-3xl border border-white/10 backdrop-blur-2xl">
                            <div className="grid grid-cols-3 gap-6 aspect-square max-w-[450px] mx-auto">
                                {board.map((row, x) => row.map((cell: number | null, y: number) => (
                                    <button
                                        key={`${x}-${y}`}
                                        onClick={() => makeMove(x, y)}
                                        disabled={cell !== null || !isMyTurn || gameState.game.isFinished}
                                        className={cn(
                                            "relative rounded-xl flex items-center justify-center transition-all duration-300 group/tile",
                                            cell === null
                                                ? "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/50 cursor-pointer"
                                                : cell === currentUser.id
                                                    ? "bg-indigo-600/20 border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                                    : "bg-red-600/20 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
                                            !isMyTurn && cell === null && "cursor-not-allowed grayscale-[0.5]"
                                        )}
                                    >
                                        <div className="absolute top-1 left-1 text-[8px] text-white/20 font-mono">{x}-{y}</div>

                                        {cell === currentUser.id && (
                                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                                <Zap className="h-10 w-10 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                                                <span className="text-[8px] font-bold mt-1 text-indigo-300">LINKED</span>
                                            </div>
                                        )}

                                        {cell === opponentId && (
                                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                                <Shield className="h-10 w-10 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                                <span className="text-[8px] font-bold mt-1 text-red-400">HOSTILE</span>
                                            </div>
                                        )}

                                        {cell === null && isMyTurn && (
                                            <div className="opacity-0 group-hover/tile:opacity-100 transition-opacity">
                                                <Sword className="h-6 w-6 text-white/30" />
                                            </div>
                                        )}
                                    </button>
                                )))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-between items-center gap-4">
                        <Button
                            variant="outline"
                            className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 px-8 py-6 rounded-xl font-mono text-xs tracking-widest uppercase"
                            onClick={() => router.push('/dashboard')}
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Strategic Retreat
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-500/10 border border-red-500/50 hover:bg-red-500 text-red-500 hover:text-white px-8 py-6 rounded-xl font-mono text-xs tracking-widest uppercase transition-all"
                            onClick={endGame}
                            disabled={gameState.game.isFinished}
                        >
                            <Zap className="mr-2 h-4 w-4" /> Self Destruct
                        </Button>
                    </div>
                </div>

                {/* Right Sidebar: Combat Log */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl h-full flex flex-col">
                        <CardHeader className="pb-2 border-b border-white/5">
                            <CardTitle className="text-sm font-mono text-cyan-400 flex items-center gap-2">
                                <List className="h-4 w-4" /> COMBAT LOG
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 max-h-[500px]">
                            <div className="space-y-4 font-mono text-[10px]">
                                {[...gameState.moves].reverse().map((move, idx) => {
                                    const d = JSON.parse(move.moveData)
                                    const isMe = move.playerId === currentUser.id
                                    return (
                                        <div key={move.id} className={cn("border-l-2 pl-3 py-1", isMe ? "border-indigo-500 bg-indigo-500/5" : "border-red-500 bg-red-500/5")}>
                                            <div className="text-gray-500 mb-0.5">{new Date(move.createdAt).toLocaleTimeString()}</div>
                                            <div className={isMe ? "text-indigo-300" : "text-red-300"}>
                                                {isMe ? "CMD_UPLINK" : "ADVERSARY_DETECTED"}: Pos({d.x}, {d.y})
                                            </div>
                                        </div>
                                    )
                                })}
                                {gameState.moves.length === 0 && (
                                    <div className="text-gray-600 italic">... NO COMBAT DATA ...</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Victory/Defeat Overlay */}
            {gameState.game.isFinished && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
                    <div className={cn(
                        "text-center space-y-8 max-w-md w-full p-10 border-2 rounded-[3rem] shadow-2xl relative overflow-hidden",
                        myScore > oppScore ? "border-emerald-500/50 bg-emerald-950/20" :
                            myScore < oppScore ? "border-red-500/50 bg-red-950/20" :
                                "border-gray-500/50 bg-gray-900/40"
                    )}>
                        {/* Background Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="relative">
                            {myScore > oppScore ? (
                                <div className="space-y-4">
                                    <Trophy className="h-24 w-24 text-yellow-500 mx-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.6)] animate-bounce" />
                                    <h2 className="text-6xl font-black tracking-tighter text-emerald-400 italic">VICTORY</h2>
                                    <p className="text-emerald-500/60 font-mono text-[10px] uppercase tracking-widest leading-none">Objective Secured | Sector Liberated</p>
                                </div>
                            ) : myScore < oppScore ? (
                                <div className="space-y-4">
                                    <Skull className="h-24 w-24 text-red-500 mx-auto drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse" />
                                    <h2 className="text-6xl font-black tracking-tighter text-red-500 italic">DEFEATED</h2>
                                    <p className="text-red-500/60 font-mono text-[10px] uppercase tracking-widest leading-none">Mission Failure | Withdrawal Required</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Activity className="h-24 w-24 text-gray-400 mx-auto drop-shadow-[0_0_30px_rgba(156,163,175,0.6)]" />
                                    <h2 className="text-6xl font-black tracking-tighter text-gray-400 italic">STALEMATE</h2>
                                    <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest leading-none">System Deadlock | Tactical Equalizer</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-white/5 p-6 rounded-2xl border border-white/10 font-mono">
                            <div className="space-y-1">
                                <div className="text-[10px] text-gray-500 uppercase">You</div>
                                <div className="text-4xl font-black text-white">{myScore}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-gray-500 uppercase">Adversary</div>
                                <div className="text-4xl font-black text-white/40">{oppScore}</div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-16 bg-white text-black hover:bg-cyan-400 font-black text-lg italic tracking-tighter transition-all"
                            onClick={() => router.push('/dashboard')}
                        >
                            RETURN TO COMMAND BASE
                        </Button>

                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Protocol ID: {gameState.game.id}X-00</div>
                    </div>
                </div>
            )}
        </div>
    )
}
