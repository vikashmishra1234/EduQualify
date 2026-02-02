'use client';

import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, AuthState } from "@/app/actions/auth"

const initialState: AuthState = {
  message: '',
  errors: {}
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white">Sign in</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                className="bg-zinc-950/50 border-zinc-700/50 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all"
            />
             {state?.errors?.email && <p className="text-sm text-red-400">{state.errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-zinc-950/50 border-zinc-700/50 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all"
            />
             {state?.errors?.password && <p className="text-sm text-red-400">{state.errors.password}</p>}
          </div>

          {state?.message && <p className="text-sm text-red-400 text-center">{state.message}</p>}

          <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-0" type="submit" disabled={isPending}>
             {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-center text-sm text-slate-500">
        <div>
           Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-indigo-400 text-indigo-500 font-medium transition-colors">
            Sign up
          </Link> 
        </div>
      </CardFooter>
    </Card>
  )
}
