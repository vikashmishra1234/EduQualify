import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TestResultPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ score: string; passed: string }> 
}) {
  const { score, passed } = await searchParams;
  const isPassed = passed === 'true';

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background Glow */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 blur-[150px] pointer-events-none ${isPassed ? 'bg-green-900/10' : 'bg-red-900/10'}`} />

      <div className="container px-4 py-12 mx-auto flex-1 flex flex-col items-center justify-center relative z-10">
        <Card className={`max-w-md w-full bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/50 overflow-hidden border-t-8 ${isPassed ? 'border-t-emerald-500' : 'border-t-rose-500'}`}>
            <CardHeader className="text-center pt-10 pb-2">
                <div className="mx-auto mb-6 relative">
                    {/* Icon Glow */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 blur-xl rounded-full ${isPassed ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}></div>
                    
                    <div className="relative">
                        {isPassed ? (
                            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                        ) : (
                            <XCircle className="w-24 h-24 text-rose-500" />
                        )}
                    </div>
                </div>
                <CardTitle className="text-3xl font-extrabold text-white mb-2">
                    {isPassed ? 'Congratulations!' : 'Not Qualified'}
                </CardTitle>
                <p className="text-slate-400 text-lg">
                    {isPassed 
                        ? 'You are eligible for this course.' 
                        : 'You did not meet the criteria.'
                    }
                </p>
            </CardHeader>
            <CardContent className="text-center space-y-6 px-8 pb-8">
                <div className="py-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Your Score</span>
                    <div className={`text-5xl font-black mt-2 ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>{score}</div>
                </div>
                 {isPassed ? (
                    <div className="bg-emerald-900/20 text-emerald-300 p-4 rounded-xl text-sm border border-emerald-900/50 leading-relaxed">
                        Great job! You can now proceed with your course application. We've sent the details to your email.
                    </div>
                ) : (
                    <div className="bg-rose-900/10 text-rose-300 p-4 rounded-xl text-sm border border-rose-900/30 leading-relaxed">
                        Don't worry! You can retake this assessment after reviewing the course prerequisites more thoroughly.
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 p-8 border-t border-zinc-800 bg-zinc-950/30">
                <Link href="/dashboard" className="w-full">
                    <Button className={`w-full h-12 text-lg font-bold shadow-lg transition-transform hover:scale-[1.02] ${isPassed ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25' : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'}`}>
                        Back to Dashboard
                    </Button>
                </Link>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
