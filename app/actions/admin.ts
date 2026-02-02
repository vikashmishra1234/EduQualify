'use server';

import { z } from 'zod';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Question from '@/models/Question';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  eligibilityCriteria: z.string().min(5),
  duration: z.string().min(2),
  thumbnail: z.string().optional(),
});

const QuestionSchema = z.object({
  text: z.string().min(5),
  option1: z.string().min(1),
  option2: z.string().min(1),
  option3: z.string().min(1),
  option4: z.string().min(1),
  correctOptionIndex: z.coerce.number().min(0).max(3),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string().min(2),
  courseId: z.string().min(1),
});

export async function createCourse(prevState: any, formData: FormData) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    eligibilityCriteria: formData.get('eligibilityCriteria'),
    duration: formData.get('duration'),
    thumbnail: formData.get('thumbnail'),
  };

  const validation = CourseSchema.safeParse(data);
  if (!validation.success) {
    return { message: 'Invalid input', errors: validation.error.flatten().fieldErrors };
  }

  try {
    await connectDB();
    await Course.create(validation.data);
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
  } catch (e) {
    return { message: 'Failed to create course' };
  }
  
  redirect('/admin/courses');
}

export async function updateCourse(id: string, prevState: any, formData: FormData) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    eligibilityCriteria: formData.get('eligibilityCriteria'),
    duration: formData.get('duration'),
    thumbnail: formData.get('thumbnail'),
  };

  const validation = CourseSchema.safeParse(data);
  if (!validation.success) {
    return { message: 'Invalid input', errors: validation.error.flatten().fieldErrors };
  }

  try {
    await connectDB();
    await Course.findByIdAndUpdate(id, validation.data);
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    revalidatePath(`/courses/${id}`);
  } catch (e) {
    return { message: 'Failed to update course' };
  }
  
  redirect('/admin/courses');
}

export async function deleteCourse(formData: FormData) {
  const id = formData.get('id');
  if (!id) return;

  try {
    await connectDB();
    await Course.findByIdAndDelete(id);
    // Also delete related questions/attempts if necessary, keeping it simple for now
    await Question.deleteMany({ courseId: id });
    
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
  } catch (e) {
    console.error('Failed to delete course', e);
  }
}

export async function createQuestion(prevState: any, formData: FormData) {
  const data = {
    text: formData.get('text'),
    option1: formData.get('option1'),
    option2: formData.get('option2'),
    option3: formData.get('option3'),
    option4: formData.get('option4'),
    correctOptionIndex: formData.get('correctOptionIndex'),
    difficulty: formData.get('difficulty'),
    category: formData.get('category'),
    courseId: formData.get('courseId'),
  };

  const validation = QuestionSchema.safeParse(data);
  if (!validation.success) {
    return { message: 'Invalid input', errors: validation.error.flatten().fieldErrors };
  }

  try {
    await connectDB();
    const { option1, option2, option3, option4, ...rest } = validation.data;
    
    await Question.create({
      ...rest,
      options: [option1, option2, option3, option4],
    });
    
    revalidatePath('/admin/questions');
    return { message: 'Question added successfully!', success: true };
  } catch (e) {
    return { message: 'Failed to create question' };
  }
}
