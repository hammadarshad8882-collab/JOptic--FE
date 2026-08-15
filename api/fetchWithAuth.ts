export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
) => {
  try {
    // 1. Check if the user is authorized
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const authData = await authResponse.json();

    if (!authData.success || !authData.user) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new Error("Unauthorized");
    }

    // 2. Prepare headers
    const headers = new Headers(options.headers);

    // Only set JSON Content-Type when the body is NOT FormData
    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // 3. Call the actual API
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};