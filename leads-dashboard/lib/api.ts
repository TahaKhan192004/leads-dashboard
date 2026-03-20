import { JobResponse, JobStatusResponse, ScrapeRequest } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api/backend"
    : "http://localhost:8000");

export async function startScrapeJob(body: ScrapeRequest): Promise<JobResponse> {
  const res = await fetch(`${API_BASE}/scrape/async`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || "Failed to start scrape job");
  }
  return res.json();
}

export async function pollJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error("Failed to poll job status");
  return res.json();
}
