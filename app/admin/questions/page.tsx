import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Question from '@/models/Question';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function AdminQuestionsPage() {
  await connectDB();
  const questions = await Question.find({}).populate('courseId', 'title').sort({ createdAt: -1 });

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Question Bank</h1>
        <Link href="/admin/questions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </Link>
      </div>

       <div className="rounded-md border bg-card text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q: any) => (
              <TableRow key={q._id}>
                <TableCell className="font-medium max-w-sm truncate" title={q.text}>{q.text}</TableCell>
                <TableCell>{q.courseId?.title || 'General'}</TableCell>
                <TableCell>
                   <span className={`capitalize ${
                       q.difficulty === 'easy' ? 'text-green-600' : 
                       q.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                   }`}>{q.difficulty}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
             {questions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No questions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
