'use client';

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ENDPOINTS,
  getJSON,
  getAuthToken,
  clearAuthTokens,
} from "@/app/Apiconfig";

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(() => {
    let isMounted = true;
    let requestId = 0;

    async function loadCurrentUser() {
      const currentRequestId = ++requestId;
      const token = getAuthToken();

      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoadingUser(false);
        }
        return;
      }

      try {
        const data = await getJSON(ENDPOINTS.GetCurrentUser);

        const currentUser =
          data?.user ??
          data?.User ??
          data?.data?.user ??
          data?.data?.User ??
          data?.data ??
          data;

        if (isMounted && currentRequestId === requestId) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to load current user:", error);

        if (isMounted && currentRequestId === requestId) {
          // لا تُخفِ الروابط بسبب خطأ شبكة عابر إذا كانت الجلسة ما زالت موجودة
          if (!getAuthToken()) {
            setUser(null);
          }
        }
      } finally {
        if (isMounted && currentRequestId === requestId) {
          setLoadingUser(false);
        }
      }
    }

    function handleAuthChange() {
      loadCurrentUser();
    }

    loadCurrentUser();

    // تحديث بيانات المستخدم بعد تسجيل الدخول أو تجديد التوكن
    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);


  function handleLogout() {
    clearAuthTokens();
    setUser(null);
    window.location.href = "/";
  }

  const userName =
    user?.fullName ||
    user?.name ||
    user?.userName ||
    user?.username ||
    user?.email ||
    "المستخدم";

  const isLoggedIn = Boolean(user);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-amber-50/30 min-h-screen text-slate-800 font-sans selection:bg-amber-500 selection:text-white">
        <header className="bg-white/95 backdrop-blur-md border-b border-amber-100 py-3 px-4 sm:px-6 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

            {/* جهة اليمين: الشعار وزر القائمة للموبايل */}
            <div className="flex items-center gap-3">
              {/* زر القائمة للموبايل */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
                aria-label="القائمة"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              <Link
                href="/"
                className="flex items-center gap-2 text-amber-900 font-bold shrink-0"
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs sm:text-sm font-black text-slate-900">الدراسات الاجتماعية</span>
                  <span className="text-[10px] sm:text-xs text-amber-700 font-semibold">الثاني الإعدادي • أ. رقا هاني</span>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 1.253 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* الوسط: روابط التنقل للشاشات الكبيرة */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600">
              {isLoggedIn && (
                <>
                  <Link href="/about" className="flex items-center gap-1.5 hover:text-amber-700 transition-colors">
                    الملف الشخصي
                  </Link>
                  <Link href="/userhistory" className="flex items-center gap-1.5 hover:text-amber-700 transition-colors">
                    السجل المحفوظ
                  </Link>
                  <Link href="/smarthelper" className="flex items-center gap-1.5 hover:text-amber-700 transition-colors">
                    المساعد الذكي
                  </Link>
                </>
              )}
              <Link href="/" className="flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-100/60 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors">
                الدروس
              </Link>
            </nav>

            {/* جهة اليسار: بيانات المستخدم وأزرار الدخول */}
            <div className="flex items-center gap-3 shrink-0">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 max-w-[120px] truncate">
                      {userName}
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium">
                      مرحبًا بك
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors rounded-lg px-2.5 py-1.5 hover:bg-red-50 border border-red-100"
                    title="تسجيل الخروج"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">خروج</span>
                  </button>
                </div>
              ) : (
                !loadingUser && (
                  <Link
                    href="/users/login"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors bg-amber-50 px-3 py-2 rounded-xl border border-amber-200"
                  >
                    تسجيل الدخول
                  </Link>
                )
              )}
            </div>

          </div>

          {/* قائمة الموبايل المنسدلة عند الضغط على زر القائمة */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pt-3 border-t border-amber-100 flex flex-col gap-2 text-sm font-medium text-slate-700 pb-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-900 font-semibold"
              >
                📚 الدروس الرئيسية
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50"
                  >
                    👤 الملف الشخصي
                  </Link>
                  <Link
                    href="/userhistory"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50"
                  >
                    📜 السجل المحفوظ
                  </Link>
                  <Link
                    href="/smarthelper"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50"
                  >
                    🤖 المساعد الذكي
                  </Link>
                </>
              )}
            </nav>
          )}
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}