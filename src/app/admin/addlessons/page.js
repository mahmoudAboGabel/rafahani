
'use client';

import { useRef, useState } from 'react';
import {
  ENDPOINTS,
  postJSON,
  postFormData,
} from '../../Apiconfig';

const INITIAL_FORM = {
  title: '',
  description: '',
  explanation: '',
  summary: '',
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB per file

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileType = (file) => {
  if (file.type.startsWith('image/')) return 'صورة';
  if (file.type.startsWith('video/')) return 'فيديو';
  if (file.type === 'application/pdf') return 'PDF';
  return 'ملف';
};

export default function AddLessonsPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const fileInputRef = useRef(null);

  const updateField = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      const supportedType =
        file.type.startsWith('image/') ||
        file.type.startsWith('video/') ||
        file.type === 'application/pdf';

      if (!supportedType) {
        errors.push(`الملف ${file.name} ليس صورة أو فيديو أو PDF`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`حجم الملف ${file.name} أكبر من 100 MB`);
        return;
      }

      validFiles.push(file);
    });

    setFiles((prev) => {
      const combined = [...prev];

      validFiles.forEach((file) => {
        const alreadyExists = combined.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!alreadyExists) {
          combined.push(file);
        }
      });

      return combined;
    });

    setMessageType(errors.length ? 'error' : 'success');
    setMessage(errors.join(' | '));

    // يسمح باختيار نفس الملف مرة أخرى
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();

      data.append('Title', formData.title);
      data.append('Description', formData.description);
      data.append('Explanation', formData.explanation);
      data.append('Summary', formData.summary || '');

      // إضافة جميع الملفات تحت المفتاح Files
      files.forEach((file) => {
        data.append('Files', file);
      });

      const result = await postFormData(
        ENDPOINTS.CreateLesson,
        data
      );

      setMessage(
        `تم إنشاء الدرس وإضافة ملفاته بنجاح. رقم الدرس: ${result.id}`
      );

      setFormData({
        title: '',
        description: '',
        explanation: '',
        summary: ''
      });

      setFiles([]);
    } catch (error) {
      setMessage(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6"
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-6 sm:px-8">
          <h1 className="text-2xl font-black text-slate-900">
            إضافة درس جديد
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            أدخل بيانات الدرس، وأرفق الصور والفيديوهات والملفات التعليمية.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {message && (
            <div
              role="status"
              className={`mb-6 rounded-xl border p-4 text-sm ${
                messageType === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* عنوان الدرس */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                عنوان الدرس *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
                value={formData.title}
                onChange={updateField}
                disabled={loading}
                placeholder="مثال: مقدمة في قواعد البيانات"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* وصف الدرس */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                وصف الدرس *
              </label>

              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={updateField}
                disabled={loading}
                placeholder="اكتب وصفًا مختصرًا يظهر للطلاب..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* الشرح */}
            <div>
              <label
                htmlFor="explanation"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                شرح الدرس الكامل *
              </label>

              <textarea
                id="explanation"
                name="explanation"
                required
                rows={8}
                value={formData.explanation}
                onChange={updateField}
                disabled={loading}
                placeholder="اكتب شرح الدرس بالتفصيل..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* الملخص */}
            <div>
              <label
                htmlFor="summary"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                ملخص الدرس
                <span className="mr-2 font-normal text-slate-400">
                  (اختياري)
                </span>
              </label>

              <textarea
                id="summary"
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={updateField}
                disabled={loading}
                placeholder="أهم النقاط والمعلومات التي يجب تذكرها..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* ملفات الدرس */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                ملفات الدرس
                <span className="mr-2 font-normal text-slate-400">
                  (اختياري)
                </span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                onChange={handleFilesChange}
                disabled={loading}
                className="hidden"
                id="lesson-files"
              />

              <label
                htmlFor="lesson-files"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
                    />
                  </svg>
                </span>

                <span className="text-sm font-bold text-slate-700">
                  اضغط لاختيار الملفات
                </span>

                <span className="mt-2 text-xs text-slate-500">
                  صور، فيديوهات، ملفات PDF — يمكنك تحديد عدة ملفات
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  الحد الأقصى في الواجهة: 100 MB لكل ملف
                </span>
              </label>

              {files.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">
                      الملفات المختارة
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {files.length} ملف
                    </span>
                  </div>

                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                        {file.type.startsWith('image/')
                          ? 'IMG'
                          : file.type.startsWith('video/')
                            ? 'VID'
                            : 'PDF'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {getFileType(file)} • {formatFileSize(file.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={loading}
                        aria-label={`حذف ${file.name}`}
                        className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* زر الحفظ */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {loading
                ? 'جاري إنشاء الدرس ورفع الملفات...'
                : 'حفظ ونشر الدرس'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
