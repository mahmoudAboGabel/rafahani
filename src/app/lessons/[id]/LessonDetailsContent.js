"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJSON, ENDPOINTS } from "../../Apiconfig";

const API_BASE_URL = "https://rafahani.runasp.net";

function getResourceUrl(path) {
  if (!path) return "";

  // لو الرابط كامل بالفعل
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // تحويل المسار النسبي لرابط كامل
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getResourceType(resource) {
  const type = (resource.resourceType || "").toLowerCase();
  const path = (resource.urlOrPath || "").toLowerCase();

  if (type === "image") return "image";
  if (type === "video") return "video";
  if (type === "link") return "link";

  if (
    type === "file" &&
    (path.endsWith(".pdf") || path.includes(".pdf?"))
  ) {
    return "pdf";
  }

  if (
    path.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)
  ) {
    return "image";
  }

  if (
    path.match(/\.(mp4|webm|ogg)(\?.*)?$/i)
  ) {
    return "video";
  }

  if (path.match(/\.pdf(\?.*)?$/i)) {
    return "pdf";
  }

  return "file";
}

export default function LessonDetailsContent() {
  const params = useParams();
  const lessonId = params?.id;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lessonId) return;

    let cancelled = false;

    async function fetchLesson() {
      setLoading(true);
      setError("");

      try {
        const url =
          typeof ENDPOINTS.GetLesson === "function"
            ? ENDPOINTS.GetLesson(lessonId)
            : `${API_BASE_URL}/api/Lessons/${lessonId}`;

        const data = await getJSON(url, true);

        if (cancelled) return;

        if (!data || !data.id) {
          throw new Error("لم يتم العثور على بيانات الدرس.");
        }

        setLesson(data);
      } catch (err) {
        if (cancelled) return;

        setError(
          err?.message ||
            "حدث خطأ أثناء تحميل الدرس. حاول مرة أخرى."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLesson();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-amber-50/20 px-4"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent shadow-md" />
          <p className="text-slate-600 font-medium">جاري تحميل الدرس التاريخي...</p>
        </div>
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main
        dir="rtl"
        className="min-h-[60vh] bg-amber-50/20 px-4 py-16"
      >
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg shadow-red-900/5">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h1 className="mb-3 text-xl font-bold text-slate-900">
            تعذر تحميل الدرس
          </h1>

          <p className="mb-6 text-sm text-red-600">
            {error || "بيانات الدرس غير متاحة."}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-2xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700 shadow-md shadow-amber-600/20"
            >
              إعادة المحاولة
            </button>

            <Link
              href="/"
              className="rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              العودة للدروس
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const resources = Array.isArray(lesson.resources)
    ? lesson.resources
    : [];

  const images = resources.filter(
    (resource) => getResourceType(resource) === "image"
  );

  const videos = resources.filter(
    (resource) => getResourceType(resource) === "video"
  );

  const documents = resources.filter((resource) => {
    const type = getResourceType(resource);
    return type === "pdf" || type === "file";
  });

  const links = resources.filter(
    (resource) => getResourceType(resource) === "link"
  );

  return (
    <main dir="rtl" className="min-h-screen bg-amber-50/20">
      {/* رأس الصفحة */}
      <section className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 px-4 py-12 text-white sm:py-16 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div className="mx-auto max-w-5xl relative z-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-amber-200 transition hover:text-white font-medium bg-amber-900/40 px-4 py-2 rounded-xl border border-amber-500/30"
          >
            <span aria-hidden="true">→</span>
            العودة إلى جميع الدروس
          </Link>

          <div className="mb-4">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-wide border border-white/20">
              تفاصيل الدرس التعليمي
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-black leading-tight sm:text-4xl text-white">
            {lesson.title || "بدون عنوان"}
          </h1>

          <p className="max-w-3xl text-base leading-8 text-amber-100">
            {lesson.description || "لا يوجد وصف لهذا الدرس."}
          </p>

          {lesson.createdAt && (
            <p className="mt-5 text-xs text-amber-200 flex items-center gap-2">
              <span>📅 تاريخ الإضافة:</span>
              <span>{new Date(lesson.createdAt).toLocaleDateString("ar-EG")}</span>
            </p>
          )}
        </div>
      </section>

      {/* محتوى الدرس */}
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:py-12">
        {/* الشرح */}
        {lesson.explanation && (
          <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 text-xl border border-amber-200/50">
                📘
              </span>
              شرح الدرس
            </h2>

            <div className="prose max-w-none text-slate-700 leading-9 whitespace-pre-wrap text-base font-normal">
              {lesson.explanation}
            </div>
          </section>
        )}

        {/* الملخص */}
        {lesson.summary && (
          <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 text-xl border border-emerald-200/50">
                📝
              </span>
              ملخص الدرس
            </h2>

            <div className="prose max-w-none text-slate-700 leading-9 whitespace-pre-wrap text-base font-normal">
              {lesson.summary}
            </div>
          </section>
        )}

        {/* الصور */}
        {images.length > 0 && (
          <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 text-xl border border-purple-200/50">
                🖼️
              </span>
              صور الدرس
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {images.map((resource) => (
                <a
                  key={resource.id}
                  href={getResourceUrl(resource.urlOrPath)}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={getResourceUrl(resource.urlOrPath)}
                    alt={resource.title || "صورة من الدرس"}
                    loading="lazy"
                    className="h-64 w-full object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
                  />

                  {resource.title && (
                    <p className="p-4 text-sm font-semibold text-slate-800 border-t border-slate-200 bg-white">
                      {resource.title}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* الفيديوهات */}
        {videos.length > 0 && (
          <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 text-xl border border-red-200/50">
                🎬
              </span>
              فيديوهات الدرس
            </h2>

            <div className="space-y-6">
              {videos.map((resource) => (
                <div
                  key={resource.id}
                  className="overflow-hidden rounded-2xl bg-black border border-slate-200 shadow-md"
                >
                  <video
                    controls
                    preload="metadata"
                    className="max-h-[550px] w-full"
                  >
                    <source
                      src={getResourceUrl(resource.urlOrPath)}
                    />
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>

                  {resource.title && (
                    <p className="bg-white p-4 text-sm font-semibold text-slate-800">
                      {resource.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* الملفات */}
        {documents.length > 0 && (
          <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 text-xl border border-amber-200/50">
                📂
              </span>
              ملفات ومراجع الدرس
            </h2>

            <div className="space-y-4">
              {documents.map((resource) => {
                const url = getResourceUrl(resource.urlOrPath);
                const isPdf = getResourceType(resource) === "pdf";

                return (
                  <div
                    key={resource.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        {isPdf ? "📕" : "📄"}
                      </span>

                      <div>
                        <p className="font-bold text-slate-800">
                          {resource.title ||
                            (isPdf ? "ملف PDF" : "ملف مرفق")}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 font-medium">
                          {isPdf ? "مستند PDF" : "ملف للتحميل أو العرض"}
                        </p>
                      </div>
                    </div>

                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 shadow-sm shadow-amber-600/20"
                    >
                      {isPdf ? "عرض الملف" : "فتح الملف"}
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* الروابط */}
        {links.length > 0 && (
          <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 text-xl border border-blue-200/50">
                🔗
              </span>
              روابط إضافية
            </h2>

            <div className="space-y-3">
              {links.map((resource) => (
                <a
                  key={resource.id}
                  href={getResourceUrl(resource.urlOrPath)}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all rounded-2xl border border-slate-200 p-4 text-amber-800 font-medium transition hover:bg-amber-50/50 bg-slate-50/50"
                >
                  {resource.title || resource.urlOrPath}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* لا توجد موارد */}
        {resources.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <p className="mb-3 text-4xl">📚</p>
            <h2 className="font-bold text-slate-800 text-lg">
              لا توجد موارد مرفقة
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              لم تتم إضافة صور أو فيديوهات أو ملفات لهذا الدرس حتى الآن.
            </p>
          </div>
        )}

        {/* العودة */}
        <div className="pb-8 text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-8 py-3.5 font-bold text-white transition hover:bg-amber-700 shadow-lg shadow-amber-600/20"
          >
            العودة إلى قائمة الدروس
          </Link>
        </div>
      </div>
    </main>
  );
}