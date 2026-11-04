"use client";

import React from "react";
import Link from "next/link";
import { Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-gray flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-md bg-brand-navy flex items-center justify-center">
          <Building2 size={20} className="text-white" />
        </div>
        <span className="font-bold text-brand-navy text-xl">OnboardMate</span>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-brand-blue-light flex items-center justify-center mb-2">
            <Lock size={20} className="text-brand-blue" />
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your organization account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* UI-only form — authentication in Phase 2 */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@organization.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-brand-blue hover:underline text-xs">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" asChild>
              {/* Demo links — real auth added in Phase 2 */}
              <Link href="/app/dashboard">Sign in as Employee (demo)</Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/dashboard">Sign in as HR Admin (demo)</Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-text-muted">
            No public sign-up. Contact your HR admin for an invitation.
          </p>

          <p className="mt-2 text-center text-xs text-text-muted border-t border-surface-border pt-3">
            Demo organization: <span className="font-medium">Nexora Technologies</span><br />
            <span className="opacity-60">(fictional demonstration data)</span>
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-text-muted">
        <Link href="/" className="hover:underline">← Back to home</Link>
      </p>
    </div>
  );
}
