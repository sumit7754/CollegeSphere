import React, { useCallback } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { graphqlClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';
import { useQueryClient } from '@tanstack/react-query';

const SignInBox: React.FC = () => {
  const queryClient = useQueryClient();

  const handleGoogleLogin = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) {
        return toast.error('Google Token not found');
      }

      try {
        const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken });
        toast.success('Verified successfully');

        if (verifyGoogleToken) {
          window.localStorage.setItem('token', verifyGoogleToken);
          await queryClient.invalidateQueries({ queryKey: ['current-user'] });
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    },
    [queryClient],
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold">Sign In to Continue</h2>
          <p className="text-sm text-gray-400">Unlock more features by signing in.</p>
        </div>
        <GoogleLogin onSuccess={handleGoogleLogin} />
      </div>
    </div>
  );
};

export default SignInBox;
