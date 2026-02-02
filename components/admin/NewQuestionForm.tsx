'use client';

import { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { createQuestion } from "@/app/actions/admin";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewQuestionForm({ courses }: { courses: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
       const result = await createQuestion(null, formData);
       
       if (result.success) {
           setSuccess(true);
           setMessage('');
           setErrors({});
           router.refresh();
       } else {
           setMessage(result.message || 'Error saving question');
           setErrors(result.errors || {});
           setSuccess(false);
       }
    });
  }

  if (success) {
      return (
          <div className="max-w-2xl mx-auto space-y-6 text-center pt-20">
               <div className="text-green-600 text-xl font-bold mb-4">Question Added Successfully!</div>
               <div className="flex justify-center gap-4">
                   <Button onClick={() => setSuccess(false)}>Add Another</Button>
                   <Link href="/admin/questions">
                        <Button variant="outline">Back to List</Button>
                   </Link>
               </div>
          </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/questions" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
         <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bank
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
             {message && <div className="text-red-500 text-sm mb-4">{message}</div>}
             
            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
               <select 
                id="courseId" 
                name="courseId" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                  <option value="">Select Course...</option>
                  {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
               </select>
               {errors?.courseId && <p className="text-sm text-red-500">{errors.courseId[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Question Text</Label>
              <Textarea id="text" name="text" required placeholder="What is...?" />
              {errors?.text && <p className="text-sm text-red-500">{errors.text[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="option1">Option 1 (Index 0)</Label>
                    <Input id="option1" name="option1" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="option2">Option 2 (Index 1)</Label>
                    <Input id="option2" name="option2" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="option3">Option 3 (Index 2)</Label>
                    <Input id="option3" name="option3" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="option4">Option 4 (Index 3)</Label>
                    <Input id="option4" name="option4" required />
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="correctOptionIndex">Correct Option Index</Label>
                    <select 
                        id="correctOptionIndex" 
                        name="correctOptionIndex"
                         className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                         required
                    >
                        <option value="0">Option 1</option>
                        <option value="1">Option 2</option>
                        <option value="2">Option 3</option>
                        <option value="3">Option 4</option>
                    </select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select 
                        id="difficulty" 
                        name="difficulty"
                         className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                         required
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
             </div>
             
             <div className="space-y-2">
                <Label htmlFor="category">Category/Topic</Label>
                <Input id="category" name="category" required placeholder="e.g. React Hooks" />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Question'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
