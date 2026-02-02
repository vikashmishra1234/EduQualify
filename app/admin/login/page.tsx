'use client';

import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, AuthState } from "@/app/actions/auth"
import { LockKeyhole } from "lucide-react"

const initialState: AuthState = {
  message: '',
  errors: {}
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-50">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-800 rounded-full">
               <LockKeyhole className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
          <CardDescription className="text-slate-400">
            Secure login for administrators
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={formAction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="text" 
                placeholder="admin@123" 
                required 
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-indigo-500"
              />
               {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-slate-800 border-slate-700 text-white focus:ring-indigo-500"
              />
               {state?.errors?.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
            </div>

            {state?.message && <p className="text-sm text-red-500 text-center">{state.message}</p>}

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={isPending}>
               {isPending ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
           <Link href="/login" className="text-sm text-slate-400 hover:text-indigo-400">
             Not an admin? Go to Student Login
           </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
