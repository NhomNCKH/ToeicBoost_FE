// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  // Bỏ qua static files và API routes
  if (path.startsWith('/_next') || path.startsWith('/api')) {
    return NextResponse.next();
  }

  // Nếu đã đăng nhập mà vào /login hoặc /register thì chuyển về trang dashboard tương ứng
  // Vì middleware không truy cập được localStorage để biết role, ta cứ chuyển về /
  // hoặc một trang trung gian để FE xử lý tiếp.
  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Chưa đăng nhập mà vào route cần auth → redirect login
  if (!token && !publicRoutes.includes(path)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
