import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, FileQuestion, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/dashboard'); // Redirect non-admins to normal dashboard
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/50 backdrop-blur border-r border-zinc-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
             <span className="text-indigo-500 text-2xl">⚡</span>
             EduAdmin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-zinc-800/50">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/courses">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-zinc-800/50">
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </Button>
          </Link>
          <Link href="/admin/questions">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-zinc-800/50">
              <FileQuestion className="mr-2 h-4 w-4" />
              Question Bank
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <form action={async () => {
              'use server';
              await logout();
            }}>
             <Button variant="outline" className="w-full justify-start border-zinc-800 bg-transparent text-slate-400 hover:text-red-400 hover:bg-red-950/30 hover:border-red-900/50 transition-all">
               <LogOut className="mr-2 h-4 w-4" />
               Sign Out
             </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
