"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  children?: React.ReactNode
}

export function AuthModal({ children }: AuthModalProps) {
  // single source of truth for open/close
  const { login, register, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Reset password state
  const [resetEmail, setResetEmail] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)

  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login({ email: loginEmail, password: loginPassword })
      closeAuthModal()
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      })
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message ?? "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await register({
        name: `${firstName} ${lastName}`,
        email: registerEmail,
        password: registerPassword,
      })
      closeAuthModal()
      toast({
        title: "Account created!",
        description: "Welcome to LUXE. Your account has been created successfully.",
      })
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.message ?? "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // placeholder — backend not implemented
    toast({
      title: "Feature not implemented",
      description: "Password reset will be available soon.",
      variant: "destructive",
    })
  }

  return (
    // Keep the Dialog fully controlled by auth context.
    // onOpenChange ensures clicks on the trigger call openAuthModal, and closing calls closeAuthModal.
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => (open ? openAuthModal() : closeAuthModal())}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {showResetForm ? "Reset Password" : "Welcome to LUXE"}
          </DialogTitle>
        </DialogHeader>

        {showResetForm ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowResetForm(false)}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Email
              </Button>
            </div>
          </form>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* --- LOGIN TAB --- */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" variant="link" className="px-0 text-sm" onClick={() => setShowResetForm(true)}>
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            {/* --- REGISTER TAB --- */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}

        {/* Social login (unchanged) */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" disabled>
            {/* Google Button */}
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">…</svg>
            Google
          </Button>
          <Button variant="outline" disabled>
            {/* Facebook Button */}
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">…</svg>
            Facebook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
