import mongoose from 'mongoose';
import Course from '../models/Course';
import Question from '../models/Question';
import dotenv from 'dotenv';
import path from 'path';

// Fix for resolving .env.local from scripts directory
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/course-eligibility';

async function seedQuestions() {
  try {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
    }

    // Ensure models are registered (sometimes needed if not imported previously)
    // imports above should trigger registration if models are defined in module scope
    
    // Explicitly check/register if needed (usually handled by the imports)
    
    const courses = await Course.find({});
    
    if (courses.length === 0) {
        console.log("No courses found. creating some samples...");
        await Course.create([
            { title: "React Fundamentals", description: "Learn the basics of React", eligibilityCriteria: "Basic JS", duration: "30 mins", isActive: true },
            { title: "Node.js Basics", description: "Backend development with Node", eligibilityCriteria: "Basic JS", duration: "45 mins", isActive: true },
            { title: "Python Basics", description: "Learn Python from scratch", eligibilityCriteria: "None", duration: "1 hour", isActive: true }
        ]);
        // Refetch
        const newCourses = await Course.find({});
        courses.push(...newCourses);
    }

    console.log(`Found ${courses.length} courses. Adding questions...`);

    const questionsMap: Record<string, any[]> = {
        "React": [
            { text: "What is React?", options: ["A Library", "A Framework", "A Database", "A Server"], correctOptionIndex: 0 },
            { text: "What hook is used for state?", options: ["useState", "useEffect", "useContext", "useReducer"], correctOptionIndex: 0 },
            { text: "What constitutes a React component?", options: ["A function or class", "A string", "An object", "A method"], correctOptionIndex: 0 },
            { text: "What is JSX?", options: ["JavaScript XML", "Java Syntax Extension", "JSON Xylophone", "Just Screen X"], correctOptionIndex: 0 },
            { text: "How do you pass data to child components?", options: ["Props", "State", "Redux", "Context"], correctOptionIndex: 0 }
        ],
        "Node": [
            { text: "What is Node.js?", options: ["A Runtime", "A Framework", "A Language", "A Database"], correctOptionIndex: 0 },
            { text: "What engine does Node use?", options: ["V8", "SpiderMonkey", "Chakra", "JavaScriptCore"], correctOptionIndex: 0 },
            { text: "How do you import modules (CommonJS)?", options: ["require()", "import", "include", "fetch"], correctOptionIndex: 0 },
            { text: "Which module is used for file system?", options: ["fs", "http", "path", "os"], correctOptionIndex: 0 },
            { text: "Is Node.js single-threaded?", options: ["Yes", "No", "Depends", "Maybe"], correctOptionIndex: 0 }
        ],
        "Python": [
            { text: "What is Python?", options: ["Interpreted Language", "Compiled Language", "Assembly", "Machine Code"], correctOptionIndex: 0 },
            { text: "How do you define a function?", options: ["def", "function", "func", "util"], correctOptionIndex: 0 },
            { text: "What is a list?", options: ["Mutable array", "Immutable array", "Hash map", "String"], correctOptionIndex: 0 },
            { text: "What is the output of 2**3?", options: ["8", "6", "9", "5"], correctOptionIndex: 0 },
            { text: "Which keyword implies exception handling?", options: ["try", "catch", "handle", "error"], correctOptionIndex: 0 }
        ]
    };

    const genericQuestions = [
        { text: "What is the primary goal of this subject?", options: ["Mastery", "Confusion", "Sleep", "Food"], correctOptionIndex: 0 },
        { text: "Which approach is best practice?", options: ["Consistent coding", "Random coding", "No coding", "Spaghetti code"], correctOptionIndex: 0 },
        { text: "Evaluate the complexity of:", options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"], correctOptionIndex: 0 },
        { text: "Identify the correct syntax:", options: ["Correct", "Wrong", "Maybe", "False"], correctOptionIndex: 0 },
        { text: "Which tool is commonly used?", options: ["IDE", "Hammer", "Saw", "Drill"], correctOptionIndex: 0 }
    ];

    for (const course of courses) {
        // Check if course already has questions
        const existingCount = await Question.countDocuments({ courseId: course._id });
        if (existingCount >= 5) {
            console.log(`Course '${course.title}' already has ${existingCount} questions. Skipping.`);
            continue;
        }

        console.log(`Adding questions to '${course.title}'...`);
        
        // Find matching set or use generic
        let selectedQuestions = genericQuestions;
        for (const key in questionsMap) {
            if (course.title.toLowerCase().includes(key.toLowerCase())) {
                selectedQuestions = questionsMap[key];
                break;
            }
        }

        const questionsToAdd = selectedQuestions.map(q => ({
            ...q,
            courseId: course._id,
            category: "General",
            difficulty: "medium"
        }));

        await Question.insertMany(questionsToAdd);
        console.log(`Added 5 questions to ${course.title}`);
    }

    console.log('Seeding complete!');
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedQuestions();
