import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteCourse } from "@/app/actions/admin";

export default async function AdminCoursesPage() {
  await connectDB();
  const courses = await Course.find({}).sort({ createdAt: -1 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
           <p className="text-slate-400 mt-1">Create and manage your assessment courses.</p>
        </div>
        <Link href="/admin/courses/new">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-0">
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Duration</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-48 text-slate-500">
                   <div className="flex flex-col items-center justify-center gap-2">
                      <p>No courses found.</p>
                      <Link href="/admin/courses/new" className="text-indigo-400 hover:text-indigo-300 text-sm">Create your first course</Link>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
                courses.map((course: any) => (
                  <TableRow key={course._id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="font-medium text-white">{course.title}</TableCell>
                    <TableCell className="text-slate-400">{course.duration}</TableCell>
                    <TableCell>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${course.isActive ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-amber-900/30 text-amber-400 border border-amber-800'}`}>
                            {course.isActive ? 'Active' : 'Draft'}
                        </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                          <Link href={`/admin/courses/${course._id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/30">
                                <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <form action={deleteCourse}>
                            <input type="hidden" name="id" value={course._id.toString()} />
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/30">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
