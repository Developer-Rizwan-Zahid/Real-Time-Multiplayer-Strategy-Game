"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Swords } from "lucide-react"

export default function LobbyRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    // Unwrap params using React.use()
    const { roomId } = use(params)

    const router = useRouter()
    const [room, setRoom] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get current user from local storage
        const userStr = localStorage.getItem("user")
        if (userStr && userStr !== "undefined") {
            try {
                setCurrentUser(JSON.parse(userStr))
            } catch (e) {
                console.error("Invalid user data in storage", e)
            }
        }

        const fetchRoom = async () => {
            try {
                const res = await api.get(`/lobby/${roomId}`)
                setRoom(res.data)

                // Check if game started (room inactive usually means game started in our logic)
                // Or if we are in this room.

                // logic: If I am host and guest is here -> Button "Start Game"
                // If I am guest and room is active -> Wait
                // If room is NOT active -> Game might have started. Check if game exists for this room?
                // Actually our backend: StartGame converts room.IsActive = false.

                if (!res.data.isActive) {
                    // Room closed. Either game started or host left.
                    // How do we get the gameId? 
                    // Backend logic flaw: StartGame returns Game object, but polling Client doesn't get it.
                    // For MVP, we can try to find the game where we are a player and it is active.
                    // api.get('/analytics/player') gets finished games.
                    // We might need to "Search Active Game".

                    // Hack for MVP: "Start Game" returns GameID. Host gets it.
                    // Guest needs to poll "FindMyActiveGame".

                    checkActiveGame()
                }

            } catch (error) {
                console.error("Error fetching room", error)
                // router.push('/matchmaking') // Don't redirect immediately to avoid loops on error
            } finally {
                setLoading(false)
            }
        }

        const interval = setInterval(fetchRoom, 2000)
        return () => clearInterval(interval)
    }, [roomId])

    const checkActiveGame = async () => {
        try {
            const res = await api.get("/game/current")
            if (res.data && res.data.id) {
                router.push(`/game/${res.data.id}`)
            }
        } catch (e) {
            // Not found is fine, game hasn't started or we aren't in one.
        }
    }

    const startGame = async () => {
        try {
            const res = await api.post("/game/start", { roomId: parseInt(roomId) })
            const game = res.data
            router.push(`/game/${game.id}`)
        } catch (error) {
            console.error("Failed to start", error)
        }
    }

    if (loading || !room || !currentUser) return <div className="p-8 text-white">Connecting to secure frequency...</div>

    const isHost = room.hostPlayerId === currentUser.id
    const hasGuest = !!room.guestPlayerId

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="max-w-md w-full bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-cyan-400">{room.roomName}</CardTitle>
                    <CardDescription>Lobby ID: {roomId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center bg-black/30 p-4 rounded border border-white/5">
                        <div>
                            <div className="text-xs text-gray-500">HOST</div>
                            <div className="font-bold text-indigo-400">Player {room.hostPlayerId}</div>
                        </div>
                        <div className="text-xs text-gray-600">VS</div>
                        <div>
                            <div className="text-xs text-gray-500 text-right">CHALLENGER</div>
                            <div className={`font-bold text-right ${hasGuest ? 'text-green-400' : 'text-gray-600'}`}>
                                {hasGuest ? `Player ${room.guestPlayerId}` : 'Waiting...'}
                            </div>
                        </div>
                    </div>

                    {isHost ? (
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-500"
                            disabled={!hasGuest}
                            onClick={startGame}
                        >
                            {hasGuest ? <><Swords className="mr-2 h-4 w-4" /> Start Operation</> : <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Waiting for Challenger</>}
                        </Button>
                    ) : (
                        <div className="text-center space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyan-400" />
                            <p className="text-sm text-gray-400">Waiting for Host to start operation...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
