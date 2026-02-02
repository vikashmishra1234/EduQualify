import mongoose, { Schema, model, models } from 'mongoose';

const CourseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  eligibilityCriteria: {
    type: String,
    required: [true, 'Please provide eligibility criteria'],
  },
  duration: {
    type: String, // e.g., "4 weeks", "6 months"
    required: [true, 'Please provide course duration'],
  },
  thumbnail: {
    type: String, // URL to image
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Relationship to assessments could be here or in Assessment model
}, {
  timestamps: true,
});

const Course = models.Course || model('Course', CourseSchema);

export default Course;
