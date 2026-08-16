export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
) => {
  try {
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new Error("Unauthorized");
    }

    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};