import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl transition-transform group-hover:scale-110 duration-300">⚡</span>
          <span className="font-bold text-2xl text-white tracking-tight group-hover:text-indigo-400 transition-colors">EduQualify</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/courses" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Courses
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
             How it Works
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href={session.role === 'admin' ? "/admin" : "/dashboard"}>
               <Button className="font-semibold bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 shadow-sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-zinc-800/50">Log in</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-black hover:bg-slate-200 font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
