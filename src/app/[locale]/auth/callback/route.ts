import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const localeMatch = request.url.match(/\/(es|gl|en)\//);
  const locale = localeMatch ? localeMatch[1] : 'es';
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return NextResponse.redirect(new URL(`/${locale}/auth?error=${encodeURIComponent(error.message)}`, request.url));
    }
  }
  
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
