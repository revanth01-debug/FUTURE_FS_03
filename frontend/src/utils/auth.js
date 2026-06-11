import Cookies from "js-cookie";

const TOKEN_KEY = "jwt-token";
const ROLE_KEY = "user-role";

const getCookieOptions = () => ({
  expires: 7,
  sameSite: "strict",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
});

export const setAuthSession = (token, role = "user") => {
  if (!token) return;
  Cookies.set(TOKEN_KEY, token, getCookieOptions());
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ROLE_KEY, role);
  }
};

export const getAuthToken = () => Cookies.get(TOKEN_KEY) || null;

export const getUserRole = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ROLE_KEY);
};

export const clearAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ROLE_KEY);
  }
};

export const isAuthenticated = () => Boolean(getAuthToken());
export const isAdmin = () => getUserRole() === "admin";
