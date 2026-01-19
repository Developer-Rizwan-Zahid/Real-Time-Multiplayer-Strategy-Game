"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Plus, ArrowRight } from "lucide-react"

export default function MatchmakingPage() {
    const router = useRouter()
    const [rooms, setRooms] = useState<any[]>([])
    const [newRoomName, setNewRoomName] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRooms()
        const interval = setInterval(fetchRooms, 3000) // Poll every 3 seconds
        return () => clearInterval(interval)
    }, [])

    const fetchRooms = async () => {
        try {
            const res = await api.get("/lobby/available")
            setRooms(res.data)
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch rooms", error)
        }
    }

    const createRoom = async () => {
        if (!newRoomName) return
        try {
            const res = await api.post("/lobby/create", { roomName: newRoomName })
            router.push(`/lobby/${res.data.id}`)
        } catch (error) {
            console.error("Failed to create room", error)
        }
    }

    const joinRoom = async (roomId: number) => {
        try {
            await api.post(`/lobby/join/${roomId}`)
            router.push(`/lobby/${roomId}`)
        } catch (error) {
            console.error("Failed to join", error)
            alert("Failed to join room. It might be full.")
            fetchRooms()
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    Global Lobby
                </h1>

                {/* Create Room */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>Create Operation</CardTitle>
                        <CardDescription>Start a new game room and wait for an opponent.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Input
                            placeholder="Room Name (e.g. 'Operation Alpha')"
                            value={newRoomName}
                            onChange={e => setNewRoomName(e.target.value)}
                            className="bg-black/50 border-white/20 text-white"
                        />
                        <Button onClick={createRoom} className="bg-green-600 hover:bg-green-700">
                            <Plus className="mr-2 h-4 w-4" /> Create Room
                        </Button>
                    </CardContent>
                </Card>

                {/* Available Rooms */}
                <div className="grid gap-4">
                    <h2 className="text-xl font-semibold text-gray-300 flex items-center">
                        <Users className="mr-2 h-5 w-5" /> Available Operations
                    </h2>
                    {rooms.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-white/10 rounded-lg text-gray-500">
                            No active rooms found. create one above.
                        </div>
                    ) : (
                        rooms.map(room => (
                            <Card key={room.id} className="bg-white/5 border-white/10 flex items-center justify-between p-4 hover:bg-white/10 transition-colors">
                                <div>
                                    <div className="font-bold text-lg text-cyan-400">{room.roomName}</div>
                                    <div className="text-xs text-gray-500">ID: {room.id}</div>
                                </div>
                                <Button onClick={() => joinRoom(room.id)} variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20">
                                    Join Mission <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
