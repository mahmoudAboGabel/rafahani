"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ENDPOINTS,
  getJSONWithRefresh,
  clearAuthTokens,
} from "@/app/Apiconfig";

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function fetchUser() {
      try {
        setLoading(true);
        setError("");
        // get user data
        const data = await getJSONWithRefresh(
          ENDPOINTS.GetCurrentUser
        );

        if (active) {
          setUser(data.user ?? data.data ?? data);
        }
      } catch (err) {
        if (!active) return;

        setError(err.message);

        // وجّه المستخدم لتسجيل الدخول عند فشل الجلسة
        if (
          err.message === "انتهت جلسة تسجيل الدخول" ||
          err.message ===
            "لم يرجع الخادم Access Token جديدًا"
        ) {
          clearAuthTokens();
          router.replace("/users/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div
      className="max-w-4xl mx-auto px-6 py-12 text-right"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-8 md:p-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-100">🏛️</span>
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              عن منصة الدراسات الاجتماعية
            </h1>
            <p className="text-xs text-amber-800 font-bold mt-1">
              الصف الثاني الإعدادي • الترم الأول • إشراف المعلمة: رقا هاني أحمد
            </p>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          تُقدم هذه المنصة الشاملة منهج الدراسات الاجتماعية المطور، وتغطي الوحدة الأولى
          &quot;الحضارة القديمة في قارة أوروبا وعلاقتها بمصر&quot; (الحضارة اليونانية والحضارة الرومانية)،
          مدعومة بنظام المساعد الذكي لمساعدة الطلاب على استيعاب المفاهيم والتواصل الحضاري والتاريخي بسهولة.
        </p>

        <div className="border-t border-amber-100/80 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>👤</span> بيانات حسابك
          </h2>

          {loading ? (
            <p className="text-slate-500 text-sm">جاري تحميل بيانات المستخدم...</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : user ? (
            <div className="space-y-3 text-sm text-slate-700 bg-amber-50/40 p-5 rounded-2xl border border-amber-100">
              <p>
                <strong className="text-slate-900">الاسم:</strong>{" "}
                {user.name ??
                  user.fullName ??
                  user.userName ??
                  "غير متوفر"}
              </p>

              <p>
                <strong className="text-slate-900">البريد الإلكتروني:</strong>{" "}
                {user.email ?? "غير متوفر"}
              </p>
              
              <p>
                <strong className="text-slate-900">رقم التعريف:</strong>{" "}
                {user.id ?? "غير متوفر"}
              </p>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">لا توجد بيانات مستخدم.</p>
          )}
        </div>

        <div className="border-t border-amber-100/80 mt-6 pt-6 text-slate-400 text-xs">
          تم تطوير واجهات النظام التعليمي باستخدام Next.js
          و Tailwind CSS، مع دعم الاتجاه العربي RTL والتصميم المتناسب مع المادة التاريخية.
        </div>
      </div>
    </div>
  );
}