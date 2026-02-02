'use client';

import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCourse } from "@/app/actions/admin";
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditCourseForm({ course }: { course: any }) {
  const updateCourseWithId = updateCourse.bind(null, course._id);
  const [state, formAction, isPending] = useActionState(updateCourseWithId, null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/courses" className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
         <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
      </Link>
      
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader className="border-b border-zinc-800">
          <CardTitle className="text-white">Edit Course: {course.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">Course Title</Label>
              <Input 
                 id="title" 
                 name="title" 
                 defaultValue={course.title}
                 required 
                 className="bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-indigo-500/50" 
              />
              {state?.errors?.title && <p className="text-sm text-red-400">{state.errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-slate-300">Duration</Label>
              <Input 
                 id="duration" 
                 name="duration" 
                 defaultValue={course.duration}
                 required 
                 className="bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-indigo-500/50" 
              />
              {state?.errors?.duration && <p className="text-sm text-red-400">{state.errors.duration}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea 
                 id="description" 
                 name="description" 
                 defaultValue={course.description}
                 required 
                 className="bg-zinc-950/50 border-zinc-800 text-white min-h-[100px] focus-visible:ring-indigo-500/50" 
              />
              {state?.errors?.description && <p className="text-sm text-red-400">{state.errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibilityCriteria" className="text-slate-300">Eligibility Criteria</Label>
              <Textarea 
                 id="eligibilityCriteria" 
                 name="eligibilityCriteria" 
                 defaultValue={course.eligibilityCriteria}
                 required 
                 className="bg-zinc-950/50 border-zinc-800 text-white min-h-[100px] focus-visible:ring-indigo-500/50" 
              />
              {state?.errors?.eligibilityCriteria && <p className="text-sm text-red-400">{state.errors.eligibilityCriteria}</p>}
            </div>

            <div className="space-y-2">
               <Label htmlFor="thumbnail" className="text-slate-300">Thumbnail URL (Optional)</Label>
               <Input 
                  id="thumbnail" 
                  name="thumbnail" 
                  defaultValue={course.thumbnail} 
                  className="bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-indigo-500/50" 
               />
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isPending}>
                  {isPending ? (
                      'Saving Changes...'
                  ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                  )}
                </Button>
            </div>
            
            {state?.message && (
                <p className={`text-sm text-center ${state.message.includes('Success') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {state.message}
                </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
