
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (localStorage.getItem('isAuthenticated') === 'true') {
      router.replace('/');
    }
  }, [router]);

  const handleLogin = () => {
    // In a real app, you'd validate credentials here
    console.log("Attempting to log in with email and password...");
    localStorage.setItem('isAuthenticated', 'true');
    router.replace('/');
  };

  const handleGoogleLogin = () => {
    console.log("Attempting to log in with Google...");
    localStorage.setItem('isAuthenticated', 'true');
    router.replace('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
               <Wrench className="w-8 h-8 text-primary" />
               <CardTitle className="text-3xl font-bold text-primary">GarageHub</CardTitle>
            </div>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleLogin}>Sign in</Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
