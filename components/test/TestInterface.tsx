'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { submitTest } from '@/app/actions/test'; // We need to create this
import { useRouter } from 'next/navigation';

interface Question {
  _id: string;
  text: string;
  options: string[];
}

interface TestInterfaceProps {
  courseId: string;
  questions: Question[];
  durationMinutes: number;
}

export default function TestInterface({ courseId, questions, durationMinutes }: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Create a ref related to the callback to avoid closure staleness issues in setInterval
  const submitRef = useRef<() => void>(() => {});

  const handleFinish = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Call server action to submit
    try {
        const result = await submitTest(courseId, answers);
        if (result.success) {
            router.push(`/test/${courseId}/result?score=${result.score}&passed=${result.passed}`);
        } else {
            alert('Submission failed. Please try again.');
            setIsSubmitting(false);
        }
    } catch (e) {
        console.error("Submission error", e);
        setIsSubmitting(false);
    }
  }, [answers, courseId, isSubmitting, router]);

  submitRef.current = handleFinish;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitRef.current(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    const questionId = questions[currentQuestionIndex]._id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentQ = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCurrentQuestionAnswered = answers[currentQ._id] !== undefined;

  if (!questions || questions.length === 0) {
      return <div className="p-8 text-center text-red-400">Error: No questions found for this test. Please contact admin.</div>;
  }
  
  // ... (keeping standard render) ...
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex-1 flex flex-col">
       {/* ... (Header) ... */}
       <div className="flex justify-between items-center mb-8 sticky top-0 bg-black/80 backdrop-blur-md z-20 py-4 border-b border-zinc-800">
          <div className="text-xl font-bold text-white">
            Question {currentQuestionIndex + 1} <span className="text-slate-500 text-base font-normal">/ {questions.length}</span>
          </div>
          <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 ${timeLeft < 60 ? 'text-red-400 border-red-900/50 animate-pulse bg-red-950/20' : 'text-slate-200'}`}>
             <Clock className="w-5 h-5" />
             {formatTime(timeLeft)}
          </div>
       </div>

       {/* Question Card */}
       <Card className="mb-8 shadow-2xl shadow-black/40 border-zinc-800 bg-zinc-900">
         {/* ... (Header/Content) ... */}
         <CardHeader className="p-6 md:p-8">
            <CardTitle className="text-xl md:text-2xl leading-relaxed text-white font-bold">
              {currentQ.text}
            </CardTitle>
         </CardHeader>
         <CardContent className="p-6 md:p-8 pt-0">
            <div className="space-y-4">
              {currentQ.options.map((option, idx) => {
                 const isSelected = answers[currentQ._id] === idx;
                 return (
                     <div 
                         key={idx}
                         onClick={() => handleOptionSelect(idx)}
                         className={`flex items-center p-5 rounded-xl border cursor-pointer transition-all group ${
                             isSelected 
                             ? 'bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] convert-to-indigo' 
                             : 'bg-zinc-950/30 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700'
                         }`}
                     >
                         <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border mr-4 transition-colors ${
                              isSelected 
                              ? 'bg-indigo-600 border-indigo-600' 
                              : 'border-zinc-600 group-hover:border-zinc-500'
                         }`}>
                             {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                         </div>
                         <span className={`text-base md:text-lg leading-relaxed ${isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>{option}</span>
                     </div>
                 );
              })}
            </div>
         </CardContent>
         <CardFooter className="flex justify-between border-t border-zinc-800 p-6 md:p-8 bg-black/20">
            <Button 
              variant="outline" 
              className="border-zinc-700 bg-transparent text-slate-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-600"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
             >
              Previous
            </Button>
            
            {isLastQuestion ? (
               <Button onClick={handleFinish} disabled={isSubmitting || !isCurrentQuestionAnswered} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
                 {isSubmitting ? 'Submitting...' : 'Submit Test'}
               </Button>
            ) : (
                <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={!isCurrentQuestionAnswered} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </Button>
            )}
         </CardFooter>
       </Card>

      
      {/* Progress Bar Container */}
      <div className="mt-auto pt-6">
          <div className="flex justify-between text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
             <div 
                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }} 
             />
          </div>
      </div>
    </div>
  );
}
