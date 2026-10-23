'use client';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-right">
      <h1 className="text-2xl font-black text-slate-900 mb-6">لوحة تحكم المدير</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* بطاقة إضافة درس */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">إدارة وتدريس المحتوى</h3>
            <p className="text-slate-400 text-xs mb-6">إضافة دروس جديدة، رفع ملفات PDF، وإرفاق روابط الشرح والفيديوهات.</p>
          </div>
          <Link 
            href="/admin/addlessons"
            className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-md shadow-blue-200"
          >
            إضافة درس جديد
          </Link>
        </div>

        {/* بطاقة إضافة مستخدم */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">إدارة المستخدمين والأدوار</h3>
            <p className="text-slate-400 text-xs mb-6">إنشاء حسابات جديدة للطلاب أو المعلمين وتحديد الصلاحيات.</p>
          </div>
          <Link 
            href="/admin/adduser"
            className="bg-slate-900 hover:bg-slate-800 text-white text-center font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-md"
          >
            إضافة مستخدم جديد
          </Link>
        </div>

      </div>
    </div>
  );
}