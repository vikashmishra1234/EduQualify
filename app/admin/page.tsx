import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Question from "@/models/Question";
import User from "@/models/User";
import Attempt from "@/models/Attempt";
import mongoose from "mongoose";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Users, FileQuestion, Activity } from "lucide-react";

async function getData() {
  await connectDB();
  
  // Ensure models are registered (incase of cold start)
  if (!mongoose.models.User) mongoose.model('User', User.schema);
  if (!mongoose.models.Attempt) mongoose.model('Attempt', Attempt.schema);
  if (!mongoose.models.Course) mongoose.model('Course', Course.schema);

  const courseCount = await Course.countDocuments();
  const questionCount = await Question.countDocuments();
  const studentCount = await User.countDocuments({ role: 'student' });
  const attemptCount = await Attempt.countDocuments();
  
  const recentStudents = await User.find({ role: 'student' })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentAttempts = await Attempt.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'name email')
    .populate('courseId', 'title');

  return {
    courseCount,
    questionCount,
    studentCount,
    attemptCount,
    recentStudents: JSON.parse(JSON.stringify(recentStudents)),
    recentAttempts: JSON.parse(JSON.stringify(recentAttempts)),
  };
}

export default async function AdminDashboard() {
  const data = await getData();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">Overview of platform activity and performance.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.courseCount}</div>
            <p className="text-xs text-slate-500 mt-1">Active learning paths</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Questions in Bank</CardTitle>
            <FileQuestion className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.questionCount}</div>
            <p className="text-xs text-slate-500 mt-1">Total assessment items</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.studentCount}</div>
            <p className="text-xs text-slate-500 mt-1">Registered learners</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Attempts</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.attemptCount}</div>
            <p className="text-xs text-slate-500 mt-1">Tests completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/30">
            <CardTitle className="text-white">Recent Students</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
               <TableHeader className="bg-zinc-950/50">
                 <TableRow className="border-zinc-800 hover:bg-transparent">
                   <TableHead className="text-slate-400">Name</TableHead>
                   <TableHead className="text-slate-400">Email</TableHead>
                   <TableHead className="text-slate-400">Joined</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {data.recentStudents.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={3} className="text-center text-slate-500 py-8">No students yet</TableCell>
                   </TableRow>
                 ) : (
                   data.recentStudents.map((student: any) => (
                     <TableRow key={student._id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                       <TableCell className="font-medium text-slate-200">{student.name}</TableCell>
                       <TableCell className="text-slate-400">{student.email}</TableCell>
                       <TableCell className="text-slate-400">{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/30">
            <CardTitle className="text-white">Recent Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
               <TableHeader className="bg-zinc-950/50">
                 <TableRow className="border-zinc-800 hover:bg-transparent">
                   <TableHead className="text-slate-400">Student</TableHead>
                   <TableHead className="text-slate-400">Course</TableHead>
                   <TableHead className="text-slate-400">Score</TableHead>
                   <TableHead className="text-slate-400">Result</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {data.recentAttempts.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={4} className="text-center text-slate-500 py-8">No attempts yet</TableCell>
                   </TableRow>
                 ) : (
                   data.recentAttempts.map((attempt: any) => (
                     <TableRow key={attempt._id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                       <TableCell className="font-medium text-slate-200">{attempt.userId?.name || 'Unknown'}</TableCell>
                       <TableCell className="text-slate-400">{attempt.courseId?.title || 'Unknown'}</TableCell>
                       <TableCell className="text-slate-300">{attempt.score}/{attempt.totalQuestions}</TableCell>
                       <TableCell>
                         <span className={`text-xs font-bold px-2 py-1 rounded-full ${attempt.isPassed ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800" : "bg-red-900/30 text-red-400 border border-red-800"}`}>
                           {attempt.isPassed ? "Pass" : "Fail"}
                         </span>
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
