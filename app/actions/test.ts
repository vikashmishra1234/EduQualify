'use server';

import connectDB from '@/lib/db';
import Question from '@/models/Question';
import Course from '@/models/Course';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/mail';
import User from '@/models/User';
import Attempt from '@/models/Attempt';

export async function submitTest(courseId: string, answers: Record<string, number>) {
  const session = await getSession();
  if (!session) {
      throw new Error("Unauthorized");
  }

  await connectDB();
  
  // Fetch only the questions that were part of this test (or currently all for the course for simplicity in validation)
  // In a real robust system, we would store the "Test Session" with the specific question IDs served.
  // Here we re-fetch questions by ID from the answers keys to validate.
  const questionIds = Object.keys(answers);
  const questions = await Question.find({ _id: { $in: questionIds } }).lean();
  
  let score = 0;
  let total = questions.length;
  
  questions.forEach((q: any) => {
      const qId = q._id.toString();
      if (answers[qId] === q.correctOptionIndex) {
          score += 1;
      }
  });
  
  // Pass criteria: > 50%
  // The requirement says 15 questions. 
  // If user didn't answer some, they are wrong.
  const passThreshold = 0.5;
  const percentage = total > 0 ? score / total : 0;
  const passed = percentage >= passThreshold;
  
  // Create Attempt Record
  const attempt = await Attempt.create({
    userId: session.userId,
    courseId: courseId,
    score: score,
    totalQuestions: total,
    isPassed: passed,
    answers: questionIds.map(qid => ({
        questionId: qid,
        selectedOptionIndex: answers[qid],
        isCorrect: answers[qid] === questions.find((q: any) => q._id.toString() === qid).correctOptionIndex
    }))
  });

  // Send Email
  if (session.userId) {
     const user = await User.findById(session.userId);
     const course = await Course.findById(courseId);
     
     if (user && course) {
         try {
             const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4F46E5;">EduQualify Results</h1>
                    </div>
                    <p>Dear ${user.name},</p>
                    <p>You have completed the eligibility assessment for <strong>${course.title}</strong>.</p>
                    
                    <div style="background-color: ${passed ? '#ecfdf5' : '#fef2f2'}; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <h2 style="color: ${passed ? '#047857' : '#b91c1c'}; margin: 0;">
                            ${passed ? 'PASSED' : 'FAILED'}
                        </h2>
                        <p style="margin-top: 5px; font-size: 18px;">
                            Score: <strong>${score} / ${total}</strong> (${(percentage * 100).toFixed(0)}%)
                        </p>
                    </div>

                    <p>You can view your full result history on your dashboard.</p>
                    
                    <br/>
                    <p style="color: #6b7280; font-size: 14px;">Thank you,<br/>EduQualify Team</p>
                </div>
             `;

             await sendEmail({
                 to: user.email,
                 subject: `Assessment Result: ${course.title}`,
                 html: emailContent
             });
         } catch (e) {
             console.error("Failed to send email", e);
         }
     }
  }

  // We could save the Result to a "Result" model here for history.
  
  return { success: true, score, total, passed };
}
