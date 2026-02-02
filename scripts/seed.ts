import dotenv from 'dotenv';
import path from 'path';
import mongoose, { Schema, model, models } from 'mongoose';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

// Define Schemas locally to avoid import issues
const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibilityCriteria: { type: String, required: true },
  duration: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Course = models.Course || model('Course', CourseSchema);

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  category: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' }
}, { timestamps: true });

const Question = models.Question || model('Question', QuestionSchema);

async function seed() {
  try {
    console.log('Connecting to DB...', MONGODB_URI?.split('@')[1]); // Log partial URI for safety
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected.');

    console.log('Clearing existing data...');
    await Course.deleteMany({});
    await Question.deleteMany({});

    console.log('Seeding Courses...');
    const courses = await Course.create([
      {
        title: 'Certified React Developer',
        description: 'Master React.js and build modern web applications. Covers hooks, context, and performance.',
        eligibilityCriteria: 'Basic JS Knowledge',
        duration: '3 Months',
        thumbnail: 'https://placehold.co/600x400/6366f1/ffffff?text=React+Dev',
      },
      {
        title: 'Advanced Data Science',
        description: 'Learn Python, ML, and Deep Learning with hands-on projects.',
        eligibilityCriteria: 'STEM Degree',
        duration: '6 Months',
        thumbnail: 'https://placehold.co/600x400/10b981/ffffff?text=Data+Science',
      },
      {
        title: 'Digital Marketing Specialist',
        description: 'Become an expert in SEO, SEM, and Social Media Marketing.',
        eligibilityCriteria: 'None',
        duration: '2 Months',
        thumbnail: 'https://placehold.co/600x400/f59e0b/ffffff?text=Digital+Marketing',
      }
    ]);
    console.log(`Seeded ${courses.length} courses.`);

    const reactCourse = courses[0];
    const dsCourse = courses[1];

    const questions = [
      {
        text: 'What hook is used for side effects in React?',
        options: ['useState', 'useEffect', 'useContext', 'useRef'],
        correctOptionIndex: 1,
        difficulty: 'easy',
        category: 'React',
        courseId: reactCourse._id,
      },
      {
        text: 'Which is NOT a React Lifecycle method?',
        options: ['componentDidMount', 'componentWillUnmount', 'componentRender', 'shouldComponentUpdate'],
        correctOptionIndex: 2,
        difficulty: 'medium',
        category: 'React',
        courseId: reactCourse._id,
      },
       {
        text: 'What is pandas used for?',
        options: ['Web Dev', 'Data Manipulation', 'Game Dev', 'Networking'],
        correctOptionIndex: 1,
        difficulty: 'easy',
        category: 'Data Science',
        courseId: dsCourse._id,
      }
    ];

    await Question.create(questions);
    console.log(`Seeded ${questions.length} questions.`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
