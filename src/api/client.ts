import { getServerUrl, getToken } from '../utils/storage';
import { ApiErrorBody } from '../types/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: { path: string; message: string }[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Listener = () => void;
const authLostListeners: Listener[] = [];

export function onAuthLost(listener: Listener): () => void {
  authLostListeners.push(listener);
  return () => {
    const index = authLostListeners.indexOf(listener);
    if (index > -1) authLostListeners.splice(index, 1);
  };
}

function emitAuthLost() {
  authLostListeners.forEach((l) => l());
}

function normalizeServerUrl(url: string): string {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return normalized.replace(/\/$/, '');
}

export function buildAbsoluteUrl(serverUrl: string, path: string): string {
  const base = normalizeServerUrl(serverUrl);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export async function publicGet(path: string): Promise<unknown> {
  const serverUrl = await getServerUrl();
  if (!serverUrl) throw new ApiError(0, 'No server URL configured');
  return request('GET', buildAbsoluteUrl(serverUrl, path));
}

export async function publicPost(path: string, body?: unknown): Promise<unknown> {
  const serverUrl = await getServerUrl();
  if (!serverUrl) throw new ApiError(0, 'No server URL configured');
  return request('POST', buildAbsoluteUrl(serverUrl, path), body);
}

export async function apiGet(path: string): Promise<unknown> {
  return authenticatedRequest('GET', path);
}

export async function apiPost(path: string, body?: unknown): Promise<unknown> {
  return authenticatedRequest('POST', path, body);
}

export async function apiPut(path: string, body?: unknown): Promise<unknown> {
  return authenticatedRequest('PUT', path, body);
}

export async function apiPatch(path: string, body?: unknown): Promise<unknown> {
  return authenticatedRequest('PATCH', path, body);
}

export async function apiDelete(path: string): Promise<unknown> {
  return authenticatedRequest('DELETE', path);
}

async function authenticatedRequest(
  method: Method,
  path: string,
  body?: unknown,
): Promise<unknown> {
  const [serverUrl, token] = await Promise.all([getServerUrl(), getToken()]);
  if (!serverUrl) throw new ApiError(0, 'No server URL configured');
  if (!token) throw new ApiError(401, 'Not authenticated');
  return request(method, buildAbsoluteUrl(serverUrl, path), body, token);
}

async function request(
  method: Method,
  url: string,
  body?: unknown,
  token?: string,
): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let fetchBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      fetchBody = body;
    } else {
      headers['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(body);
    }
  }

  console.log(`[API] ${method} ${url}`);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: fetchBody,
    });
  } catch (err) {
    console.error(`[API] network error for ${url}:`, err);
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('Network request failed')) {
      throw new ApiError(
        0,
        `Cannot reach server. Check the URL and that your device can access it (same network, no self-signed certificate issue).`,
      );
    }
    if (message.includes('SSL') || message.includes('certificate')) {
      throw new ApiError(
        0,
        `SSL certificate error. If using a self-signed certificate, try HTTP or a trusted certificate.`,
      );
    }
    throw new ApiError(0, `Network error: ${message}`);
  }

  if (res.status === 401) {
    emitAuthLost();
    const errBody = await parseErrorBody(res);
    throw new ApiError(401, errBody?.error ?? 'Session expired');
  }

  if (!res.ok) {
    const errBody = await parseErrorBody(res);
    const message = errBody?.error ?? `Request failed (${res.status})`;
    const detailsText = errBody?.details?.map((d) => `${d.path}: ${d.message}`).join('; ');
    throw new ApiError(
      res.status,
      detailsText ? `${message} (${detailsText})` : message,
      errBody?.details,
    );
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

async function parseErrorBody(res: Response): Promise<ApiErrorBody | undefined> {
  try {
    const body = await res.json();
    if (body && typeof body.error === 'string') {
      return body as ApiErrorBody;
    }
  } catch {
    // ignore
  }
  return undefined;
}
