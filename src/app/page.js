'use client';
import { useState, useEffect } from 'react';
import { ENDPOINTS, getJSON } from './Apiconfig';
import Link from 'next/link';

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // الدروس الافتراضية الخاصة بالوحدة (الحضارة القديمة في قارة أوربا وعلاقتها بمصر)
  const defaultLessons = [
    {
      id: 1,
      title: "الحضارة اليونانية",
      description: "الموقع الجغرافي لبلاد اليونان، أبرز حضاراتها (كريت، إسبارطة، أثينا)، والإسكندر الأكبر وح حكم البطالمة في مصر.",
      category: "التاريخ اليوناني"
    },
    {
      id: 2,
      title: "الحضارة الرومانية",
      description: "نشأة الإمبراطورية الرومانية، ملامح حضارتها، حكم الرومان لمصر وأبرز أباطرتها، والحقبة القبطية.",
      category: "التاريخ الروماني"
    }
  ];

  useEffect(() => {
    let cancelled = false;

    async function fetchLessons() {
      try {
        const data = await getJSON(
          ENDPOINTS.GetAllLessons,
          true
        );

        if (!cancelled) {
          const apiLessons = Array.isArray(data) && data.length > 0 ? data : defaultLessons;
          setLessons(apiLessons);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);

        if (!cancelled) {
          setLessons(defaultLessons);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLessons();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLessons = lessons.filter(l => 
    l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* البانر الترحيبي مع صورة خلفية تاريخية */}
      <div className="relative rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop')` }}>
        
        {/* طبقة تظليل داكنة لضمان وضوح النصوص فوق الصورة */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/70 backdrop-blur-[2px]"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-amber-800/60 text-amber-200 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-amber-500/30">
            الصف الثاني الإعدادي • الترم الأول • إشراف أ. رقا هاني أحمد
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            الحضارة القديمة في قارة أوروبا وعلاقتها بمصر 🏛️
          </h1>
          <p className="text-amber-100 text-sm md:text-base mb-8 leading-relaxed">
            استكشف تاريخ الحضارتين اليونانية والرومانية وتأثيرهما العريق والتواصل الحضاري مع مصر القديمة.
          </p>

          {/* شريط البحث */}
          <div className="relative">
            <input 
              type="text"
              placeholder="ابحث عن درس أو موضوع تاريخي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur text-slate-800 placeholder-slate-400 px-5 py-4 pr-12 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
            />
            <svg className="w-5 h-5 text-slate-400 absolute right-4 top-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-center text-slate-500 py-10 font-medium">
          جاري تحميل الدروس التاريخية...
        </p>
      )}

      {!loading && filteredLessons.length === 0 && (
        <p className="text-center text-slate-500 py-10">
          {searchQuery
            ? "لا توجد دروس تطابق بحثك."
            : "لا توجد دروس متاحة حاليًا."}
        </p>
      )}

      {/* شبكة الكروت (Cards) */}
      {!loading && filteredLessons.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="bg-white rounded-3xl p-8 border border-amber-100/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* شارة التصنيف */}
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    🏛️
                  </div>
                  <span className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200/50">
                    {lesson.category || lesson.Category || "دراسات اجتماعية"}
                  </span>
                </div>

                {/* العنوان والوصف */}
                <h3 className="font-bold text-xl text-slate-900 mb-3 text-right">
                  {lesson.title || lesson.Title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed text-right mb-8">
                  {lesson.description || lesson.Description}
                </p>
              </div>

              {/* زر البدء */}
              <Link
                href={`/lessons/${lesson.id ?? lesson.Id}`}
                className="flex items-center justify-between w-full bg-amber-50 group-hover:bg-amber-600 text-amber-800 group-hover:text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all duration-300"
              >
                <span>ابدأ الدرس الآن</span>
                <svg
                  className="w-4 h-4 rotate-180 transform group-hover:translate-x-[-4px] transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}