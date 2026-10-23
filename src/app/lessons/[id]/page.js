
import { Suspense } from "react";
import LessonDetailsContent from "./LessonDetailsContent";

export default function LessonDetailsPage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          className="flex min-h-[50vh] items-center justify-center"
        >
          <p className="text-sm text-gray-500">
            جاري تحميل تفاصيل الدرس...
          </p>
        </div>
      }
    >
      <LessonDetailsContent />
    </Suspense>
  );
}
