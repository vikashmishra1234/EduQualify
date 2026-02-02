import Link from 'next/link';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge'; // Removed unused import
import { Clock, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';

function BadgeDemo({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ${className}`}>{children}</span>;
}

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  await connectDB();
  const courses = await Course.find({ isActive: true }).lean();

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Search/Filter Background Glow */}
      <div className="fixed top-0 left-0 w-full h-96 bg-indigo-900/20 blur-[120px] pointer-events-none" />

      <div className="container px-4 py-12 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">Explore Courses</h1>
                <p className="text-lg text-slate-400 max-w-2xl">
                    Discover expert-led courses designed to help you verify your skills and advance your career.
                </p>
            </div>
            {/* Placeholder for future filter/search */}
            {/* <div className="hidden md:block">...</div> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <Card key={course._id} className="flex flex-col h-full bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20 overflow-hidden hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 group">
              {course.thumbnail ? (
                <div className="h-48 w-full overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60 z-10" />
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              ) : (
                <div className="h-48 w-full bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-zinc-800" />
                     <BookOpen className="w-12 h-12 text-zinc-700" />
                </div>
              )}
              
              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-300 border border-indigo-500/30">
                    Certification
                  </span>
                  <div className="flex items-center text-xs font-medium text-slate-400 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800">
                    <Clock className="w-3 h-3 mr-1.5 text-indigo-400" />
                    {course.duration}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-slate-400 text-sm leading-relaxed">
                    {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                 <div className="pt-4 border-t border-zinc-800/50">
                     <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Eligibility</p>
                     <p className="text-sm text-slate-300 line-clamp-2">
                       {course.eligibilityCriteria}
                     </p>
                 </div>
              </CardContent>
              <CardFooter className="pt-0 pb-6 px-6">
                <Link href={`/courses/${course._id}`} className="w-full">
                  <Button className="w-full bg-zinc-800 hover:bg-indigo-600 hover:text-white text-slate-200 border border-zinc-700 hover:border-indigo-500 transition-all duration-300 shadow-lg shadow-black/20">
                      View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          
          {courses.length === 0 && (
             <div className="col-span-full py-24 text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                   <BookOpen className="w-8 h-8 text-slate-600" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
               <p className="text-slate-500">Check back later for new learning opportunities.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
