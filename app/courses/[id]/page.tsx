import Link from 'next/link';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  
  let course;
  try {
    course = await Course.findById(id).lean();
  } catch (error) {
    return notFound();
  }

  if (!course) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Hero Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <div className="container px-4 py-8 md:py-12 mx-auto max-w-6xl relative z-10">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {course.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm">
                   <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-slate-300 font-medium">
                       <Clock className="w-4 h-4 mr-2 text-indigo-400"/> {course.duration}
                   </span>
                   <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-slate-300 font-medium">
                       <CheckCircle className="w-4 h-4 mr-2 text-emerald-400"/> Verified Certificate
                   </span>
                </div>
            </div>

            <div className="space-y-8">
                <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="h-6 w-1 bg-indigo-500 rounded-full"></span>
                        About this Course
                    </h3>
                    <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-base md:text-lg">
                        <p>{course.description}</p>
                    </div>
                </section>
                
                <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="h-6 w-1 bg-purple-500 rounded-full"></span>
                        Eligibility Criteria
                    </h3>
                     <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-base md:text-lg">
                        <p>{course.eligibilityCriteria}</p>
                    </div>
                </section>
            </div>
          </div>
          
          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/40 overflow-hidden relative group">
                    {/* Decorative Gradient Blob */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <h4 className="text-xl font-bold text-white mb-2">Ready to apply?</h4>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Check your eligibility instantly by taking our comprehensive assessment.
                        </p>
                        
                        <div className="space-y-3 mb-8">
                             <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="p-1 rounded-full bg-emerald-900/30 text-emerald-400"><CheckCircle className="w-3 h-3" /></div>
                                <span>15 Minute Assessment</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="p-1 rounded-full bg-emerald-900/30 text-emerald-400"><CheckCircle className="w-3 h-3" /></div>
                                <span>Instant Results</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="p-1 rounded-full bg-emerald-900/30 text-emerald-400"><CheckCircle className="w-3 h-3" /></div>
                                <span>Free of Cost</span>
                             </div>
                        </div>

                        <Link href={`/test/${course._id}/onboarding`} className="block w-full">
                            <Button className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all hover:scale-[1.02]">
                                Check Eligibility 
                                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                            </Button>
                        </Link>
                        
                        <p className="text-xs text-center text-slate-500 mt-4">
                            By starting, you agree to our terms of service.
                        </p>
                    </div>
                </div>
                
                {/* Optional Helper Card */}
                <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 flex gap-3 items-start">
                    <div className="bg-zinc-900 p-2 rounded-lg text-slate-400">
                        <Clock className="w-5 h-5"/> 
                    </div>
                    <div>
                        <h5 className="text-sm font-semibold text-slate-200">Need more time?</h5>
                        <p className="text-xs text-slate-500 mt-1">You can pause and resume the specific course materials later, but the test must be taken in one sitting.</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
