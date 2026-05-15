import { getIdToken } from './firebase'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getIdToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const json = await res.json() as { data?: T; message?: string }
  if (!res.ok) throw new Error(json.message ?? `Request failed: ${res.status}`)
  return json.data as T
}

export const api = {
  get:    <T>(path: string)                         => request<T>(path),
  post:   <T>(path: string, body: unknown)          => request<T>(path, { method: 'POST',  body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)          => request<T>(path, { method: 'PUT',   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown)          => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string)                         => request<T>(path, { method: 'DELETE' }),
}
