import  { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Github, Mail, Eye, EyeOff,Command } from 'lucide-react';

import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle"
import { ThemeProvider } from "@/components/theme-provider"
import Loading from '@/layout/loading';


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login/`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token);
        
        // Check user status and navigate accordingly
        const token = response.data.token;
        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const userData = userResponse.data;

        if (userData.role === 'admin') {
          navigate('/dashboard');
        }
        // this for anas not working :
         else if (userData.role === 'user') {
          try {
            const accountResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/accounts/user/${userData.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            if (accountResponse.data && accountResponse.data.success) {
              navigate('/user/tasks');
            } else {
              navigate('/user/add-account');
            }
          } catch (error) {
            navigate('/user/add-account');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      if (error.response && error.response.status === 401) {
        setError('Invalid credentials');
      } else if (error.response && error.response.status === 419) {
        setError('CSRF token mismatch. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <div className={cn("min-h-screen bg-background text-foreground transition-colors")}>
        <div className="flex min-h-screen">
          {/* Left side with image and text */}
          <div className="relative hidden w-1/2 lg:block bg-transparent bg-clip-bg bg-gradient-to-r from-purple-400 to-gray-300 dark:from-purple-950 dark:to-gray-900 p-10 border-r">
            <div className="flex items-center gap-2">
              <Command className="h-6 w-6" />
              <span className="text-lg font-medium">Acme Inc</span>
            </div>
            <div className="absolute inset-0 p-10 flex items-center justify-center">
              <blockquote className="space-y-2 mt-auto">
                <p className="text-lg italic leading-relaxed">
                  &ldquo;This app has streamlined my workflow, saving me countless hours and allowing me to manage construction projects more efficiently than ever before.&rdquo;
                </p>
                <footer className="text-sm text-right font-medium">— Sofia Davis</footer>
              </blockquote>
            </div>
          </div>

          {/* Right side with login form */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex justify-end p-4">
              <ThemeToggle />
            </div>
            <div className="container flex flex-col items-center justify-center flex-grow">
              <div className="mx-auto flex w-full flex-col justify-center space-y-7 sm:w-[385px]">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground">Login</h1>
                  <p className="text-base text-muted-foreground">
                    Enter your email and password to login to your account
                  </p>
                </div>
                <div className="grid gap-5">
                  <form onSubmit={handleLogin}>
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          className="text-xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="pr-10 text-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-6 w-6 text-muted-foreground" />
                            ) : (
                              <Eye className="h-6 w-6 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </div>
                      {error && <p className="text-red-500">{error}</p>}
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label
                          htmlFor="remember"
                          className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                      <Button className="w-full text-md" type="submit">
                        Login
                      </Button>
                    </div>
                  </form>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" className="text-lg">
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button variant="outline" type="button" className="text-lg">
                      <Mail className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 text-center text-base">
                  <div className="text-muted-foreground">
                    Don't have an account?{" "}
                    <a href="/sign-up" className="text-primary underline underline-offset-4 hover:text-primary/90">
                      Sign up
                    </a>
                  </div>
                  <a
                    href="/forgot-password"
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

