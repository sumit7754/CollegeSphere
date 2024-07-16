// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../components/ThemeProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Replace 'your-google-client-id' with your actual Google client ID
const googleClientId = '89358645670-qt1vtv6kokvbuh32hp88otm8gl8cu1pp.apps.googleusercontent.com';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className={cn(fontSans.variable)}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
        <Toaster />
        <ReactQueryDevtools />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
