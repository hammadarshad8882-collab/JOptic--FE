// 'use client';

// import { useRouter } from 'next/navigation';
// import GoogleLoginButton from '@/components/googleLoginButton';
// import { useDispatch } from 'react-redux';
// import { setUser } from '@/store/slics/auth';
// import toast from 'react-hot-toast';
// import { useSearchParams} from 'next/navigation';
// import { Suspense } from 'react';

// function LoginPageContent() {
//   const router = useRouter();
// const dispatch = useDispatch();
// const searchParams = useSearchParams();

// const redirect = searchParams.get('redirect');

//   const handleGoogleLogin = async (credential: string) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//           body: JSON.stringify({
//             credential,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!data.success) {
//         toast.error(data.message);
//         return;
//       }
//        dispatch(setUser(data.user));
//        router.push(redirect || '/');
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-white text-2xl mb-6">
//           Sign in to continue
//         </h1>

//         <GoogleLoginButton
//           onSuccess={handleGoogleLogin}
//         />
//       </div>
//     </div>
//   );
// }

// export default function LoginPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center bg-[#050505]">
//         <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
//       </div>
//     }>
//       <LoginPageContent />
//     </Suspense>
//   );
// }
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import GoogleLoginButton from "@/components/googleLoginButton";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slics/auth";
import toast from "react-hot-toast";
import { Suspense } from "react";

function LoginPageContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            credential,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      dispatch(setUser(data.user));

      router.push(redirect || "/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
              <span className="text-black text-2xl font-bold">J</span>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 sm:p-9 shadow-2xl">
          <div className="space-y-6">
            {/* Google Login */}
            <div className="flex justify-center items-center">
              <GoogleLoginButton onSuccess={handleGoogleLogin} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Secure Login
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Security Message */}
            <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <div className="mt-0.5 text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>

              <div>
                <p className="text-sm text-gray-300">Your login is secure</p>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  We use Google authentication to keep your account safe and
                  secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
          <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
