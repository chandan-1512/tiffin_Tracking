const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const login = body =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const register = body =>
  api("/auth/register", {
    method: "POST",
    body: JSON.stringify(body)
  });
