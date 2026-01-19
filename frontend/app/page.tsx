"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Zap,
  BrainCircuit,
  Users,
  Target,
  Globe,
  ChevronRight,
  Lock,
  BarChart3,
  Trophy,
  Activity,
  Cpu,
  Radio,
  Sword
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Architecture */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] animate-pulse-slow lg:delay-1000"></div>
        <div className="absolute inset-0 tactical-grid opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 py-8 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">R-T MSG
</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">
           Login
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-white text-black hover:bg-cyan-400 font-bold px-6 border-0">
              Join The Game
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-32 px-4 max-w-7xl mx-auto text-center overflow-hidden">

        {/* Background Image Integration */}
        <div className="absolute inset-0 -z-10 opacity-30 scale-110 pointer-events-none">
          <img
            src="/tactical_hero_bg_1768812580645.png"
            alt="Tactical Background"
            className="w-full h-full object-cover rounded-[5rem] overflow-hidden"
            style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        {/* Decorative HUD Frame */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[85%] border border-cyan-500/10 pointer-events-none animate-in fade-in zoom-in duration-1000">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/40"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/40"></div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Radio className="h-3 w-3 animate-pulse" />
            LIVE LINK: COMMAND_CENTER_GLOBAL_V2
          </div>

          <h1 className="relative text-7xl md:text-[10rem] font-black tracking-tighter mb-8 leading-[0.8] uppercase italic animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <span className="block text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">Real-Time</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-shadow-glow filter drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">DOMINANCE</span>
          </h1>

          <p className="text-gray-400 font-mono text-sm md:text-base max-w-3xl mx-auto mb-16 uppercase tracking-[0.3em] leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 opacity-80 decoration-cyan-500/50 underline-offset-8 decoration-1 underline">
           Build a real-time multiplayer strategy game where players can join matches, compete with others, and track their performance with AI-powered insights
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link href="/auth/signup">
              <Button className="h-20 px-14 bg-cyan-500 hover:bg-cyan-400 text-black text-xl font-black italic tracking-tight group overflow-hidden relative shadow-[0_0_50px_rgba(6,182,212,0.3)] hover:shadow-[0_0_70px_rgba(6,182,212,0.5)] transition-all">
                <span className="relative z-10 flex items-center gap-3 uppercase">
                  Register <ChevronRight className="group-hover:translate-x-2 transition-transform h-6 w-6" />
                </span>
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-30deg]"></div>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="h-20 px-14 border-white/20 hover:bg-white/5 font-mono text-xs uppercase tracking-[0.4em] text-gray-300 hover:text-white backdrop-blur-md transition-all">
                Access Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Combat HUD Mini-Elements */}
        <div className="absolute left-[10%] top-1/3 p-4 border border-cyan-500/10 rounded-xl hidden xl:block animate-pulse-slow">
          <div className="text-[10px] text-cyan-500 font-mono">LATENCY</div>
          <div className="text-2xl font-black text-white italic tracking-tighter">12 MS</div>
        </div>
        <div className="absolute right-[10%] bottom-1/4 p-4 border border-purple-500/10 rounded-xl hidden xl:block animate-pulse-slow lg:delay-500">
          <div className="text-[10px] text-purple-500 font-mono">SECTOR_LOAD</div>
          <div className="text-2xl font-black text-white italic tracking-tighter">98.4%</div>
        </div>

        {/* Global Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto py-8 border-y border-white/5 animate-in fade-in duration-1000 delay-700">
          <div className="text-center group">
            <div className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">12.4K</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Commanders</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">850K+</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Operations Completed</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">12ms</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global Latency</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-black text-white group-hover:text-amber-400 transition-colors">Top 1%</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Skill Bracket</div>
          </div>
        </div>
      </main>

      {/* Tactical Units Showcase */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Combat Assets</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Scout Drone", icon: Radio, hue: "cyan", detail: "High-latency detection & intel." },
              { name: "Shock Trooper", icon: Zap, hue: "amber", detail: "Frontline offensive execution." },
              { name: "Guardian Gate", icon: Shield, hue: "indigo", detail: "Fortified sector defense." },
              { name: "AI Tactician", icon: BrainCircuit, hue: "purple", detail: "Predictive maneuver analysis." }
            ].map((unit, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group cursor-default">
                <unit.icon className={`h-10 w-10 text-${unit.hue}-400 mb-4 group-hover:scale-110 transition-transform`} />
                <h4 className="font-bold text-white uppercase italic text-sm mb-2">{unit.name}</h4>
                <p className="text-[11px] font-mono text-gray-500 leading-relaxed uppercase">{unit.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Roadmap Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-black italic uppercase tracking-tight mb-4">Strategic Roadmap</h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Upcoming Command Protocols & Feature Deployments</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-[50%] left-0 w-full h-[1px] bg-white/5 -z-10"></div>

          {[
            { stage: "Q1 2026", title: "Global Shards", desc: "Cross-region matchmaking & tournament frameworks.", status: "Active" },
            { stage: "Q2 2026", title: "Faction Wars", desc: "Clan-based sector control & resource dominance.", status: "Development" },
            { stage: "Q3 2026", title: "Neural Link v2", desc: "Advanced AI prediction models & VR command support.", status: "Research" }
          ].map((step, i) => (
            <div key={i} className="relative group">
              <div className="w-12 h-12 rounded-full bg-black border-2 border-white/20 flex items-center justify-center mb-6 mx-auto group-hover:border-cyan-500 transition-colors">
                <div className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-cyan-500 group-hover:animate-ping"></div>
              </div>
              <div className="text-[10px] font-mono text-cyan-500 mb-2 uppercase tracking-[0.3em] font-bold">{step.stage}</div>
              <h4 className="text-xl font-black italic uppercase mb-2">{step.title}</h4>
              <p className="text-xs text-gray-500 font-mono uppercase leading-relaxed px-4">{step.desc}</p>
              <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-gray-400 group-hover:text-white transition-colors uppercase">
                Status: {step.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hall of Fame (Testimonials) */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-12 flex items-center gap-4">
            <Trophy className="h-6 w-6 text-amber-400" /> Commander Decoded
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-white/5 bg-black/40 backdrop-blur-md rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Target className="h-32 w-32" /></div>
              <p className="text-xl font-medium text-gray-300 italic mb-8 relative z-10">
                "The tactical depth here is unparalleled. Real-time executions feel surgical, and the AI insights have completely changed how I approach sector control."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                <div>
                  <h5 className="font-bold uppercase text-xs">Vanguard_Zero</h5>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Rank: Grand Commander</p>
                </div>
              </div>
            </div>
            <div className="p-8 border border-white/5 bg-black/40 backdrop-blur-md rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="h-32 w-32" /></div>
              <p className="text-xl font-medium text-gray-300 italic mb-8 relative z-10">
                "Dominating global shards isn't just about speed; it's about strategy. Tactical Command provides the perfect platform for elite-level play."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500"></div>
                <div>
                  <h5 className="font-bold uppercase text-xs">Ghost_Protocol</h5>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Rank: Tactical Elite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 rounded-[3rem] p-16 text-center shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

          <div className="relative z-10">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-8 backdrop-blur-md group-hover:scale-110 transition-transform">
              <Sword className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 italic uppercase leading-none">Your Command <br /> Awaits</h2>
            <p className="text-white/80 font-mono text-sm uppercase tracking-[0.3em] mb-12 max-w-sm mx-auto leading-relaxed">
              Join the global network. Secure your dominance.
            </p>
            <Link href="/auth/signup">
              <Button className="h-20 px-16 bg-white text-black text-xl font-black italic tracking-tight hover:bg-cyan-400 hover:text-black transition-all border-0 shadow-2xl">
                INITIALIZE REGISTRATION
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="relative z-10 py-16 border-t border-white/5 text-center">
        <div className="flex justify-center gap-12 mb-8 opacity-40">
          {["Protocol", "Security", "Shards", "API"].map((link, i) => (
            <a key={i} href="#" className="text-[10px] font-mono uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors">{link}</a>
          ))}
        </div>
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em]">
          Tactical Command System © 2026 | Encrypted Data Link Active
        </p>
      </footer>
    </div>
  )
}
