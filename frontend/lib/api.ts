// API client utilities for making HTTP requests

// Local API response type with status
interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

// API client configuration
interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Request options
interface RequestOptions extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

// Default configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
};

// Build URL with query parameters
function buildUrl(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(endpoint, baseUrl || window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// Create abort controller with timeout
function createAbortController(timeout: number): {
  controller: AbortController;
  timeoutId: NodeJS.Timeout;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
}

// Parse response based on content type
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  if (contentType?.includes("text/")) {
    return response.text() as unknown as T;
  }

  return response.blob() as unknown as T;
}

// Main fetch wrapper
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  config: ApiClientConfig = DEFAULT_CONFIG
): Promise<ApiResponse<T>> {
  const { timeout = config.timeout || 30000, params, ...fetchOptions } = options;
  const url = buildUrl(config.baseUrl || "", endpoint, params);
  const { controller, timeoutId } = createAbortController(timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...config.headers,
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await parseResponse<{ message?: string }>(response);
      return {
        data: null as unknown as T,
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    const data = await parseResponse<T>(response);
    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          data: null as unknown as T,
          error: "Request timeout",
          status: 408,
        };
      }
      return {
        data: null as unknown as T,
        error: error.message,
        status: 0,
      };
    }

    return {
      data: null as unknown as T,
      error: "Unknown error occurred",
      status: 0,
    };
  }
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions, config?: ApiClientConfig) =>
    request<T>(endpoint, { ...options, method: "GET" }, config),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
    config?: ApiClientConfig
  ) =>
    request<T>(
      endpoint,
      { ...options, method: "POST", body: JSON.stringify(data) },
      config
    ),

  put: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
    config?: ApiClientConfig
  ) =>
    request<T>(
      endpoint,
      { ...options, method: "PUT", body: JSON.stringify(data) },
      config
    ),

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
    config?: ApiClientConfig
  ) =>
    request<T>(
      endpoint,
      { ...options, method: "PATCH", body: JSON.stringify(data) },
      config
    ),

  delete: <T>(endpoint: string, options?: RequestOptions, config?: ApiClientConfig) =>
    request<T>(endpoint, { ...options, method: "DELETE" }, config),
};

// Create configured API client
export function createApiClient(config: ApiClientConfig) {
  return {
    get: <T>(endpoint: string, options?: RequestOptions) =>
      api.get<T>(endpoint, options, config),
    post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
      api.post<T>(endpoint, data, options, config),
    put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
      api.put<T>(endpoint, data, options, config),
    patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
      api.patch<T>(endpoint, data, options, config),
    delete: <T>(endpoint: string, options?: RequestOptions) =>
      api.delete<T>(endpoint, options, config),
  };
}

// Retry wrapper
export async function withRetry<T>(
  fn: () => Promise<ApiResponse<T>>,
  maxRetries = 3,
  delay = 1000
): Promise<ApiResponse<T>> {
  let lastError: ApiResponse<T> | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await fn();

    if (!result.error) {
      return result;
    }

    lastError = result;

    // Don't retry on client errors (4xx)
    if (result.status >= 400 && result.status < 500) {
      return result;
    }

    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
    }
  }

  return lastError!;
}

// Batch requests
export async function batchRequests<T>(
  requests: (() => Promise<ApiResponse<T>>)[],
  concurrency = 5
): Promise<ApiResponse<T>[]> {
  const results: ApiResponse<T>[] = [];

  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((req) => req()));
    results.push(...batchResults);
  }

  return results;
}
