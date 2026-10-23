"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ENDPOINTS,
  getJSON,
  postFormData,
} from "@/app/Apiconfig";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    confirmPassword: "",
    formFile: null,
    Area: "",
    Address: "",
    emailConfirmed: false,
    roleName: "Customer",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // =========================
  // Handle Change
  // =========================
  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : type === "file"
        ? files?.[0] || null
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  // =========================
  // Validate Form
  // =========================
  const validateForm = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "تأكيد كلمة المرور مطلوب";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "كلمتا المرور غير متطابقتين";
    }

    // Phone
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
    }

    // Area
    if (!formData.Area.trim()) {
      newErrors.Area = "المنطقة مطلوبة";
    }

    // Address
    if (!formData.Address.trim()) {
      newErrors.Address = "العنوان مطلوب";
    }

    // Role
    if (!formData.roleName.trim()) {
      newErrors.roleName = "Role Name مطلوب";
    }

    // Profile Image
    if (formData.formFile) {
      const file = formData.formFile;

      if (!(file instanceof File)) {
        newErrors.formFile = "من فضلك اختر صورة صحيحة";
      } else if (!file.type.startsWith("image/")) {
        newErrors.formFile =
          "من فضلك اختر ملف صورة صحيح";
      } else if (file.size > 5 * 1024 * 1024) {
        newErrors.formFile =
          "حجم الصورة يجب ألا يتجاوز 5 ميجابايت";
      } else if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(file.type)
      ) {
        newErrors.formFile =
          "مسموح فقط بصور JPG أو PNG أو WEBP أو GIF";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Handle Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const dataToSend = new FormData();

      // Text fields
      dataToSend.append("FullName", formData.fullName);
      dataToSend.append("Email", formData.email);
      dataToSend.append("Password", formData.password);
      dataToSend.append(
        "PhoneNumber",
        formData.phoneNumber
      );
      dataToSend.append(
        "ConfirmPassword",
        formData.confirmPassword
      );

      dataToSend.append("Area", formData.Area);
      dataToSend.append("Address", formData.Address);

      dataToSend.append(
        "EmailConfirmed",
        String(formData.emailConfirmed)
      );

      dataToSend.append(
        "RoleName",
        formData.roleName
      );

      // Image
      if (formData.formFile) {
        dataToSend.append(
          "FormFile",
          formData.formFile
        );
      }

      // API Request
      const data = await postFormData(
        ENDPOINTS.register,
        dataToSend
      );

      // Check response
      if (!data?.value?.id) {
        throw new Error(
          "تم إنشاء الحساب ولكن لم يتم استلام Registration Id"
        );
      }

      // Go to Verify Email
      router.push(
        `/users/VerifyEmail?Id=${data.value.id}`
      );
    } catch (error) {
      console.error(
        "Register Error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إنشاء الحساب"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-100 px-4 py-10"
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              إنشاء حساب
            </h1>

            <p className="mt-2 text-gray-500">
              أدخل بيانات المستخدم لإنشاء حساب جديد
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                الاسم الكامل
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أحمد محمد"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.fullName
                    ? "border-red-500"
                    : "border-black-300 focus:border-blue-500"
                }`}
              />

              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>

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
                value={formData.email}
                onChange={handleChange}
                placeholder="ahmed.mohamed@example.com"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                رقم الهاتف
              </label>

              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="01012345678"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.phoneNumber
                    ? "border-red-500"
                    : "border-gray-300 focus:border-black-500"
                }`}
              />

              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.phoneNumber}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Password123!"
                minLength={8}
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                تأكيد كلمة المرور
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Password123!"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Profile Image */}
            <div>
              <label
                htmlFor="formFile"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                صورة الملف الشخصي
              </label>

              <input
                id="formFile"
                name="formFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.formFile
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              {errors.formFile && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.formFile}
                </p>
              )}
            </div>

            {/* Area */}
            <div>
              <label
                htmlFor="Area"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                المنطقة
              </label>

              <input
                id="Area"
                name="Area"
                type="text"
                value={formData.Area}
                onChange={handleChange}
                placeholder="مثال: فيصل"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.Area
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              {errors.Area && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.Area}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="Address"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                العنوان
              </label>

              <input
                id="Address"
                name="Address"
                type="text"
                value={formData.Address}
                onChange={handleChange}
                placeholder="مثال: شارع عبد العزيز"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                  errors.Address
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              {errors.Address && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.Address}
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
                ? "جاري إنشاء الحساب..."
                : "إنشاء الحساب"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center text-sm text-gray-600">
            لديك حساب بالفعل؟

            <a
              href="/users/login"
              className="mr-1 font-semibold text-blue-600 hover:text-blue-700"
            >
              تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}