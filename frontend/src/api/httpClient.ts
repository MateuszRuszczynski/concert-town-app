import { BASE_URL } from "./config";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

interface RequestOptions {
  headers?: HeadersInit;
  token?: string;
}

const getHeaders = ({ headers, token }: RequestOptions = {}): HeadersInit => ({
  ...DEFAULT_HEADERS,
  ...headers,
  ...(token && {
    Authorization: `Bearer ${token}`,
  }),
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const client = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetch(`${BASE_URL}${url}`, {
      headers: getHeaders(options),
    }).then(handleResponse<T>);
  },

  post<T>(
    url: string,
    data: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: getHeaders(options),
      body: JSON.stringify(data),
    }).then(handleResponse<T>);
  },

  patch<T>(
    url: string,
    data: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return fetch(`${BASE_URL}${url}`, {
      method: "PATCH",
      headers: getHeaders(options),
      body: JSON.stringify(data),
    }).then(handleResponse<T>);
  },

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: getHeaders(options),
    }).then(handleResponse<T>);
  },
};
