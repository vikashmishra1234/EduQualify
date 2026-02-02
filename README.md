# ⚡ EduQualify

EduQualify is a premium online course eligibility and assessment platform. It allows users to browse courses, check their eligibility through timed assessments, and receive instant certification results. For administrators, it offers a robust dashboard to manage courses, view analytics, and track student performance.

![Platform Preview](public/preview.png)

## 🚀 Features

### for Candidates
- **Browse Courses**: Explore a catalog of professional courses with detailed eligibility criteria.
- **Eligibility Assessments**: Take real-time, time-bound multiple-choice tests to verify skills.
- **Instant Results**: Receive immediate feedback with a pass/fail status and score breakdown.
- **Secure Authentication**: User registration and login flows.

### for Administrators
- **Admin Dashboard**: A comprehensive overview of platform statistics (Total Courses, Students, Test Attempts).
- **Course Management**: Create, edit, and delete courses with ease.
- **Question Bank**: Manage assessment questions for each course.
- **Analytics**: View recent student registrations and activity.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Emails**: Nodemailer
- **Icons**: Lucide React

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js 18+
- MongoDB Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eduqualify.git
   cd eduqualify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eduqualify

   # Authentication (NextAuth)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key_here

   # Email Service (for results)
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password
   ```

4. **Seed Database (Optional)**
   If you have a seeding script, run it to populate initial courses.
   ```bash
   npx tsx scripts/seed-questions.ts
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment

The application is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the **Environment Variables** in the Vercel project settings.
4. Deploy!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
