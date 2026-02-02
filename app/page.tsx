
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import connectDB from "@/lib/db";
import Course from "@/models/Course";

async function getFeaturedCourses() {
  await connectDB();
  const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 }).limit(3);
  return JSON.parse(JSON.stringify(courses));
}

export default async function Home() {
  const courses = await getFeaturedCourses();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
           {/* Background decorative elements */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/50 rounded-full blur-3xl mix-blend-multiply filter opacity-30 animate-blob"></div>
              <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl mix-blend-multiply filter opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200/50 rounded-full blur-3xl mix-blend-multiply filter opacity-30 animate-blob animation-delay-4000"></div>
           </div>

          <div className="container px-4 flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-sm font-medium text-slate-300 shadow-sm shadow-indigo-500/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              Next-Gen Assessment Platform
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white max-w-4xl leading-tight">
              Validate your skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Precision</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-slate-400 text-lg sm:text-xl leading-relaxed">
              Seamlessly evaluate your expertises, take secure online assessments, and get instant certified results for your dream professional courses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto bg-white hover:bg-slate-200 text-black shadow-lg shadow-white/10 transition-all hover:scale-105">
                  Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto bg-transparent hover:bg-zinc-900 border-zinc-700 text-slate-200 shadow-sm">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="container px-4 py-16">
           <div className="flex items-center justify-between mb-10">
              <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white">Featured Courses</h2>
                  <p className="text-slate-400 mt-2">Explore our most popular assessments.</p>
              </div>
              <Link href="/courses" className="hidden md:block">
                  <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-zinc-900">View all courses <ArrowRight className="ml-2 h-4 w-4"/></Button>
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course: any) => (
                <Card key={course._id} className="group flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300 border-zinc-800 overflow-hidden bg-zinc-900/80 backdrop-blur rounded-2xl">
                    <div className="h-48 bg-black/40 relative group-hover:scale-105 transition-transform duration-500 border-b border-zinc-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                            <Zap className="h-12 w-12 text-indigo-400" />
                        </div>
                        <div className="absolute top-4 right-4">
                             <span className="bg-zinc-900/90 backdrop-blur text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-zinc-700">
                                 {course.duration}
                             </span>
                        </div>
                    </div>
                    <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-1 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {course.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <p className="text-slate-400 mb-6 line-clamp-2 leading-relaxed flex-1">
                            {course.description}
                        </p>
                        <Link href={`/courses/${course._id}`} className="w-full">
                            <Button className="w-full bg-zinc-950 border border-zinc-800 hover:border-indigo-500 hover:text-indigo-400 text-slate-300 transition-all font-semibold">
                                View Details
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
              ))}
           </div>
           
           <div className="mt-8 text-center md:hidden">
              <Link href="/courses">
                  <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-zinc-900 w-full">View all courses <ArrowRight className="ml-2 h-4 w-4"/></Button>
              </Link>
           </div>
        </section>

        {/* Features Grid */}
        <section className="container px-4 py-24">
           <div className="bg-zinc-900/50 border border-zinc-800 text-white rounded-3xl p-8 md:p-16 relative overflow-hidden">
               {/* Abstract pattern */}
               <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
               
               <div className="relative z-10 text-center mb-16 max-w-2xl mx-auto">
                   <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EduQualify?</h2>
                   <p className="text-slate-400 text-lg">We provide a robust platform for verifying skills with speed and accuracy.</p>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="bg-black/20 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="mb-4 h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Time-Bound Tests</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Experience real-time assessments with secure countdown timers and auto-submission logic.
                    </p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="mb-4 h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Instant Results</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Get immediate feedback on your performance with detailed analytics and eligibility status.
                    </p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="mb-4 h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Role-based access control and encrypted data handling ensure your assessments are fair and private.
                    </p>
                </div>
              </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 bg-black py-12">
        <div className="container px-4 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-xl text-white">EduQualify</span>
           </div>
           <p className="text-center text-sm text-slate-500">
             © 2026 EduQualify Inc. All rights reserved.
           </p>
           <div className="flex gap-6 text-sm">
              <Link href="#" className="text-slate-500 hover:text-white">Privacy</Link>
              <Link href="#" className="text-slate-500 hover:text-white">Terms</Link>
              <Link href="#" className="text-slate-500 hover:text-white">Support</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
