import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { notFound } from "next/navigation";
import EditCourseForm from "./edit-form";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  
  const course = await Course.findById(id).lean();

  if (!course) {
    notFound();
  }

  // Convert ObjectId to string for client component serialization
  const serializedCourse = {
    ...course,
    _id: course._id.toString(),
  };

  return <EditCourseForm course={serializedCourse} />;
}
