# API Spec (Frontend ↔ Backend)

This document defines the API contract used by `src/api.ts`.

## Base Rules

- Base path: `/api`
- Content type:
  - JSON requests: `application/json`
  - File upload: `multipart/form-data`
- Identifiers:
  - `projectId` identifies one project (top-level resource)
- All project-scoped endpoints are nested under `/api/projects/{projectId}/...`
- Reference data is global (shared across all projects)

---

## Projects

### 1) List projects
- Method: `GET`
- Path: `/api/projects`
- Response: `Project[]`

### 2) Create project
- Method: `POST`
- Path: `/api/projects`
- Body: `{ name: string, client: string }`
- Response: `Project`

### 3) Update project
- Method: `PUT`
- Path: `/api/projects/{projectId}`
- Body: `{ name?: string, client?: string }`
- Response: `Project`

### 4) Delete project
- Method: `DELETE`
- Path: `/api/projects/{projectId}`
- Response: `{ success: true }`

---

## Reference Data (Global)

### 5) Get reference data
- Method: `GET`
- Path: `/api/reference`
- Response: reference payload for reference UI

### 6) Save reference data
- Method: `PUT`
- Path: `/api/reference`
- Body: full reference payload
- Response: saved payload or success metadata

### 7) Confirm reference data
- Method: `POST`
- Path: `/api/reference/confirm`
- Response: confirmation status

---

## RFP Analysis (Project-scoped)

### 8) Upload RFP and start analysis
- Method: `POST`
- Path: `/api/projects/{projectId}/rfp/upload`
- Body (`multipart/form-data`):
  - `file`: binary file (`pdf`, `hwp`, `docx`)
  - `docType`: string
- Response: analysis kickoff metadata

### 9) Get analysis result
- Method: `GET`
- Path: `/api/projects/{projectId}/rfp-analysis`
- Response: full analysis payload

### 10) Save requirements
- Method: `PUT`
- Path: `/api/projects/{projectId}/rfp/requirements`
- Body: requirements array or object
- Response: saved requirements or success metadata

### 11) Confirm requirements
- Method: `POST`
- Path: `/api/projects/{projectId}/rfp/confirm`
- Response: confirmation status

---

## Estimation (Project-scoped)

### 12) Start estimation
- Method: `POST`
- Path: `/api/projects/{projectId}/estimation/start`
- Response: initial estimation state

### 13) Get estimation state
- Method: `GET`
- Path: `/api/projects/{projectId}/estimation`
- Response: full estimation state (messages, phase, interaction blocks)

### 14) Save one estimation phase
- Method: `PUT`
- Path: `/api/projects/{projectId}/estimation/phase/{phase}`
- Body: phase-specific payload
- Response: updated phase state

### 15) Confirm estimation scenario
- Method: `POST`
- Path: `/api/projects/{projectId}/estimation/confirm`
- Response: confirmation status

---

## Review & Finalize (Project-scoped)

### 16) Get review data
- Method: `GET`
- Path: `/api/projects/{projectId}/review`
- Query (optional):
  - `scenario`: string (`minimal`, `recommended`, `extended`, etc.)
- Response: review sheet/evidence payload

### 17) Save review edits
- Method: `PUT`
- Path: `/api/projects/{projectId}/review`
- Body: edited sheet payload
- Response: updated review payload

### 18) Confirm final review
- Method: `POST`
- Path: `/api/projects/{projectId}/review/confirm`
- Response: confirmation status

### 19) Export review file
- Method: `GET`
- Path: `/api/projects/{projectId}/review/export`
- Query:
  - `format`: `pdf` or `xlsx`
- Response: file stream/download

---

## Frontend Usage

- Frontend should only call functions from `src/api.ts`.
- Pages/components should not call `fetch` directly.
- If backend domain is separate, set:
  - `VITE_API_BASE_URL=https://your-backend-domain`
