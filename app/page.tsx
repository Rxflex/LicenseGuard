import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, Zap, Lock, Activity } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">LicenseGuard</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/check" className="text-zinc-400 hover:text-[#f97316] transition-colors">
                Check License
              </Link>
              <Link href="/login">
                <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <div className="animate-fade-in">
              <h1 className="text-7xl font-bold mb-6 leading-tight">
                Secure License
                <br />
                <span className="text-[#f97316]">Management</span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Professional license verification and management platform with advanced security features and real-time
                monitoring
              </p>
            </div>

            <div className="flex justify-center space-x-4 pt-8">
              <Link href="/check">
                <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 orange-glow">
                  <Shield className="mr-2 h-5 w-5" />
                  Check License
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#f97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Advanced Security</h3>
              <p className="text-zinc-400 leading-relaxed">
                Military-grade encryption with IP restrictions and real-time threat detection for maximum protection
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#f97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time Monitoring</h3>
              <p className="text-zinc-400 leading-relaxed">
                Live tracking of license usage with detailed analytics and comprehensive reporting dashboard
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#f97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-zinc-400 leading-relaxed">
                Sub-millisecond response times with global CDN and edge computing infrastructure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-5xl font-bold text-[#f97316]">99.9%</div>
              <div className="text-zinc-400 text-lg">Uptime</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-[#f97316]">&lt;50ms</div>
              <div className="text-zinc-400 text-lg">Response Time</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-[#f97316]">256-bit</div>
              <div className="text-zinc-400 text-lg">Encryption</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-[#f97316]">24/7</div>
              <div className="text-zinc-400 text-lg">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-[#09090b]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#f97316] rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">LicenseGuard</span>
            </div>
            <div className="text-zinc-400 text-sm">© 2024 LicenseGuard. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
