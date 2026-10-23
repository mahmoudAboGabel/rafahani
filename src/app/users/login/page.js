"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ENDPOINTS,
  postJSON,
  saveAuthTokens,
} from "@/app/Apiconfig";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "من فضلك أدخل بريد إلكتروني صحيح";
    } else if (formData.email.trim().length > 150) {
      newErrors.email = "البريد الإلكتروني يجب ألا يتجاوز 150 حرف";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else if (formData.password.length > 100) {
      newErrors.password = "كلمة المرور يجب ألا تتجاوز 100 حرف";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Call the API through Apiconfig.js
      const data = await postJSON(ENDPOINTS.Login, {
        email: formData.email.trim(),
        password: formData.password,
      },false);

      // Support both response shapes:
      // { value: { accessToken, refreshToken } }
      // { accessToken, refreshToken }
      const authData = data?.value ?? data?.data ?? data;

      if (!authData?.accessToken || !authData?.refreshToken) {
        throw new Error(
          "تم استلام استجابة تسجيل الدخول، لكن لم يتم العثور على رموز المصادقة."
        );
      }

      // Save both tokens using Apiconfig.js
      saveAuthTokens(
        authData.accessToken,
        authData.refreshToken
      );

      setIsSuccess(true);
      setMessage("تم تسجيل الدخول بنجاح");

      // Redirect after successful login
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);

      setIsSuccess(false);
      setMessage(
        error.message || "حدث خطأ أثناء تسجيل الدخول"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-100 px-4"
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              تسجيل الدخول
            </h1>

            <p className="mt-2 text-gray-500">
              قم بتسجيل الدخول إلى حسابك
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              role="status"
              className={`mb-5 rounded-lg px-4 py-3 text-sm ${
                isSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                البريد الإلكتروني
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={150}
                placeholder="example@email.com"
                aria-invalid={Boolean(errors.email)}
                className={`w-full rounded-lg border px-4 py-3 text-left outline-none transition ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                dir="ltr"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                كلمة المرور
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                maxLength={100}
                placeholder="********"
                aria-invalid={Boolean(errors.password)}
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />

              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 text-center text-sm text-gray-600">
            ليس لديك حساب؟

            <a
              href="/users/register"
              className="mr-1 font-semibold text-blue-600 hover:text-blue-700"
            >
              إنشاء حساب
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}