import mongoose, { Schema, model, models } from 'mongoose';

const QuestionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  options: [{
    type: String, // Array of strings for options
    required: true,
  }],
  correctOptionIndex: {
    type: Number, // Index of the correct option (0-3 typically)
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  category: {
    type: String, // e.g., 'Math', 'Physics', or related to Course
    required: true,
  },
  courseId: {
     type: Schema.Types.ObjectId,
     ref: 'Course',
     required: false // Optional if global bank
  }
}, {
  timestamps: true,
});

const Question = models.Question || model('Question', QuestionSchema);

export default Question;
