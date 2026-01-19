"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { User, Mail, Lock, Facebook, Instagram, Twitter } from "lucide-react"

export default function SignupPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("Player")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await api.post("/auth/register", { username, email, password, role })
            router.push("/auth/login")
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="border-[3px] border-purple-500/30 bg-[#1a144e]/60 backdrop-blur-xl rounded-[2rem] p-4 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                <CardHeader>
                    <CardTitle className="text-4xl text-center text-white font-bold tracking-tight uppercase">
                        Join
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="relative group">
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-white text-black h-12 rounded-full px-8 pr-14 placeholder:text-gray-400 border-none focus-visible:ring-4 focus-visible:ring-purple-400/30 transition-all font-medium"
                                required
                            />
                            <User className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
                        </div>
                        <div className="relative group">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white text-black h-12 rounded-full px-8 pr-14 placeholder:text-gray-400 border-none focus-visible:ring-4 focus-visible:ring-purple-400/30 transition-all font-medium"
                                required
                            />
                            <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
                        </div>
                        <div className="relative group">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white text-black h-12 rounded-full px-8 pr-14 placeholder:text-gray-400 border-none focus-visible:ring-4 focus-visible:ring-purple-400/30 transition-all font-medium"
                                required
                            />
                            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
                        </div>

                        <div className="space-y-2 px-2">
                            <div className="flex justify-center gap-4">
                                <Button
                                    type="button"
                                    onClick={() => setRole("Player")}
                                    className={`flex-1 h-10 rounded-full border transition-all text-[10px] font-black tracking-widest uppercase ${role === "Player"
                                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                                            : "bg-transparent border-white/5 text-gray-500 hover:border-white/20"
                                        }`}
                                >
                                    Player
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setRole("Admin")}
                                    className={`flex-1 h-10 rounded-full border transition-all text-[10px] font-black tracking-widest uppercase ${role === "Admin"
                                            ? "bg-purple-500/20 border-purple-500 text-purple-300"
                                            : "bg-transparent border-white/5 text-gray-500 hover:border-white/20"
                                        }`}
                                >
                                    Admin
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8 pt-2">
                            <Facebook className="w-5 h-5 text-purple-400 hover:text-white cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-purple-400 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 text-purple-400 hover:text-white cursor-pointer transition-colors" />
                        </div>

                        {error && <p className="text-red-400 text-xs text-center font-mono">{error}</p>}

                        <div className="flex justify-center pt-2">
                            <Button
                                type="submit"
                                className="w-48 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] border-none transition-all active:scale-95 translate-y-2"
                                disabled={loading}
                            >
                                {loading ? "..." : "Sign Up"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="justify-center pt-8">
                    <Link href="/auth/login" className="text-[10px] text-gray-400 hover:text-purple-400 uppercase tracking-widest transition-colors">
                        Authorized? Login
                    </Link>
                </CardFooter>
            </Card>
            <p className="text-[10px] text-center text-gray-500 max-w-xs mx-auto leading-relaxed">
                By enlisting, you agree to the deployment protocols and strategic terms of service.
            </p>
        </div>
    )
}
