'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
}

export default function GoogleLoginButton({
  onSuccess,
}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi-script')) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');

      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = initializeGoogle;

      document.body.appendChild(script);
    };

    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          onSuccess(response.credential);
        },
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: 'outline',
          size: 'large',
          width: 300,
          text: 'continue_with',
          
        }

      );
    };

    loadGoogleScript();
  }, [onSuccess]);

  return <div ref={buttonRef} />;
}
