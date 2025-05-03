// This is a placeholder implementation based on the PRD
// The actual implementation should follow the feather-stub.ts interface

type FeatherRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  validateStatus?: (status: number) => boolean;
};

type FeatherResponse<T> = {
  data: T;
  status: number;
  headers: Record<string, string>;
  error?: Error;
};

const BASE_URL = 'http://localhost:3001';

// Implementing feather.call interface as mentioned in the PRD
const apiClient = async <T>(
  endpoint: string,
  options: FeatherRequestOptions = {}
): Promise<FeatherResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
    retries = 3,
    validateStatus = (status: number) => status >= 200 && status < 300,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal: controller.signal,
  };

  if (body) {
    if (body instanceof FormData) {
      // If body is FormData, don't set Content-Type, browser will set it with boundary
      delete requestOptions.headers!['Content-Type'];
      requestOptions.body = body;
      console.log('Sending FormData, removed Content-Type header');
    } else {
      requestOptions.body = JSON.stringify(body);
      console.log('Sending JSON data');
    }
  }
  
  console.log('Request options:', {
    url: `${BASE_URL}${endpoint}`,
    method,
    headers: requestOptions.headers,
    bodyType: body instanceof FormData ? 'FormData' : typeof body
  });

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < retries) {
    try {
      console.log(`Attempt ${attempt + 1}: Sending request to ${BASE_URL}${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      
      clearTimeout(timeoutId);
      console.log(`Response received with status: ${response.status}`);
      
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data: any;
      
      if (response.status !== 204) { // No content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      }

      if (!validateStatus(response.status)) {
        const error = new Error(`Request failed with status ${response.status}`);
        return {
          data,
          status: response.status,
          headers: responseHeaders,
          error,
        };
      }

      return {
        data,
        status: response.status,
        headers: responseHeaders,
      };
    } catch (error) {
      lastError = error as Error;
      attempt++;
      
      if (attempt >= retries) {
        break;
      }
      
      // Exponential backoff with jitter
      const delay = Math.min(1000 * 2 ** attempt + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  clearTimeout(timeoutId);
  
  throw lastError || new Error('Request failed after multiple attempts');
};

export default apiClient;