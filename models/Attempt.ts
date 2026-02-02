import mongoose, { Schema, model, models } from 'mongoose';

const AttemptSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  isPassed: {
    type: Boolean,
    required: true,
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedOptionIndex: Number,
    isCorrect: Boolean
  }]
}, {
  timestamps: true,
});

const Attempt = models.Attempt || model('Attempt', AttemptSchema);

export default Attempt;
