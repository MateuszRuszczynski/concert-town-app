import { BASE_URL } from './config';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

interface RequestOptions {
  headers?: HeadersInit;
  token?: string;
}

const getHeaders = ({ headers, token }: RequestOptions = {}): HeadersInit => ({
  ...DEFAULT_HEADERS,
  ...headers,
  ...(token && {
    Authorization: `Bearer ${token}`
  })
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw data;
  }

  return data as T;
};

export let refreshHandler: (() => Promise<string | null>) | null = null;

export function setRefreshHandler(handler: () => Promise<string | null>) {
  refreshHandler = handler;
}

async function performFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new Error(
      'Unable to connect to the server. Please check your connection or try again later.'
    );
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function requestWithRefresh<T>(
  url: string,
  init: RequestInit,
  options?: RequestOptions
): Promise<T> {
  let response = await performFetch(url, init);

  if (response.status === 401 && refreshHandler) {
    if (!refreshPromise) {
      refreshPromise = refreshHandler().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      const newInit = {
        ...init,
        headers: getHeaders({ ...options, token: newToken })
      };
      response = await performFetch(url, newInit);
    }
  }

  return handleResponse<T>(response);
}

export const client = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return requestWithRefresh<T>(
      `${BASE_URL}${url}`,
      { headers: getHeaders(options) },
      options
    );
  },
  post<T>(url: string, data: unknown, options?: RequestOptions): Promise<T> {
    return requestWithRefresh<T>(
      `${BASE_URL}${url}`,
      {
        method: 'POST',
        headers: getHeaders(options),
        body: JSON.stringify(data)
      },
      options
    );
  },
  patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<T> {
    return requestWithRefresh<T>(
      `${BASE_URL}${url}`,
      {
        method: 'PATCH',
        headers: getHeaders(options),
        body: JSON.stringify(data)
      },
      options
    );
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return requestWithRefresh<T>(
      `${BASE_URL}${url}`,
      {
        method: 'DELETE',
        headers: getHeaders(options)
      },
      options
    );
  }
};

export const { get, post, patch, delete: remove } = client;

async function rawPost<T>(url: string, data: unknown): Promise<T> {
  const response = await performFetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<T>(response);
}

export const rawClient = { post: rawPost };
