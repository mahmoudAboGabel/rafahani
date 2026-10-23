'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ENDPOINTS, getJSON } from '../Apiconfig';

export default function LessonDetailsPage() {
  const params = useParams();
  const lessonId = params?.id || 1;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // بيانات افتراضية مطابقة للصورة تماماً في حال عدم توفر الـ API
  const defaultLessonData = {
    id: lessonId,
    title: "الشبكات والإنترنت",
    category: "شبكات",
    description: "كيف تتصل الأجهزة ببعضها وكيف تنتقل البيانات عبر الإنترنت.",
    explanation: "الشبكة مجموعة أجهزة متصلة تتبادل البيانات والموارد.\n\nمن أنواعها: LAN المحلية و WAN الواسعة، والإنترنت أكبر شبكة في العالم.\n\nتعتمد الشبكات على بروتوكولات مثل TCP/IP لتنظيم نقل البيانات، ولكل جهاز عنوان IP.",
    summary: "• الشبكة = أجهزة متصلة\n• LAN و WAN\n• بروتوكول TCP/IP وعناوين IP",
    resources: [
      { id: 1, resourceType: "PDF", title: "أنواع-الشبكات.pdf", urlOrPath: "#" },
      { id: 2, resourceType: "PDF", title: "ملخص-البروتوكولات.pdf", urlOrPath: "#" },
      { id: 3, resourceType: "Link", title: "Cloudflare: ما هو الإنترنت", urlOrPath: "https://cloudflare.com" },
      { id: 4, resourceType: "Video", title: "Computer Networks: Crash Course", urlOrPath: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: 5, resourceType: "Image", title: "مخطط الشبكة", urlOrPath: "" },
      { id: 6, resourceType: "Image", title: "كابلات الشبكة", urlOrPath: "" },
      { id: 7, resourceType: "Image", title: "الموجه Router", urlOrPath: "" }
    ]
  };

  useEffect(() => {
    async function fetchLessonDetails() {
      try {
        const url = ENDPOINTS.GetLesson ? ENDPOINTS.GetLesson.replace('${Id}', lessonId) : `https://localhost:7264/api/lessons/${lessonId}`;
        const data = await getJSON(url, true);
        if (data) {
          setLesson(data);
        } else {
          setLesson(defaultLessonData);
        }
      } catch {
        setLesson(defaultLessonData);
      } finally {
        setLoading(false);
      }
    }
    fetchLessonDetails();
  }, [lessonId]);

  const currentLesson = lesson || defaultLessonData;
  const resources = currentLesson.resources || [];

  const pdfs = resources.filter(r => r.resourceType === "PDF" || r.ResourceType === "PDF");
  const links = resources.filter(r => r.resourceType === "Link" || r.ResourceType === "Link");
  const videos = resources.filter(r => r.resourceType === "Video" || r.ResourceType === "Video");
  const images = resources.filter(r => r.resourceType === "Image" || r.ResourceType === "Image");

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-right">
      
      {/* زر العودة للدروس */}
      <div className="mb-6">
        <Link href="/lessons" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <span>العودة للدروس</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* رأس الصفحة (العنوان والتصنيف والوصف) */}
      <div className="mb-8">
        <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {currentLesson.category || "شبكات"}
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          {currentLesson.title || currentLesson.Title}
        </h1>
        <p className="text-slate-500 text-sm">
          {currentLesson.description || currentLesson.Description}
        </p>
      </div>

      {/* تخطيط الشبكة للصفحة (يمين ويسار) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* العمود الأيمن: الملخص وملفات الـ PDF والروابط */}
        <div className="space-y-6">
          
          {/* كارت الملخص */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-100 shadow-sm">
            <h3 className="font-bold text-base text-blue-900 mb-4 text-right">الملخص</h3>
            <div className="space-y-2.5 text-slate-700 text-xs leading-relaxed">
              {(currentLesson.summary || currentLesson.Summary || "").split('\n').map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 justify-end">
                  <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></span>
                </div>
              ))}
            </div>
          </div>

          {/* كارت ملفات الـ PDF */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 mb-4">ملفات PDF</h3>
            <div className="space-y-3">
              {pdfs.length > 0 ? pdfs.map((pdf, idx) => (
                <a 
                  key={idx}
                  href={pdf.urlOrPath || pdf.UrlOrPath || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors text-xs"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="font-medium text-slate-700 truncate">{pdf.title || pdf.Title}</span>
                </a>
              )) : (
                <div className="text-slate-400 text-xs text-center py-2">لا توجد ملفات PDF</div>
              )}
            </div>
          </div>

          {/* الروابط المرتبطة */}
          {links.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 mb-4">روابط مفيدة</h3>
              <div className="space-y-3">
                {links.map((lnk, idx) => (
                  <a 
                    key={idx}
                    href={lnk.urlOrPath || lnk.UrlOrPath || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors text-xs"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="font-medium text-blue-600 truncate">{lnk.title || lnk.Title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* العمود الأيسر (الأوسع): الشرح، الفيديو التعليمي، ومعرض الصور */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* كارت الشرح */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-4">الشرح</h3>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-3">
              {currentLesson.explanation || currentLesson.Explanation}
            </div>
          </div>

          {/* كارت الفيديو التعليمي */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-4">الفيديو التعليمي</h3>
            <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="فيديو الشرح"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* معرض الصور */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-6">معرض الصور</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["مخطط الشبكة", "كابلات الشبكة", "الموجه Router"].map((imgTitle, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-2xl p-6 h-36 flex items-end justify-center border border-blue-100 shadow-sm text-blue-900 font-bold text-xs">
                  {imgTitle}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}