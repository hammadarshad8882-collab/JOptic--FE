'use client';

import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/components/googleLoginButton';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slics/auth';
import toast from 'react-hot-toast';
import { useSearchParams} from 'next/navigation';
export default function LoginPage() {
  const router = useRouter();
const dispatch = useDispatch();
const searchParams = useSearchParams();

const redirect = searchParams.get('redirect');

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            credential,
          }),
        }
      );

      const data = await response.json();
           
      if (!data.success) {
        toast.error(data.message);
        return;
      }
       dispatch(setUser(data.user));
       router.push(redirect || '/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-6">
          Sign in to continue
        </h1>

        <GoogleLoginButton
          onSuccess={handleGoogleLogin}
        />
      </div>
    </div>
  );
}