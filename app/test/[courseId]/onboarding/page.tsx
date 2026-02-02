import Link from 'next/link';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound, redirect } from 'next/navigation';
import { getSession } from "@/lib/auth";

export default async function OnboardingPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/login?callbackUrl=/test/${courseId}/onboarding`);
  }

  await connectDB();
  
  let course;
  try {
    course = await Course.findById(courseId).lean();
  } catch (error) {
    return notFound();
  }

  if (!course) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <div className="container px-4 py-12 mx-auto flex-1 flex flex-col items-center justify-center relative z-10">
        <Card className="max-w-2xl w-full bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/50">
            <CardHeader className="text-center border-b border-zinc-800 pb-8 bg-zinc-950/30">
                <CardTitle className="text-3xl font-bold text-white mb-3">Eligibility Assessment</CardTitle>
                <div className="text-slate-400 text-lg">For course: <span className="font-bold text-indigo-400">{course.title}</span></div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-xl text-white">Instructions:</h3>
                    <ul className="list-disc pl-5 space-y-3 text-slate-300 leading-relaxed text-base">
                        <li>This test consists of multiple-choice questions related to <span className="text-white font-medium">{course.title}</span>.</li>
                        <li>You will have <span className="text-white font-medium">15 minutes</span> to complete the assessment.</li>
                        <li>Ensure you have a stable internet connection before starting.</li>
                        <li>Do not refresh the page during the test, or your progress may be lost.</li>
                        <li>Results will be calculated immediately upon submission.</li>
                    </ul>
                </div>
                
                <div className="bg-amber-900/20 text-amber-200 p-4 rounded-xl text-sm border border-amber-900/50 flex gap-3 items-start">
                    <span className="text-lg">⚠️</span>
                    <p className="leading-relaxed"><strong>Important:</strong> Passing this assessment confirms your eligibility for the course. You may retake it if you do not pass, but we recommend reviewing the materials first.</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-zinc-950/30 p-8 border-t border-zinc-800">
                <Link href={`/courses/${courseId}`}>
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-zinc-800">Cancel</Button>
                </Link>
                <Link href={`/test/${courseId}/start`}>
                     <Button size="lg" className="px-8 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-0 transition-transform hover:scale-[1.02]">
                        Start Assessment
                     </Button>
                </Link>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
