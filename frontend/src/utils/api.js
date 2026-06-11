const API_BASE =
  import.meta.env.VITE_API_URL || "https://nxt-mart-54ka.onrender.com";

export const apiUrl = (path) => `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
