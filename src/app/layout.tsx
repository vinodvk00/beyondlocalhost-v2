import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/providers/auth-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['300', '400', '700', '900'],
});

export const metadata: Metadata = {
    title: 'BeyondLocalHost',
    description: `This is my personal platform where I showcase my work, projects, and learnings. I am Vinod, a passionate developer exploring various aspects of web development, cybersecurity, and software engineering.

  Here, you'll find articles, and insights on topics ranging from programming to security operations. My goal is to share knowledge, document my learning journey, and engage with like-minded individuals.

  Feel free to explore, leave comments, and share your thoughts. Let's build a community where we can learn and grow together!`,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={'inter.className'}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <AuthProvider>
                        <Header />
                        {children}
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
