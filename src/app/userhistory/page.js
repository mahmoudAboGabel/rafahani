'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserHistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // يمكنك جلب السجل الحقيقي هنا من الـ API باستخدام getJSON ومسار السجل المناسب
    setHistory([]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 text-right">
            سجل الاستفسارات المحفوظة
          </h1>
          <p className="text-xs text-amber-700 mt-1">مادة الدراسات الاجتماعية • إشراف أ. رقا هاني أحمد</p>
        </div>
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 text-xl shadow-sm">
          📜
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-dashed border-amber-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <p className="text-slate-500 text-sm mb-4 font-medium">
          لا توجد استفسارات بعد. <Link href="/smarthelper" className="text-amber-700 font-bold hover:underline">أسأل المساعد الذكي</Link>
        </p>
      </div>
    </div>
  );
}