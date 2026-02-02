import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Attempt from "@/models/Attempt";
import Course from "@/models/Course";
import mongoose from "mongoose";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

async function getPassedAttempts(userId: string) {
    await connectDB();
    // Ensure Course model is registered
    if (!mongoose.models.Course) {
        mongoose.model('Course', Course.schema);
    }
    
    // Find all passed attempts
    // Note: A user might have passed multiple times, we might want to distinct by courseId
    // But for now, let's just show all passed records or latest passed per course.
    
    const attempts = await Attempt.find({ userId, isPassed: true })
        .populate('courseId', 'title description')
        .sort({ createdAt: -1 });

    // Deduplicate to show only unique courses passed? 
    // Usually "Eligibility" implies you are eligible for the course.
    // Let's filter to unique courses.
    
    const uniquePassedCourses = new Map();
    attempts.forEach((attempt: any) => {
        if (!uniquePassedCourses.has(attempt.courseId._id.toString())) {
             uniquePassedCourses.set(attempt.courseId._id.toString(), {
                 course: attempt.courseId,
                 score: attempt.score,
                 total: attempt.totalQuestions,
                 date: attempt.createdAt
             });
        }
    });
    
    return Array.from(uniquePassedCourses.values());
}

export default async function EligibilityPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const passedCourses = await getPassedAttempts(session.userId as string);

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                   <h1 className="text-3xl font-bold tracking-tight">My Eligibilities</h1>
                   <p className="text-muted-foreground mt-1">Courses you have successfully qualified for.</p>
                </div>
            </div>

            {passedCourses.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                         <div className="p-4 bg-muted rounded-full">
                            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                             <h3 className="text-lg font-semibold">No Eligible Courses Yet</h3>
                             <p className="text-muted-foreground max-w-sm mx-auto">
                                You haven&apos;t passed any assessments yet. Browse the available courses and take a test to prove your eligibility.
                             </p>
                        </div>
                        <Link href="/dashboard">
                             <Button>Browse Courses</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {passedCourses.map((item: any) => (
                        <Card key={item.course._id} className="border-green-200 bg-green-50/50 dark:bg-green-950/10 dark:border-green-900">
                             <CardHeader className="pb-3">
                                 <div className="flex justify-between items-start">
                                     <CardTitle className="text-lg">{item.course.title}</CardTitle>
                                     <CheckCircle2 className="h-5 w-5 text-green-600" />
                                 </div>
                                 <CardDescription className="line-clamp-2">
                                     {item.course.description}
                                 </CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <div className="space-y-3">
                                     <div className="flex justify-between text-sm">
                                         <span className="text-muted-foreground">Status</span>
                                         <span className="font-semibold text-green-600">Eligible</span>
                                     </div>
                                     <div className="flex justify-between text-sm">
                                         <span className="text-muted-foreground">Score</span>
                                         <span className="font-medium">{item.score}/{item.total}</span>
                                     </div>
                                      <div className="flex justify-between text-sm">
                                         <span className="text-muted-foreground">Certified On</span>
                                         <span className="font-medium">{new Date(item.date).toLocaleDateString()}</span>
                                     </div>
                                     
                                     <div className="pt-4">
                                         <Button className="w-full bg-green-600 hover:bg-green-700">Download Certificate</Button>
                                     </div>
                                 </div>
                             </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
