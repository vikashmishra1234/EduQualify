# implementation_plan.md

## Project: Online Course Eligibility & Assessment Platform

### Phase 1: Setup & Infrastructure
- [ ] Initialize Next.js 15 Project (Typescript, Tailwind, App Router)
- [ ] Set up Database Connection (MongoDB + Mongoose)
- [ ] Configure Environment Variables
- [ ] Install Backend Dependencies (`mongoose`, `bcryptjs`, `jsonwebtoken`, `nodemailer` etc.)
- [ ] Create Global Layout & Design System (Tailwind Configuration)

### Phase 2: Authentication & User Roles
- [ ] Design User Models (Candidate, Admin)
- [ ] Implement Sign Up / Login APIs (Server Actions)
- [ ] Implement JWT Handling & Middleware (Protected Routes)
- [ ] Create Auth Pages (Login, Register) for Candidate
- [ ] Create Admin Login Page

### Phase 3: Course Management (Admin & Public)
- [ ] Design Course Model
- [ ] Implement Admin: Create/Update/Delete Courses
- [ ] Create Public Course Listing Page (Search & Filter)
- [ ] Create Course Detail Page

### Phase 4: Assessment System Core
- [ ] Design Question Bank & Test Models
- [ ] Implement Admin: Manage Question Banks & Difficulty Levels
- [ ] Implement Admin: Set Test Rules (Duration, Cutoff)
- [ ] Create Test Interface (Candidate View)
    - [ ] Onboarding / Instructions
    - [ ] Real-time Timer
    - [ ] Question Navigation
    - [ ] Auto-submission logic

### Phase 5: Results & Analytics
- [ ] Implement Scoring Logic (Server-side)
- [ ] Create Result Visualization (Instant Feedback)
- [ ] Dashboard for Candidates (Test History)
- [ ] Admin Analytics (View Results)
- [ ] Email Notifications (Nodemailer)

### Phase 6: UX Enhancements & Optimization
- [ ] Add Progress Indicators
- [ ] Ensure Mobile Responsiveness
- [ ] Accessibility Checks
- [ ] Optimization (SEO, Performance)
