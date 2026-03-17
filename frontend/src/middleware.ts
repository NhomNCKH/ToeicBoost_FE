// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // TẠM THỜI COMMENT HẾT ĐỂ TEST
  // const token = request.cookies.get('token')?.value
  // const path = request.nextUrl.pathname

  // // Public routes - không cần đăng nhập
  // const publicRoutes = ['/', '/login', '/register']
  // if (publicRoutes.includes(path)) {
  //   return NextResponse.next()
  // }

  // // Kiểm tra token
  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // const userRole = getUserRole(token)

  // // Admin routes - chỉ admin mới vào được
  // if (path.startsWith('/admin')) {
  //   if (userRole !== 'admin') {
  //     return NextResponse.redirect(new URL('/dashboard', request.url))
  //   }
  // }

  // // Student routes - học viên hoặc admin đều vào được
  // if (path.startsWith('/student')) {
  //   if (userRole !== 'student' && userRole !== 'admin') {
  //     return NextResponse.redirect(new URL('/', request.url))
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}