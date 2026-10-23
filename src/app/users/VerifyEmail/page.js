"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
    ENDPOINTS,
    postJSON,
    saveAuthTokens,
} from "@/app/Apiconfig";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const registrationId = searchParams.get("Id");

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // لا تسمح بفتح الصفحة بدون RegistrationId
    if (!registrationId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-3">
                        رابط غير صالح
                    </h1>

                    <p className="text-gray-600 mb-5">
                        يجب الدخول إلى صفحة التحقق من خلال عملية التسجيل.
                    </p>

                    <button
                        onClick={() => router.push("/register")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                        العودة للتسجيل
                    </button>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // OTP input
    // -----------------------------------------------------------------------

    const handleOtpChange = (e) => {
        const value = e.target.value;

        // السماح بالأرقام فقط
        const numbersOnly = value.replace(/\D/g, "");

        // OTP مكون من 6 أرقام فقط
        if (numbersOnly.length <= 6) {
            setOtp(numbersOnly);
        }

        setError("");
    };

    // -----------------------------------------------------------------------
    // Verify Email
    // -----------------------------------------------------------------------

    const handleVerify = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // التأكد أن OTP مكون من 6 أرقام
        if (otp.length !== 6) {
            setError("من فضلك أدخل كود التحقق المكون من 6 أرقام.");
            return;
        }

        try {
            setLoading(true);

            // استدعاء الـ API من خلال apiConfig
            const data = await postJSON(
                ENDPOINTS.verifyEmail,
                {
                    registrationId: registrationId,
                    otp: otp,
                }
            );
            // -------------------------------------------------
            // استخراج بيانات Authentication
            // يدعم:
            // data.accessToken
            // أو:
            // data.data.accessToken
            // -------------------------------------------------
            const authData = data?.value ?? data;
            // -------------------------------------------------
            // حفظ Access Token + Refresh Token
            // -------------------------------------------------
            if (authData?.accessToken) {
                saveAuthTokens(
                    authData.accessToken,
                    authData.refreshToken
                );
            }

            console.log("Verify Email Response:", data);

            setSuccess(
                authData?.message ||
                data?.message ||
                data?.Message ||
                "تم تأكيد البريد الإلكتروني بنجاح."
            );

            // بعد نجاح التحقق
            setTimeout(() => {
                router.push("/");
            }, 1500);

        } catch (error) {
            console.error("Verify Email Error:", error);

            setError(
                error?.message ||
                "كود التحقق غير صحيح أو انتهت صلاحيته."
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------------------
    // UI
    // -----------------------------------------------------------------------

    return (
        <div
            dir="rtl"
            className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        تأكيد البريد الإلكتروني
                    </h1>

                    <p className="text-gray-500 mt-3">
                        أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
                    </p>
                </div>

                <form onSubmit={handleVerify}>

                    <label className="block text-gray-700 font-medium mb-3">
                        رمز التحقق
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="000000"
                        className="w-full text-center text-3xl tracking-[12px] border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-sm text-gray-500 mt-3 text-center">
                        يجب أن يتكون الرمز من 6 أرقام
                    </p>

                    {error && (
                        <div className="mt-5 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-5 bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-center">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
                    >
                        {loading
                            ? "جاري التحقق..."
                            : "تأكيد البريد الإلكتروني"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div>Loading verification...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}