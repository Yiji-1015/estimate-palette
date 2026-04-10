# API Spec (Frontend <-> Backend)

This document defines the API contract used by `src/api.ts`.

## Base Rules

- Base path: `/api`
- Content type:
  - JSON requests: `application/json`
  - File upload: `multipart/form-data`
- Identifier:
  - `rfpId` identifies one RFP/project thread

## Step 1: Reference Data

### 1) Get reference data
- Method: `GET`
- Path: `/api/reference`
- Response: reference payload for Step 1 UI

### 2) Save reference data
- Method: `PUT`
- Path: `/api/reference`
- Body: full Step 1 reference payload
- Response: saved payload or success metadata

### 3) Confirm reference data
- Method: `POST`
- Path: `/api/reference/confirm`
- Response: confirmation status

## Step 2: RFP Analysis

### 4) Upload RFP and start analysis
- Method: `POST`
- Path: `/api/rfp/upload`
- Body (`multipart/form-data`):
  - `file`: binary file (`pdf`, `hwp`, `docx`)
  - `docType`: string
- Response:
  - `rfpId`: string
  - optional analysis kickoff metadata

### 5) Get analysis result
- Method: `GET`
- Path: `/api/rfp-analysis/{rfpId}`
- Response: full Step 2 analysis payload

### 6) Save requirements
- Method: `PUT`
- Path: `/api/rfp/{rfpId}/requirements`
- Body: requirements array or requirements object
- Response: saved requirements or success metadata

### 7) Confirm requirements
- Method: `POST`
- Path: `/api/rfp/{rfpId}/confirm`
- Response: confirmation status

## Step 3: Estimation

### 8) Start estimation
- Method: `POST`
- Path: `/api/estimation/{rfpId}/start`
- Response: initial estimation state

### 9) Get estimation state
- Method: `GET`
- Path: `/api/estimation/{rfpId}`
- Response: full Step 3 state (messages, phase, interaction blocks)

### 10) Save one estimation phase
- Method: `PUT`
- Path: `/api/estimation/{rfpId}/phase/{phase}`
- Body: phase-specific payload
- Response: updated phase state

### 11) Confirm estimation scenario
- Method: `POST`
- Path: `/api/estimation/{rfpId}/confirm`
- Response: confirmation status

## Step 4: Review & Finalize

### 12) Get review data
- Method: `GET`
- Path: `/api/review/{rfpId}`
- Query (optional):
  - `scenario`: string (`minimal`, `recommended`, `extended`, etc.)
- Response: Step 4 sheet/evidence payload

### 13) Save review edits
- Method: `PUT`
- Path: `/api/review/{rfpId}`
- Body: edited sheet payload
- Response: updated review payload

### 14) Confirm final review
- Method: `POST`
- Path: `/api/review/{rfpId}/confirm`
- Response: confirmation status

### 15) Export review file
- Method: `GET`
- Path: `/api/review/{rfpId}/export`
- Query:
  - `format`: `pdf` or `xlsx`
- Response: file stream/download

## Frontend Usage

- Frontend should only call functions from `src/api.ts`.
- Pages/components should not call `fetch` directly.
- If backend domain is separate, set:
  - `VITE_API_BASE_URL=https://your-backend-domain`

