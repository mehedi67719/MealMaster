
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postuser } from "@/actions/server/auth";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";

interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  messName: string;
  selectedMess: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "member",
    messName: "",
    selectedMess: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Password and confirm password do not match",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accountType,
        messName: formData.messName,
        selectedMess: formData.selectedMess,
      };
      
      const result = await postuser(user);
      
      if (result.success) {
  
        // await Swal.fire({
        //   icon: "success",
        //   title: "Registration Successful!",
        //   text: "Your account has been created successfully. Logging you in...",
        //   confirmButtonColor: "#f59e0b",
        //   timer: 1500,
        //   timerProgressBar: true,
        //   showConfirmButton: false,
        // });

  
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (loginResult?.ok) {
          await Swal.fire({
            icon: "success",
            title: "Welcome!",
            text: "You have been successfully logged in.",
            confirmButtonColor: "#f59e0b",
            confirmButtonText: "Continue",
            timer: 2000,
            timerProgressBar: true,
          });
          
     
          router.push('/');
          router.refresh();
        } else {
          Swal.fire({
            icon: "info",
            title: "Registration Complete",
            text: "Please login with your credentials.",
            confirmButtonColor: "#f59e0b",
            confirmButtonText: "Go to Login",
          }).then(() => {
            router.push('/login');
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: result.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#f59e0b",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later.",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const existingMesses: string[] = [
    "Green View Mess",
    "Sea Beach Mess",
    "City Tower Mess",
    "Garden Palace Mess",
    "Star Light Mess",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="px-6 pt-8 pb-6 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-plus text-3xl text-amber-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join us to get started</p>
          </div>

          <div className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="relative">
                  <i className="fas fa-user-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                    required
                    disabled={isLoading}
                  >
                    <option value="member">Member</option>
                    <option value="controller">Controller</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select how you want to register
                </p>
              </div>

              {formData.accountType === "controller" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mess Name
                  </label>
                  <div className="relative">
                    <i className="fas fa-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                      type="text"
                      name="messName"
                      value={formData.messName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your mess name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the name of your mess
                  </p>
                </div>
              )}

              {formData.accountType === "member" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Your Mess
                  </label>
                  <div className="relative">
                    <i className="fas fa-users absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <select
                      name="selectedMess"
                      value={formData.selectedMess}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select a mess</option>
                      {existingMesses.map((mess: string) => (
                        <option key={mess} value={mess}>
                          {mess}
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose your mess from the list
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <i className="fas fa-check-circle absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  required
                  disabled={isLoading}
                />
                <span className="text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-amber-600 hover:text-amber-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-amber-600 hover:text-amber-700">
                    Privacy Policy
                  </a>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}