import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black selection:bg-indigo-500/30 relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-zinc-800/50 gap-2">
             <ArrowLeft className="h-4 w-4" />
             Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
             <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-white">
                <span className="text-indigo-500">⚡</span>
                EduQualify
             </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
