import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iam } from '../lib/selise';

interface Props {
  setUser: (user: any) => void;
}

export default function OidcCallback({ setUser }: Props) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const redirectUri = import.meta.env.VITE_BLOCKS_OIDC_REDIRECT_URI
      || `${window.location.origin}/oidc`;

    if (!code) {
      setError('No authorization code found.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    iam.authenticateWithOIDC(code, redirectUri)
      .then(user => {
        setUser(user);
        navigate('/dashboard');
      })
      .catch(err => {
        setError(err.message || 'Google sign-in failed.');
        setTimeout(() => navigate('/login'), 2000);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F7] flex flex-col items-center justify-center">
      {error ? (
        <p className="text-red-500 font-semibold">{error} Redirecting...</p>
      ) : (
        <>
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-mono">Completing sign-in...</p>
        </>
      )}
    </div>
  );
}
