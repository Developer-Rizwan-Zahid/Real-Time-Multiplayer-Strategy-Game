"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Mail, Lock, Facebook, Instagram, Twitter } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await api.post("/auth/login", { email, password })
            const { token, id, username, role } = response.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify({ id, username, role }))

            if (role?.toLowerCase() === "admin") {
                router.push("/admin")
            } else {
                router.push("/dashboard")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Check credentials.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="border-[3px] border-indigo-500/30 bg-[#1a144e]/60 backdrop-blur-xl rounded-[2rem] p-4 shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                <CardHeader>
                    <CardTitle className="text-4xl text-center text-white font-bold tracking-tight uppercase">
                        Welcome
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative group">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white text-black h-14 rounded-full px-8 pr-14 placeholder:text-gray-400 border-none focus-visible:ring-4 focus-visible:ring-cyan-400/30 transition-all font-medium"
                                required
                            />
                            <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5 group-focus-within:text-cyan-600 transition-colors" />
                        </div>
                        <div className="relative group">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white text-black h-14 rounded-full px-8 pr-14 placeholder:text-gray-400 border-none focus-visible:ring-4 focus-visible:ring-cyan-400/30 transition-all font-medium"
                                required
                            />
                            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5 group-focus-within:text-cyan-600 transition-colors" />
                        </div>

                        <div className="flex justify-center gap-8 pt-2">
                            <Facebook className="w-5 h-5 text-cyan-400 hover:text-white cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-cyan-400 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 text-cyan-400 hover:text-white cursor-pointer transition-colors" />
                        </div>

                        {error && <p className="text-red-400 text-xs text-center font-mono">{error}</p>}

                        <div className="flex justify-center pt-2">
                            <Button
                                type="submit"
                                className="w-48 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.4)] border-none transition-all active:scale-95 translate-y-2"
                                disabled={loading}
                            >
                                {loading ? "..." : "Log In"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="justify-center pt-8">
                    <Link href="/auth/signup" className="text-[10px] text-gray-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">
                        Register, Here
                    </Link>
                </CardFooter>
            </Card>
            <p className="text-[10px] text-center text-gray-500 max-w-xs mx-auto leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nos agimus, immo vero, inquit, ad beatissimo.
            </p>
        </div>
    )
}
