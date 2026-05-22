import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // If env vars are missing (e.g. in Vercel before user adds them), skip auth check
    // and just do locale redirect to avoid crashing the edge function and returning 404.
    const pathname = request.nextUrl.pathname;
    const isAuthPage = pathname.includes('/auth');
    if (!isAuthPage) {
      const locale = pathname.split('/')[1] || 'es';
      const validLocale = ['es', 'gl', 'en'].includes(locale) ? locale : 'es';
      return NextResponse.redirect(new URL(`/${validLocale}/auth`, request.url));
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.includes('/auth');

  if (!user && !isAuthPage) {
    const locale = pathname.split('/')[1] || 'es';
    const validLocale = ['es', 'gl', 'en'].includes(locale) ? locale : 'es';
    return NextResponse.redirect(new URL(`/${validLocale}/auth`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(es|gl|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
