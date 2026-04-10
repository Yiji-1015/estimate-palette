type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface ApiErrorPayload {
  message?: string;
  [key: string]: JsonValue | undefined;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
const apiPrefix = apiBaseUrl ? `${apiBaseUrl}/api` : "/api";

function buildUrl(path: string): string {
  return `${apiPrefix}${path}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const message =
      (body as ApiErrorPayload | undefined)?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, body as ApiErrorPayload | undefined);
  }

  return body as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  return parseResponse<T>(response);
}

async function requestForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    body: formData,
  });

  return parseResponse<T>(response);
}

export const api = {
  // Step 1: Reference data
  getReference: <T = unknown>() => request<T>("/reference"),
  saveReference: <T = unknown>(data: unknown) =>
    request<T>("/reference", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  confirmReference: <T = unknown>() =>
    request<T>("/reference/confirm", {
      method: "POST",
    }),

  // Step 2: RFP analysis
  uploadRfp: <T = unknown>(file: File, docType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);
    return requestForm<T>("/rfp/upload", formData);
  },
  getRfpAnalysis: <T = unknown>(rfpId: string) => request<T>(`/rfp-analysis/${rfpId}`),
  saveRequirements: <T = unknown>(rfpId: string, requirements: unknown) =>
    request<T>(`/rfp/${rfpId}/requirements`, {
      method: "PUT",
      body: JSON.stringify(requirements),
    }),
  confirmRequirements: <T = unknown>(rfpId: string) =>
    request<T>(`/rfp/${rfpId}/confirm`, {
      method: "POST",
    }),

  // Step 3: Estimation
  startEstimation: <T = unknown>(rfpId: string) =>
    request<T>(`/estimation/${rfpId}/start`, {
      method: "POST",
    }),
  getEstimation: <T = unknown>(rfpId: string) => request<T>(`/estimation/${rfpId}`),
  saveEstimationPhase: <T = unknown>(
    rfpId: string,
    phase: string,
    payload: unknown
  ) =>
    request<T>(`/estimation/${rfpId}/phase/${phase}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  confirmEstimation: <T = unknown>(rfpId: string) =>
    request<T>(`/estimation/${rfpId}/confirm`, {
      method: "POST",
    }),

  // Step 4: Review
  getReview: <T = unknown>(rfpId: string, scenario?: string) => {
    const query = scenario ? `?scenario=${encodeURIComponent(scenario)}` : "";
    return request<T>(`/review/${rfpId}${query}`);
  },
  saveReview: <T = unknown>(rfpId: string, payload: unknown) =>
    request<T>(`/review/${rfpId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  confirmReview: <T = unknown>(rfpId: string) =>
    request<T>(`/review/${rfpId}/confirm`, {
      method: "POST",
    }),
  exportReview: (rfpId: string, format: "pdf" | "xlsx") =>
    buildUrl(`/review/${rfpId}/export?format=${format}`),
};

