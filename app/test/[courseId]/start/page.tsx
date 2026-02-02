import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Question from "@/models/Question";
import TestInterface from "@/components/test/TestInterface";
import Navbar from "@/components/Navbar";

export default async function TestStartPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/login?callbackUrl=/test/${courseId}/start`);
  }

  await connectDB();
  
  // Fetch 15 random questions for this course
  // Using MongoDB aggregation $sample for randomness
  const questions = await Question.aggregate([
      { $match: { courseId: new (require('mongoose').Types.ObjectId)(courseId) } }, // Ensure ObjectId cast
      { $sample: { size: 15 } }
  ]);
  
  // Serialize for client component
  const serializedQuestions = questions.map((q: any) => ({
      _id: q._id.toString(),
      text: q.text,
      options: q.options
  }));

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col selection:bg-indigo-500/30">
       <div className="hidden md:block">
         <Navbar />
       </div>
       <TestInterface 
          courseId={courseId} 
          questions={serializedQuestions} 
          durationMinutes={15} 
       />
    </div>
  );
}
