// ---------------------------------------------------------------------------
// Central place for every Admin API endpoint, the auth-token helper, and the
// shared fetch wrappers.
// ---------------------------------------------------------------------------
// auth API base URL
export const Auth_API_BASE_URL = "https://rafahani.runasp.net/api/admin/auth";

export const Lessons_API_BASE_URL = "https://rafahani.runasp.net/api/lessons";

export const ChatHistory_API_BASE_URL = "https://rafahani.runasp.net/api/ChatHistory";


// ---------------------------------------------------------------------------
// API ENDPOINTS
// ---------------------------------------------------------------------------

export const ENDPOINTS = {
  // -------------------------------------------------------------------------
  // GET (list)
  // -------------------------------------------------------------------------
  // استرجاغ بيانات الدروس
  //https://rafahani.runasp.net/api/lessons
  GetAllLessons:`${Lessons_API_BASE_URL}`,
  // أسترجاع بينات كل درس
  //https://rafahani.runasp.net/api/lessons/1
  GetLesson: (id) => `${Lessons_API_BASE_URL}/${id}`,


  GetUserHistory: (id) => `${ChatHistory_API_BASE_URL}/user/${id}`,

  // -------------------------------------------------------------------------
  // GET (By Id)
  // -------------------------------------------------------------------------
  // GetLesson: `${Lessons_API_BASE_URL}/lessons/${Id}`,
  // GetResourcesByLesson: `${Lessons_API_BASE_URL}/lessonresources/lesson/${Id}`,
  // -------------------------------------------------------------------------
  // Post (By Id)
  // -------------------------------------------------------------------------
  CreateLesson: `${Lessons_API_BASE_URL}`,
  AddResource:`${Lessons_API_BASE_URL}/lessonresources`,
  SaveChat: `${ChatHistory_API_BASE_URL}/save`,
  askAi: `${ChatHistory_API_BASE_URL}`,
  // -------------------------------------------------------------------------
  // PUT (By Id)
  // -------------------------------------------------------------------------
  // UpdateLesson: `${Lessons_API_BASE_URL}/lessons/${Id}`,
  // -------------------------------------------------------------------------
  // Delete (By Id)
  // -------------------------------------------------------------------------
  // DeleteLesson : `${Lessons_API_BASE_URL}/lessons/${Id}`,
  // DeleteResource: `${Lessons_API_BASE_URL}/lessonresources/${Id}`,
  // -------------------------------------------------------------------------
  // Authentication (https://rafahani.runasp.net/api/admin/auth)
  // -------------------------------------------------------------------------
  register: `${Auth_API_BASE_URL}/Register`,
  verifyEmail: `${Auth_API_BASE_URL}/VerifyEmail`,
  RefreshToken: `${Auth_API_BASE_URL}/refresh-token`,
  Login: `${Auth_API_BASE_URL}/login`,
  TestAuth: `${Auth_API_BASE_URL}/TestAuth`,
  GetCurrentUser: `${Auth_API_BASE_URL}/me`
};

// ---------------------------------------------------------------------------
// Auth token
// ---------------------------------------------------------------------------

const TOKEN_STORAGE_KEY = "accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}



export function saveAuthTokens(accessToken, refreshToken) {
  if (typeof window === "undefined") return;

  try {
    if (accessToken) {
      window.localStorage.setItem("accessToken", accessToken);
    }

    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken);
    }

    // إبلاغ المكونات بتحديث بيانات تسجيل الدخول
    window.dispatchEvent(new Event("auth-changed"));
  } catch (error) {
    console.error("Failed to save authentication tokens:", error);
  }
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");

    window.dispatchEvent(new Event("auth-changed"));
  } catch (error) {
    console.error("Failed to clear authentication tokens:", error);
  }
}


export function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ---------------------------------------------------------------------------
// Arabic messages per HTTP status code
// ---------------------------------------------------------------------------

export function describeStatus(status) {
  switch (status) {
    case 400:
      return "البيانات المدخلة غير صحيحة";

    case 401:
      return "انتهت جلسة تسجيل الدخول، الرجاء تسجيل الدخول مرة أخرى";

    case 403:
      return "ليس لديك صلاحية لتنفيذ هذا الإجراء";

    case 404:
      return "الخدمة المطلوبة غير موجودة (تحقق من رابط الـ API في apiConfig.js)";

    case 500:
      return "حدث خطأ في الخادم، حاول مرة أخرى لاحقًا";

    default:
      return `حدث خطأ غير متوقع (رمز ${status})`;
  }
}

