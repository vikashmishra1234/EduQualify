import connectDB from '@/lib/db';
import Course from '@/models/Course';
import NewQuestionForm from '@/components/admin/NewQuestionForm';

export default async function NewQuestionPageWrapper() {
  await connectDB();
  // Fetch courses only, we need their IDs for the dropdown
  // Use .lean() to return plain javascript objects, avoiding "Plain Object" serialization warnings.
  const courses = await Course.find({}, { title: 1 }).lean(); 
  
  // Convert _id to string manually if needed, or rely on Next.js serialization for props
  // Mongoose _id is an object, react server components need plain JSON.
  const serializedCourses = courses.map((c: any) => ({
      _id: c._id.toString(),
      title: c.title
  }));


  return <NewQuestionForm courses={serializedCourses} />;
}
