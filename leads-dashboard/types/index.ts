export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  phone: string | null;
  address: string | null;
  rating: string | null;
  website: string | null;
  maps_url: string | null;
  keyword: string | null;
  emails: string[];
  firecrawl_emails: string[];
  socials: {
    facebook?: string[];
    linkedin?: string[];
    instagram?: string[];
    twitter?: string[];
    youtube?: string[];
    [key: string]: string[] | undefined;
  };
  business_summary: string | null;
  notes: string | null;
}

export interface LeadsResponse {
  data: Lead[];
  total: number;
}

export interface ScrapeRequest {
  search_query: string;
  max_leads: number;
  run_website_scraper: boolean;
  run_summary: boolean;
}

export interface JobResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: "pending" | "running" | "done" | "failed";
  result?: {
    keyword: string;
    total_leads: number;
    leads: Lead[];
  };
  error?: string;
}

export type SortField = "created_at" | "updated_at" | "business_name" | "rating";
export type SortOrder = "asc" | "desc";
export type EmailFilter = "all" | "with_email" | "without_email";
