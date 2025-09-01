import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});


const isPublicRoute = createRouteMatcher([
 
    "/",
    "/products",
    "/products/(.*)",
    "/api/products",
    "/api/products/(.*)",
    "/sign-in",
    "/sign-up",
    "/api/webhooks/(.*)"
  
  // Routes that require authentication
]);


export const config = {
  matcher: ["/((?!_next|.*\\..*).*)",  "/api/(.*)",  ],
  
};