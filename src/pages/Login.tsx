import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Chrome, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { axiosApi } from "@/hooks/useAxiosSecure";
import toast, { Toaster } from 'react-hot-toast';
import { redirect } from "react-router-dom";








const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    full_name: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


// ------------------- Auth Page -------------------
export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: isSignUp
      ? { full_name: "", email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
  });

  

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const endpoint = isSignUp ? "/auth/register/" : "/auth/login/";
      console.log(data)
        const response = await axiosApi.post(endpoint, data)
        console.log(response)
        if (response.data.access_token && response.data.refresh_token) {
            localStorage.setItem("accessToken", response.data.access_token);
            localStorage.setItem("refreshToken", response.data.refresh_token);
            toast.success("User Logged In")
            window.location.href = '/'
        }
        if(response.data && isSignUp){
            toast.success("User Registered Successfully. Log in")
        }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response?.data?.error)
        console.error("Error:", error.response.data.error,'🍏');
      } else {
        console.error("Unexpected error:", error);
      }
    } finally{
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

        <Toaster />

      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 sm:p-8">
        {/* Brand */}
        <div className="text-center mb-5">
          <h1 className="text-xl font-semibold text-gray-800">StudyFlow</h1>
          <p className="text-gray-500 text-xs">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Google Login */}
        <a
          href={`${import.meta.env.VITE_API_BASE_URL}/auth/google-login/`}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 transition cursor-pointer"
        >
          <Chrome size={18} className="text-gray-700" />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </a>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {isSignUp && (
            <div>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  {...form.register("full_name")}
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full Name"
                />
              </div>
              {form.formState.errors.full_name && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.full_name.message as string}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                {...form.register("email")}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.password.message as string}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          {isSignUp && (
            <div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.confirmPassword.message as string}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            {isSignUp ? loading ? "Signing Up":" Sign Up" : loading ? "Logging In":" Log In"}

          </button>
        </form>

        {/* Toggle */}
        <p className="mt-4 text-center text-xs text-gray-500">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button disabled={loading}
            onClick={() => {
              setIsSignUp(!isSignUp);
              form.reset();
            }}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
            type="button"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
