'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { postuser } from '@/actions/server/auth';
import { getMessNames } from '@/actions/server/mess';
import { signIn } from 'next-auth/react';
import Swal from 'sweetalert2';

interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  messName: string;
  messSecretCode: string;
  agreeToTerms: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'member',
    messName: '',
    messSecretCode: '',
    agreeToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [messList, setMessList] = useState<string[]>([]);
  const [isLoadingMesses, setIsLoadingMesses] = useState(true);

  useEffect(() => {
    const loadMesses = async () => {
      try {
        setIsLoadingMesses(true);
        const result = await getMessNames();
        if (result.success) {
          setMessList(result.data);
        } else {
          console.error('Failed to load messes:', result.error);
        }
      } catch (error) {
        console.error('Error loading messes:', error);
      } finally {
        setIsLoadingMesses(false);
      }
    };

    loadMesses();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.messName) {
      newErrors.messName = 'Please select a mess';
    }

    if (!formData.messSecretCode.trim()) {
      newErrors.messSecretCode = 'Mess secret code is required';
    }

    if (!formData.agreeToTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Agreement Required',
        text: 'You must agree to the Terms of Service and Privacy Policy to continue.',
        confirmButtonColor: '#f59e0b',
      });
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const user = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accountType,
        messName: formData.messName,
        messSecretCode: formData.messSecretCode.trim(),
        selectedMess: formData.messName,
        memberSecretCode: formData.messSecretCode.trim(),
        agreeToTerms: formData.agreeToTerms,
      };

      const result = await postuser(user);

      if (result.success) {
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (loginResult?.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: 'You have been successfully logged in.',
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'Continue',
            timer: 2000,
            timerProgressBar: true,
          });

          router.push('/');
          router.refresh();
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Registration Complete',
            text: 'Please login with your credentials.',
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'Go to Login',
          }).then(() => {
            router.push('/login');
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: result.message || 'Something went wrong. Please try again.',
          confirmButtonColor: '#f59e0b',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again later.',
        confirmButtonColor: '#f59e0b',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name as keyof UserData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

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
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    disabled={isLoading}
                  >
                    <option value="member">Member</option>
                    <option value="controller">Controller</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                </div>
              </div>

              {formData.accountType === 'member' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mess Name
                    </label>
                    <div className="relative">
                      <i className="fas fa-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                      <select
                        name="messName"
                        value={formData.messName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white ${
                          errors.messName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading || isLoadingMesses}
                      >
                        <option value="">
                          {isLoadingMesses ? 'Loading messes...' : 'Select a mess'}
                        </option>
                        {messList.length > 0 ? (
                          messList.map((mess) => (
                            <option key={mess} value={mess}>
                              {mess}
                            </option>
                          ))
                        ) : (
                          <option disabled>No messes available</option>
                        )}
                      </select>
                      <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    </div>
                    {errors.messName && (
                      <p className="text-red-500 text-xs mt-1">{errors.messName}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Select your mess from the list
                    </p>
                  </div>
                </>
              )}

              {formData.accountType === 'controller' && (
                <>
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
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                          errors.messName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your mess name"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.messName && <p className="text-red-500 text-xs mt-1">{errors.messName}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the name of your mess
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mess Secret Code
                </label>
                <div className="relative">
                  <i className="fas fa-key absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    name="messSecretCode"
                    value={formData.messSecretCode}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.messSecretCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter secret code"
                    disabled={isLoading}
                  />
                </div>
                {errors.messSecretCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.messSecretCode}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.accountType === 'controller'
                    ? 'Enter your mess secret code for verification'
                    : 'Enter the secret code provided by your mess controller'}
                </p>
              </div>

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
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  disabled={isLoading}
                />
                <label className="text-sm text-gray-600 cursor-pointer flex-1">
                  I agree to the{' '}
                  <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
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