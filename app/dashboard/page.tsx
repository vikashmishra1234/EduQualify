import { getSession } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import connectDB from "@/lib/db";

import Attempt from "@/models/Attempt";
import Course from "@/models/Course";
import User from "@/models/User";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCertificate } from "@/components/DownloadCertificate";

async function getStudentAttempts(userId: string) {
  await connectDB();
  // Ensure Course model is registered
  if (!mongoose.models.Course) {
     mongoose.model('Course', Course.schema);
  }
  
  const attempts = await Attempt.find({ userId })
    .populate('courseId', 'title')
    .sort({ createdAt: -1 });
    
  return JSON.parse(JSON.stringify(attempts));
}

import mongoose from 'mongoose';

async function getAvailableCourses() {
  await connectDB();
  const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(courses));
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Double check if admin redirected here
  if (session.role === 'admin') {
      redirect('/admin');
  }

  // Fetch full user details to get name
  await connectDB();
  const user = await User.findById(session.userId);
  const studentName = user?.name || 'Student';

  const [attempts, courses] = await Promise.all([
    getStudentAttempts(session.userId as string),
    getAvailableCourses()
  ]);

  // Filter for unique passed courses
  const uniquePassedCourses = new Map();
  attempts.forEach((attempt: any) => {
      if (attempt.isPassed && !uniquePassedCourses.has(attempt.courseId._id)) {
           uniquePassedCourses.set(attempt.courseId._id, {
               course: attempt.courseId,
               score: attempt.score,
               total: attempt.totalQuestions,
               date: attempt.createdAt
           });
      }
  });
  
  const passedCourses = Array.from(uniquePassedCourses.values());

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-zinc-900/50 backdrop-blur p-6 rounded-2xl border border-zinc-800 shadow-sm">
          <div>
             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Hello, {studentName} 👋
             </h1>
             <p className="text-slate-400 mt-1">
               Welcome back to your learning dashboard.
             </p>
          </div>
          <form action={async () => {
            'use server';
            await logout();
          }}>
            <Button variant="outline" className="border-zinc-700 bg-transparent text-slate-300 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900 transition-colors w-full md:w-auto">
              Sign Out
            </Button>
          </form>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-purple-800 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
             </div>
             <CardHeader className="pb-2 z-10 relative">
               <CardTitle className="text-indigo-100 font-medium text-sm uppercase tracking-wider">Total Attempts</CardTitle>
             </CardHeader>
             <CardContent className="z-10 relative">
               <div className="text-4xl font-extrabold">{attempts.length}</div>
               <p className="text-indigo-100/80 text-xs mt-2 font-medium">Lifetime assessments taken</p>
             </CardContent>
          </Card>
           <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-600 to-teal-800 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
             </div>
             <CardHeader className="pb-2 z-10 relative">
               <CardTitle className="text-emerald-100 font-medium text-sm uppercase tracking-wider">Passed Tests</CardTitle>
             </CardHeader>
             <CardContent className="z-10 relative">
               <div className="text-4xl font-extrabold">
                 {attempts.filter((a: any) => a.isPassed).length}
               </div>
               <p className="text-emerald-100/80 text-xs mt-2 font-medium">Successful qualifications</p>
             </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-cyan-800 text-white overflow-hidden relative sm:col-span-2 lg:col-span-1">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
             </div>
             <CardHeader className="pb-2 z-10 relative">
               <CardTitle className="text-blue-100 font-medium text-sm uppercase tracking-wider">Courses</CardTitle>
             </CardHeader>
             <CardContent className="z-10 relative">
               <div className="text-4xl font-extrabold">{courses.length}</div>
               <p className="text-blue-100/80 text-xs mt-2 font-medium">Available for enrollment</p>
             </CardContent>
          </Card>
        </div>

         {/* My Eligibilities Section */}
         <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
             <h2 className="text-2xl font-bold text-white">
                My Eligibilities
             </h2>
             {passedCourses.length > 0 && (
               <span className="bg-emerald-900/50 text-emerald-400 border border-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                 {passedCourses.length}
               </span>
             )}
          </div>
          
          {passedCourses.length === 0 ? (
              <div className="bg-transparent border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
                  <div className="mx-auto h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">No Qualifications Yet</h3>
                  <p className="text-slate-400 mt-2 max-w-md mx-auto">
                    You haven&apos;t qualified for any courses yet. Take an assessment in the section below to prove your eligibility!
                  </p>
              </div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {passedCourses.map((item: any) => (
                      <Card key={item.course._id} className="group border border-zinc-800 shadow-sm hover:shadow-emerald-900/10 transition-all duration-300 bg-zinc-900/80 backdrop-blur overflow-hidden rounded-xl">
                              <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600 w-full" />
                              <CardHeader className="pb-3 pt-5">
                                  <div className="flex justify-between items-start">
                                     <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        {item.course.title}
                                     </CardTitle>
                                     <div className="bg-emerald-900/20 border border-emerald-900/30 p-1.5 rounded-full">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                         </svg>
                                     </div>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <div className="space-y-4">
                                      <div className="flex justify-between text-sm py-2 border-b border-zinc-800">
                                          <span className="text-slate-400">Status</span>
                                          <span className="font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-900/50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Eligible</span>
                                      </div>
                                      <div className="flex justify-between text-sm py-2 border-b border-zinc-800">
                                          <span className="text-slate-400">Score</span>
                                          <span className="font-semibold text-white">{item.score}/{item.total}</span>
                                      </div>
                                      <div className="flex justify-between text-sm py-2 border-b border-zinc-800">
                                          <span className="text-slate-400">Certified On</span>
                                          <span className="font-medium text-slate-300">{new Date(item.date).toLocaleDateString()}</span>
                                      </div>
                                      
                                      <div className="pt-4">
                                          <DownloadCertificate 
                                             courseTitle={item.course.title}
                                             studentName={studentName}
                                             date={new Date(item.date).toLocaleDateString()}
                                             score={`${item.score}/${item.total}`}
                                          />
                                      </div>
                                  </div>
                              </CardContent>
                      </Card>
                  ))}
              </div>
          )}
        </div>

        {/* Recent Attempts Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1 bg-amber-500 rounded-full"></div>
             <h2 className="text-2xl font-bold text-white">
                Recent Attempts
             </h2>
          </div>
          
          {attempts.length === 0 ? (
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 text-center">
                  <p className="text-slate-500">No recent activity. Assessments you take will appear here.</p>
              </div>
          ) : (
              <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-transparent border-b border-zinc-800">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-400 uppercase text-xs tracking-wider">Course</th>
                        <th className="px-6 py-4 font-semibold text-slate-400 uppercase text-xs tracking-wider">Date</th>
                        <th className="px-6 py-4 font-semibold text-slate-400 uppercase text-xs tracking-wider">Score</th>
                        <th className="px-6 py-4 font-semibold text-slate-400 uppercase text-xs tracking-wider">Result</th>
                        <th className="px-6 py-4 font-semibold text-slate-400 uppercase text-xs tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {attempts.map((attempt: any) => (
                        <tr key={attempt._id} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">
                            {attempt.courseId?.title || 'Unknown Course'}
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {new Date(attempt.createdAt).toLocaleDateString()} <span className="text-zinc-600 text-xs ml-1">{new Date(attempt.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </td>
                           <td className="px-6 py-4 font-medium">
                            <span className="bg-zinc-800 px-2.5 py-1 rounded text-slate-300 text-xs">
                                {attempt.score}/{attempt.totalQuestions}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide transition-colors ${
                                attempt.isPassed 
                                ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800" 
                                : "bg-red-900/30 text-red-400 border border-red-800"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${attempt.isPassed ? "bg-emerald-500" : "bg-red-500"}`}></span>
                              {attempt.isPassed ? "Passed" : "Failed"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             {!attempt.isPassed && (
                                 <Link href={`/courses/${attempt.courseId._id}`}>
                                    <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800">Retry</Button>
                                 </Link>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </div>

        {/* Available Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
             <h2 className="text-2xl font-bold text-white">
                Available Courses
             </h2>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-xl border border-dashed border-zinc-800">
                <p className="text-slate-500">No courses available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: any) => (
                <Card key={course._id} className="flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300 border-zinc-800 overflow-hidden bg-zinc-900 text-white rounded-xl">
                  <div className="h-40 bg-black/40 relative group overflow-hidden border-b border-zinc-800">
                       {/* Placeholder for course image */}
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                       </div>
                       <div className="absolute top-3 right-3">
                           <span className="bg-zinc-900/90 backdrop-blur text-slate-300 text-xs font-bold px-2 py-1 rounded shadow-sm border border-zinc-700">
                               {course.duration}
                           </span>
                       </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg font-bold text-white">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="mt-auto">
                        <Link href={`/courses/${course._id}`} className="w-full">
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md hover:shadow-indigo-500/20 border-0">
                             View Details & Attempt
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                             </svg>
                          </Button>
                        </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
