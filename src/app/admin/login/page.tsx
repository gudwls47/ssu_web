import { redirect } from "next/navigation";

// 기존 /admin/login 접근 시 공통 로그인으로 리디렉트
export default function AdminLoginRedirect() {
  redirect("/login");
}