// ---------------------------------------------------------------------------
// Extract API error detail
// ---------------------------------------------------------------------------

async function parseErrorDetail(response) {
  try {
    const data = await response.clone().json();

    return (
      data?.message ||
      data?.Message ||
      data?.title ||
      data?.Title ||
      data?.error ||
      data?.errorMessage ||
      data?.ErrorMessage ||
      null
    );
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Handle API response
// ---------------------------------------------------------------------------


async function handleResponse(response) {
  if (!response.ok) {
    const detail = await parseErrorDetail(response);
    throw new Error(detail || describeStatus(response.status));
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}


// ---------------------------------------------------------------------------
// Network error
// ---------------------------------------------------------------------------

function networkErrorMessage() {
  return "تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت أو من تشغيل الـ API";
}

// ---------------------------------------------------------------------------
// GET JSON
// ---------------------------------------------------------------------------


export async function getJSON(url, authenticated = true) {
  async function sendRequest() {
    let response;

    try {
      response = await fetch(url, {
        method: "GET",
        headers: authenticated ? getAuthHeaders() : {},
        cache: "no-store",
      });
    } catch {
      throw new Error(networkErrorMessage());
    }

    return response;
  }

  let response = await sendRequest();

  // التجديد مطلوب فقط لو الطلب موثّق ورجع 401
  if (authenticated && response.status === 401) {
    await refreshAccessToken();
    response = await sendRequest();
  }

  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      clearAuthTokens();
    }

    const detail = await parseErrorDetail(response);
    throw new Error(detail || describeStatus(response.status));
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}


// ---------------------------------------------------------------------------
// POST JSON
// ---------------------------------------------------------------------------

export async function postJSON(url, body, authenticated = true) {
  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authenticated ? getAuthHeaders() : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(networkErrorMessage());
  }

  return handleResponse(response);
}

// ---------------------------------------------------------------------------
// POST FormData
// ---------------------------------------------------------------------------

export async function postFormData(url, formData) {
  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
  } catch {
    throw new Error(networkErrorMessage());
  }

  return handleResponse(response);
}

// ---------------------------------------------------------------------------
// Normalize list response
// ---------------------------------------------------------------------------

export function normalizeList(data) {
  const list = Array.isArray(data)
    ? data
    : data?.data ?? data?.items ?? [];

  return list.map((item) => ({
    id: Number(item.id ?? item.Id),
    name: String(item.name ?? item.Name ?? ""),
    categoryId: item.categoryId ?? item.CategoryId ?? null,
  }));
}




let refreshPromise = null;

export async function refreshAccessToken() {
  // منع إرسال عدة طلبات تجديد في نفس الوقت
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthTokens();
      throw new Error("انتهت جلسة تسجيل الدخول، سجل دخولك مرة أخرى");
    }

    let response;

    try {
      response = await fetch(ENDPOINTS.RefreshToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
    } catch {
      // لا تمسح التوكن عند انقطاع الشبكة مؤقتًا
      throw new Error("تعذر الاتصال بالخادم لتجديد تسجيل الدخول");
    }

    if (!response.ok) {
      clearAuthTokens();
      throw new Error("انتهت جلسة تسجيل الدخول، سجل دخولك مرة أخرى");
    }

    const data = await response.json();
    const result = data?.data ?? data;

    const newAccessToken =
      result?.AccessToken ?? result?.accessToken;

    const newRefreshToken =
      result?.RefreshToken ?? result?.refreshToken;

    if (!newAccessToken) {
      clearAuthTokens();
      throw new Error("الخادم لم يرجع Access Token جديدًا");
    }

    // لو الخادم بيدعم تدوير Refresh Token، احفظ الجديد
    saveAuthTokens(
      newAccessToken,
      newRefreshToken || refreshToken
    );

    return newAccessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}


export async function getJSONWithRefresh(url) {
  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت أو من تشغيل الـ API"
    );
  }

  if (response.status !== 401) {
    if (!response.ok) {
      throw new Error(describeStatus(response.status));
    }

    return response.json();
  }

  // Access Token منتهي: جدده ثم أعد الطلب مرة واحدة
  await refreshAccessToken();

  try {
    response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
  } catch {
    throw new Error("تعذر الاتصال بالخادم");
  }

  if (response.status === 401) {
    clearAuthTokens();
    throw new Error("انتهت جلسة تسجيل الدخول");
  }

  if (!response.ok) {
    throw new Error(describeStatus(response.status));
  }

  return response.json();
}
