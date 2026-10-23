'use client';

export default function UserInformationPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      
      {/* كارت المعلومات الشخصية */}
      <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* الصورة الرمزية */}
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-700 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md shadow-amber-900/10">
            أ
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-slate-900">admin</div>
            <div className="text-slate-400 text-xs mb-2">admin@gmail.com</div>
            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/60">
              مدير النظام
            </span>
          </div>
        </div>

        {/* معلومات المادة والمعلمة */}
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-right w-full sm:w-auto">
          <div className="text-xs text-amber-800 font-bold mb-1">🏛️ مادة الدراسات الاجتماعية</div>
          <div className="text-sm font-black text-slate-900">الصف الثاني الإعدادي • الترم الأول</div>
          <div className="text-xs text-slate-600 mt-1">إشراف المعلمة: <span className="font-bold text-amber-900">رقا هاني أحمد</span></div>
        </div>
      </div>

      {/* إحصائيات سفلية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* كارت استفسارات محفوظة */}
        <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-amber-700 mb-3 bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">0</div>
          <div className="text-slate-500 text-xs font-medium">استفسارات محفوظة</div>
        </div>

        {/* كارت دروس متاحة */}
        <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-amber-700 mb-3 bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 1.253 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">2</div>
          <div className="text-slate-500 text-xs font-medium">دروس متاحة (الوحدة الأولى)</div>
        </div>

      </div>

    </div>
  );
}