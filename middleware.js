import { NextResponse } from "next/server"

export function middleware(request) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define protected routes
  const isProtectedRoute = path.startsWith("/admin")

  // Check if the route is protected and if the user is authenticated
  if (isProtectedRoute) {
    // We'll handle authentication in the client-side component
    // This middleware just ensures that API routes are protected

    // For API routes, we'll check the Authorization header
    if (path.startsWith("/api/") && path !== "/api/contact") {
      const authHeader = request.headers.get("Authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // The actual token verification will happen in the API route
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
