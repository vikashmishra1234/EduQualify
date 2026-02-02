'use server';

import { z } from 'zod'; // We'll need zod for validation, let's assume I will install it or use basic validation
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Basic validation schema
const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const LoginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type AuthState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    general?: string[];
  };
  message?: string;
};

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = RegisterSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Register.',
    };
  }

  const { data } = validatedFields;

  try {
    await connectDB();
    
    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        errors: {
          email: ['User with this email already exists.'],
        },
        message: 'Registration Failed',
      };
    }

    // Determine Role (Check against env ADMIN_EMAIL or default to student)
    const role = data.email === process.env.ADMIN_EMAIL ? 'admin' : 'student';

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create User
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: role,
    });

    // Create session
    await createSession(user._id.toString(), user.role);

  } catch (error) {
    console.error('Registration Error:', error);
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }

  redirect('/dashboard');
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = LoginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input.',
    };
  }

  const { data } = validatedFields;

  let redirectPath = '/dashboard';

  try {
    await connectDB();

    const user = await User.findOne({ email: data.email }).select('+password');
    
    if (!user) {
      return {
         message: 'Invalid credentials.',
      };
    }

    const passwordsMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordsMatch) {
       return {
         message: 'Invalid credentials.',
      };
    }

    await createSession(user._id.toString(), user.role);

    if (user.role === 'admin') {
      redirectPath = '/admin';
    }

  } catch (error) {
    console.error('Login Error:', error);
    return {
      message: 'Something went wrong.',
    };
  }

  redirect(redirectPath);
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
