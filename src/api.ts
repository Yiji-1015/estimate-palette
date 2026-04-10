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

// Helper to build project-scoped paths
function projectPath(projectId: string, sub: string): string {
  return `/projects/${projectId}${sub}`;
}

export const api = {
  // ── Projects ──────────────────────────────────────────
  projects: {
    list: <T = unknown>() => request<T>("/projects"),
    create: <T = unknown>(data: { name: string; client: string }) =>
      request<T>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: <T = unknown>(projectId: string, data: { name?: string; client?: string }) =>
      request<T>(`/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: <T = unknown>(projectId: string) =>
      request<T>(`/projects/${projectId}`, {
        method: "DELETE",
      }),
  },

  // ── Reference Data (global) ───────────────────────────
  reference: {
    get: <T = unknown>() => request<T>("/reference"),
    save: <T = unknown>(data: unknown) =>
      request<T>("/reference", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    confirm: <T = unknown>() =>
      request<T>("/reference/confirm", {
        method: "POST",
      }),
  },

  // ── RFP Analysis (project-scoped) ─────────────────────
  rfp: {
    upload: <T = unknown>(projectId: string, file: File, docType: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      return requestForm<T>(projectPath(projectId, "/rfp/upload"), formData);
    },
    getAnalysis: <T = unknown>(projectId: string) =>
      request<T>(projectPath(projectId, "/rfp-analysis")),
    saveRequirements: <T = unknown>(projectId: string, requirements: unknown) =>
      request<T>(projectPath(projectId, "/rfp/requirements"), {
        method: "PUT",
        body: JSON.stringify(requirements),
      }),
    confirm: <T = unknown>(projectId: string) =>
      request<T>(projectPath(projectId, "/rfp/confirm"), {
        method: "POST",
      }),
  },

  // ── Estimation (project-scoped) ───────────────────────
  estimation: {
    start: <T = unknown>(projectId: string) =>
      request<T>(projectPath(projectId, "/estimation/start"), {
        method: "POST",
      }),
    get: <T = unknown>(projectId: string) =>
      request<T>(projectPath(projectId, "/estimation")),
    savePhase: <T = unknown>(projectId: string, phase: string, payload: unknown) =>
      request<T>(projectPath(projectId, `/estimation/phase/${phase}`), {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    confirm: <T = unknown>(projectId: string) =>
      request<T>(projectPath(projectId, "/estimation/confirm"), {
        method: "POST",
      }),
  },

  // ── Review (project-scoped) ───────────────────────────
  review: {
    get: <T = unknown>(projectId: string, scenario?: string) => {
      const query = scenario ? `?scenario=${encodeURIComponent(scenario)}` : "";
      return request<T>(projectPath(projectId, `/review${query}`));
    },
    save: <T = unknown>(projectId: string, payload: unknown) =>
      request<T>(projectPath(projectId, "/review"), {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    confirm: <T = unknown>(projectId: string) =>
      request<T>(projectPath(projectId, "/review/confirm"), {
        method: "POST",
      }),
    exportUrl: (projectId: string, format: "pdf" | "xlsx") =>
      buildUrl(projectPath(projectId, `/review/export?format=${format}`)),
  },
};
