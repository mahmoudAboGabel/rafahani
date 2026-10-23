'use client';
import { useState } from 'react';
import { ENDPOINTS, postJSON } from '../../Apiconfig';

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Student'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await postJSON(ENDPOINTS.register, formData, true);
      setMessage('تم إنشاء الحساب بنجاح!');
      setFormData({ fullName: '', email: '', password: '', role: 'Student' });
    } catch (err) {
      setMessage(`خطأ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8 text-right">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <h1 className="text-2xl font-black text-slate-900 mb-6">إضافة مستخدم جديد</h1>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-xs font-medium ${message.includes('نجاح') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">الاسم الكامل</label>
            <input 
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white"
              placeholder="محمود عماد"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">البريد الإلكتروني</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white"
              placeholder="user@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">كلمة المرور</label>
            <input 
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">الدور (Role)</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white"
            >
              <option value="Student">طالب</option>
              <option value="Teacher">معلم</option>
              <option value="Admin">مدير</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-200 transition-colors text-sm mt-2"
          >
            {loading ? "جاري الإضافة..." : "حفظ المستخدم"}
          </button>
        </form>
      </div>
    </div>
  );
}