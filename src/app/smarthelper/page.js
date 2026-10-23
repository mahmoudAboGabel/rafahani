'use client';

import { useState } from 'react';
import {
  ENDPOINTS,
  postJSON,
  getAuthToken
} from '../Apiconfig';

export default function SmartHelperPage() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'ما هي أهمية موقع بلاد اليونان؟',
    'قارن بين حضارتي إسبارطة وأثينا',
    'من هو باني مدينة الإسكندرية؟',
    'ما ملامح الحكم الروماني في مصر؟'
  ];

  // تحويل الصور والفيديوهات إلى Array
  const parseMedia = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const handleSend = async (textToSend) => {
    const q = (textToSend || question).trim();

    if (!q || loading) return;

    const chatId = Date.now();

    setLoading(true);
    setQuestion('');

    setChatHistory((prev) => [
      {
        id: chatId,
        question: q,
        answer: '',
        images: [],
        videos: [],
        loading: true,
        error: false
      },
      ...prev
    ]);

    try {
      // استدعاء ASP.NET API
      const response = await postJSON(
        ENDPOINTS.askAi,
        {
          question: q
        },
        true // إرسال Access Token تلقائياً
      );

      // دعم اختلاف شكل الاستجابة
      const data = response?.data ?? response;

      // لو الـ API رجّع JSON داخل string
      const result =
        typeof data === 'string' ? JSON.parse(data) : data;

      const answer =
        result?.aiResponseText ??
        result?.AiResponseText ??
        result?.answer ??
        result?.response ??
        '';

      const images = parseMedia(
        result?.imagesJson ?? result?.ImagesJson
      );

      const videos = parseMedia(
        result?.videosJson ?? result?.VideosJson
      );

      if (!answer && images.length === 0 && videos.length === 0) {
        throw new Error('لم يتم العثور على رد في استجابة المساعد الذكي.');
      }

      setChatHistory((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                answer:
                  typeof answer === 'string'
                    ? answer
                    : JSON.stringify(answer),
                images,
                videos,
                loading: false
              }
            : item
        )
      );
    } catch (error) {
      console.error('AI API Error:', error);

      setChatHistory((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                answer:
                  error?.message ||
                  'تعذر الاتصال بالمساعد الذكي حالياً.',
                loading: false,
                error: true
              }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="max-w-4xl mx-auto px-6 py-8"
    >
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-8 flex flex-col items-center min-h-[550px]">

        {/* العنوان */}
        <div className="w-full flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-700 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-1 text-center">
            المساعد الذكي للدراسات الاجتماعية
          </h1>

          <p className="text-amber-800 text-xs font-semibold mb-8 text-center">
            إشراف أ. رقا هاني أحمد • تُحفظ استفساراتك تلقائياً في السجل
          </p>

          {/* الأسئلة المقترحة */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sq)}
                disabled={loading}
                className="bg-amber-50/60 hover:bg-amber-100 disabled:opacity-50 text-slate-700 text-xs font-medium px-4 py-2.5 rounded-full border border-amber-200/60 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* المحادثات */}
          {chatHistory.length > 0 && (
            <div className="w-full space-y-4 mb-6">
              {chatHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-amber-50/30 p-5 rounded-2xl border border-amber-100"
                >
                  {/* السؤال */}
                  <div className="font-bold text-sm text-amber-800 mb-3">
                    سؤالك: {item.question}
                  </div>

                  {/* الإجابة */}
                  <div className="font-bold text-sm text-slate-900 mb-2">
                    إجابة المساعد الذكي:
                  </div>

                  {item.loading ? (
                    <div className="text-sm text-amber-700 animate-pulse">
                      جاري توليد الإجابة...
                    </div>
                  ) : (
                    <div
                      className={`text-sm leading-8 whitespace-pre-wrap break-words ${
                        item.error ? 'text-red-600' : 'text-slate-700'
                      }`}
                    >
                      {item.answer}
                    </div>
                  )}

                  {/* الصور */}
                  {item.images?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="font-bold text-sm text-slate-800 mb-3">
                        الصور المرفقة
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.images.map((image, index) => {
                          const url =
                            typeof image === 'string'
                              ? image
                              : image?.url ??
                                image?.imageUrl ??
                                image?.src;

                          if (!url) return null;

                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={url}
                                alt={`صورة توضيحية ${index + 1}`}
                                className="w-full max-h-72 object-contain rounded-xl border border-amber-100 bg-white"
                                loading="lazy"
                              />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* الفيديوهات */}
                  {item.videos?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="font-bold text-sm text-slate-800 mb-3">
                        الفيديوهات التعليمية
                      </h3>

                      <div className="space-y-4">
                        {item.videos.map((video, index) => {
                          const url =
                            typeof video === 'string'
                              ? video
                              : video?.url ??
                                video?.videoUrl ??
                                video?.src;

                          if (!url) return null;

                          return (
                            <div key={index}>
                              <video
                                src={url}
                                controls
                                preload="metadata"
                                className="w-full rounded-xl bg-black"
                              >
                                متصفحك لا يدعم تشغيل الفيديو.
                              </video>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* إدخال السؤال */}
        <div className="w-full relative mt-6">
          <input
            type="text"
            placeholder="اكتب سؤالك في الدراسات الاجتماعية..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleSend(question)
            }
            disabled={loading}
            className="w-full bg-slate-50 border border-amber-200 rounded-2xl py-4 px-5 pl-16 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all disabled:opacity-60"
          />

          <button
            onClick={() => handleSend(question)}
            disabled={loading || !question.trim()}
            aria-label="إرسال السؤال"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white rounded-xl flex items-center justify-center shadow-md transition-colors"
          >
            <svg
              className="w-5 h-5 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}