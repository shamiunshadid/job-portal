"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUserAction } from '@/features/auth/server/auth.action';
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from 'lucide-react';
import Link from 'next/link';


import React, { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner';

interface LoginFormData{
    email: string;
    password: string;
}


const LoginForm: React.FC = () => {

    const [formdata, setFormdata] = useState<LoginFormData>({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleInputChange = (name: string, value: string)=>{
        setFormdata((prev)=>({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(e: FormEvent)=>{
        e.preventDefault();
        // console.log(formdata);


        try {
          const LoginData = {
            email: formdata.email.trim(),
            password: formdata.password,
          };

          const result = await loginUserAction(LoginData)
          if(result.status === "SUCCESS"){
            toast.success(result.message)
          } else{
            toast.error(result.message)
          }
        } catch (error) {
          
        }
    }

    

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6"
          >

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formdata.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=> handleInputChange("email", e.target.value)}
                  className={`pl-10 `}
                />
              </div>
            </div>


            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={formdata.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=> handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 `}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm