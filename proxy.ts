import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";


export default async function proxy(request: NextRequest) {
    const session = await getSession();
    const isDashboardPath = request.nextUrl.pathname.startsWith("/dashboard");
    if (isDashboardPath && !session?.user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const isSignInPath = request.nextUrl.pathname.startsWith("/sign-in");
    const isSignUpPath = request.nextUrl.pathname.startsWith("/sign-up");
    if ((isSignInPath || isSignUpPath) && session?.user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}