export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    // 1. Check if the user is authorized by calling /me
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const authData = await authResponse.json();

    if (!authData.success || !authData.user) {
      // If not authorized, you can handle the redirect here or throw an error
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    // 2. If authorized, call the actual API
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Ensure cookies are sent
    });

    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
