import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
}
