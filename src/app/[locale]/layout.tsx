import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../globals.css';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang={locale} data-theme="dark">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {user ? (
            <AppShell user={user}>{children}</AppShell>
          ) : (
            children
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
